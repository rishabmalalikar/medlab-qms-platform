//  server.js (final working version)
const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const path = require("path");
const cors = require("cors");
const app = express();
const port = 5000;
const multer = require("multer");
const upload = multer();

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toISOString().slice(0, 10); // Extract YYYY-MM-DD
}



//  Correct CORS setup (allow cookies from same IP)
app.use(cors({
  origin: "http://10.0.9.188:5000",
  credentials: true,
  methods: ["GET", "POST"]
}));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));




//  Database config
const db = {
  user: "sa",
  password: "KLes@2022_ProductioN",
  server: "ibmserver",
  database: "QMS",
  options: {
    encrypt: false,
    trustServerCertificate: true
  },
  port: 1433
};

//  Session middleware
app.use(session({
  name: "qms.sid",
  secret: "qms_secure_key",
  resave: false,
  saveUninitialized: false,
  store: new FileStore({
    path: path.join(__dirname, "sessions"),
    ttl: 2 * 60 * 60, // 1 day
    retries: 0
  }),
  cookie: {
    maxAge: 2 * 60 * 60 * 1000,
    secure: false, 
    httpOnly: true,
    sameSite: "lax"
  }
}));

//  Connect to SQL once
(async () => {
  try {
    const pool = await sql.connect(db);
    console.log(" Connected to SQL Server successfully.");
  } catch (err) {
    console.error("Database connection failed:", err);
  }
})();


app.use((req, res, next) => {
  if (!req.session.user && !req.path.startsWith("/login")) {
    return res.redirect("/login.html");
  }
  next();
});



//  Serve your frontend
app.use(express.static(path.join(__dirname, "public")));


//  Login route
app.post("/login", async (req, res) => {
  const { EID, password } = req.body;
  try {
    const pool = await sql.connect(db);
    const result = await pool.request()
      .input("EID", sql.NVarChar, EID)
      .query("SELECT * FROM employees WHERE EID = @EID");

    if (result.recordset.length === 0)
      return res.status(401).send("User not found");

    const user = result.recordset[0];
    if (password !== user.password)
      return res.status(401).send("Invalid password");

    req.session.user = {
      id: user.id,
      name: user.name,
      EID: user.EID,
      role: user.role
    };

    console.log(" Logged in user:", req.session.user);

    //  Return relative URLs (stay same origin)
    if (user.role === "admin") return res.json({ redirect: "/admin-dashboard.html" });
    if (user.role === "authorizer") return res.json({ redirect: "/authorizer-dashboard.html" });
    if (user.role === "employee") return res.json({ redirect: "/index.html" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).send("Server error");
  }
});

//  Middleware to check active session
function authMiddleware(req, res, next) {
  console.log(" Session Check:", req.session);
  if (!req.session.user) {
    return res.status(401).send("Unauthorized — Please log in first.");
  }
  next();
}

//  Role-based middleware
function roleMiddleware(roles) {
  return (req, res, next) => {
    if (!req.session.user || !roles.includes(req.session.user.role)) {
      return res.status(403).send("Access Denied");
    }
    next();
  };
}







//  Routes
app.get("/create-employee", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  console.log("🔍 Admin accessing Create Employee:", req.session.user);
  res.sendFile(path.join(__dirname, "public", "createEmployee.html"));
});

//  Handle Create Employee (Admin only)
app.post('/create-employee', async (req, res) => {
  console.log(" Create Employee Request:", req.body);

  if (!req.session.user || req.session.user.role !== 'admin') {
    console.log(" Unauthorized attempt to create employee.");
    return res.status(403).send('Access Denied — Admins only.');
  }

  const { name, EID, password, role } = req.body;

  if (!name || !EID || !password || !role) {
    return res.status(400).send('All fields are required.');
  }

  try {
    const pool = await sql.connect(db);

    // Check if employee already exists
    const existing = await pool.request()
      .input('EID', sql.NVarChar, EID)
      .query('SELECT * FROM employees WHERE EID = @EID');

    if (existing.recordset.length > 0) {
      return res.status(400).send('Employee with this EID already exists.');
    }

    // Insert new employee
    await pool.request()
      .input('name', sql.NVarChar, name)
      .input('EID', sql.NVarChar, EID)
      .input('password', sql.NVarChar, password)
      .input('role', sql.NVarChar, role)
      .query(`
        INSERT INTO employees (name, EID, password, role)
        VALUES (@name, @EID, @password, @role)
      `);

    console.log(" New employee created:", { name, EID, role });
    res.status(200).send('Employee created successfully.');
  } catch (err) {
    console.error('Error creating employee:', err.message);
    res.status(500).send('Internal Server Error');
  }
});


app.get("/admin-dashboard", authMiddleware, roleMiddleware(["admin"]), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
});

app.get("/authorizer-dashboard", authMiddleware, roleMiddleware(["authorizer"]), (req, res) => {
  res.sendFile(path.join(__dirname, "public", "authorizer-dashboard.html"));
});

app.get("/forms", authMiddleware, roleMiddleware(["employee", "admin"]), (req, res) => {
  console.log(" Accessing forms:", req.session.user);
  res.sendFile(path.join(__dirname, "public", "index.html"));
});








//  Logout
app.post("/logout", (req, res) => {
  console.log(" Logging out user:", req.session.user);
  const cookieName = req.session.cookie?.name || "qms.sid";

  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie(cookieName, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });
    console.log(" Session destroyed and cookie cleared");
    res.json({ message: "Logged out successfully" });
  });
});




async function updateFormAuthorization(formName, date, createdBy) {
  const pool = await sql.connect(db);
  await pool.request()
    .input("FormName", sql.NVarChar, formName)
    .input("ActivityDate", sql.Date, date)
    .input("CreatedBy", sql.NVarChar, createdBy)
    .query(`
      MERGE FormAuthorization AS target
      USING (SELECT @FormName AS FormName, @ActivityDate AS ActivityDate) AS src
      ON target.FormName = src.FormName AND target.ActivityDate = src.ActivityDate
      WHEN MATCHED THEN
        UPDATE SET CreatedBy = @CreatedBy
      WHEN NOT MATCHED THEN
        INSERT (FormName, ActivityDate, CreatedBy) VALUES (@FormName, @ActivityDate, @CreatedBy);
    `);
}























// ======================= DAILY ACTIVITY LOG =======================
// Fetch activities
//  Get all activities
app.get("/activities", async (req, res) => {
  try {
    const pool = await sql.connect(db);
    const result = await pool.request().query("SELECT * FROM Activities");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching activities:", err);
    res.status(500).send("Error fetching activities");
  }
});


// Save form and update FormAuthorization tracker
app.post("/submit", async (req, res) => {
  const { date, logs } = req.body;

  try {
    const pool = await sql.connect(db);
    const insertedIds = [];

    for (const log of logs) {
      const result = await pool.request()
        .input("ActivityID", sql.Int, log.activity_id)
        .input("ActivityDate", sql.Date, date)
        .input("Status", sql.Bit, log.status)
        .input("Remark", sql.NVarChar, log.remark || "")
        .query(`
          MERGE DailyActivityLog AS target
          USING (SELECT @ActivityID AS ActivityID, @ActivityDate AS ActivityDate) AS source
          ON (target.ActivityID = source.ActivityID AND target.ActivityDate = source.ActivityDate)
          WHEN MATCHED THEN
              UPDATE SET Status = @Status, Remark = @Remark
          WHEN NOT MATCHED THEN
              INSERT (ActivityID, ActivityDate, Status, Remark)
              VALUES (@ActivityID, @ActivityDate, @Status, @Remark)
          OUTPUT inserted.LogID;
        `);

      if (result.recordset?.length > 0) {
        insertedIds.push(result.recordset[0].LogID);
      }
    }

    //  Add or update FormAuthorization record (track who created the form)
    const formName = "Daily Activity Checklist"; //  must match consistently
    const userEID = req.session?.user?.EID || "unknown";

    await pool.request()
      .input("FormName", sql.NVarChar, formName)
      .input("ActivityDate", sql.Date, date)
      .input("CreatedBy", sql.NVarChar, userEID)
      .query(`
        MERGE FormAuthorization AS target
        USING (SELECT @FormName AS FormName, @ActivityDate AS ActivityDate) AS src
        ON target.FormName = src.FormName AND target.ActivityDate = src.ActivityDate
        WHEN MATCHED THEN
          UPDATE SET CreatedBy = @CreatedBy
        WHEN NOT MATCHED THEN
          INSERT (FormName, ActivityDate, CreatedBy)
          VALUES (@FormName, @ActivityDate, @CreatedBy);
      `);

    //  Always return once
    return res.json({ message: " Form saved successfully.", recordIds: insertedIds });
  } catch (err) {
    console.error("Error saving daily activity:", err);
    return res.status(500).send("Error saving form: " + err.message);
  }
});


//  Fetch form logs (with locking logic)
app.get("/logs/:date", async (req, res) => {
  try {
    const { date } = req.params;
    console.log("Fetching logs for date:", date);

    const pool = await sql.connect(db);

    
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Daily Activity Checklist") //  must match FormAuthorization
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus FROM FormAuthorization
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    console.log(" Lock Check Result:", lockCheck.recordset);

  
    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      console.log("Form locked:", lockCheck.recordset[0].AuthStatus);
      return res.status(403).json({
        locked: true,
        message: "This form is sent for authorization and locked.",
        logs: []
      });
    }

    // Step 2: Fetch logs
    const logsResult = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT d.ActivityID, d.Status, d.Remark, a.ActivityName
        FROM DailyActivityLog d
        JOIN Activities a ON d.ActivityID = a.ActivityID
        WHERE d.ActivityDate = @ActivityDate
      `);

    console.log(" Activity logs fetched:", logsResult.recordset.length, "records");

    return res.json({
      locked: false,
      message: " Form is editable.",
      logs: logsResult.recordset
    });

  } catch (err) {
    console.error("Error fetching logs:", err);
    return res.status(500).send("Error fetching logs: " + err.message);
  }
});


















// ======================= MICROSCOPE MAINTENANCE (Daily Based) =======================

//  Get logs for a specific date
app.get("/microscope-logs/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Check if this day's form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "MICROSCOPE MAINTENANCE")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This day's form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch microscopes and any existing maintenance logs for this date
    const result = await pool.request()
      .input("MaintenanceDate", sql.Date, date)
      .query(`
        SELECT 
          m.MicroscopeID,
          m.MicroscopeName + ' / ' + ISNULL(m.SerialNumber, '') AS Microscope,
          ISNULL(d.Cleaning, 0) AS Cleaning,
          ISNULL(d.WorkingCondition, '') AS WorkingCondition,
          ISNULL(d.Sign, '') AS Sign
        FROM Microscopes m
        LEFT JOIN DailyMicroscopeMaintenance d 
          ON m.MicroscopeID = d.MicroscopeID AND d.MaintenanceDate = @MaintenanceDate
        ORDER BY m.MicroscopeID
      `);

    res.json({ locked: false, logs: result.recordset });

  } catch (err) {
    console.error("Error fetching microscope logs:", err);
    res.status(500).send("Error fetching logs");
  }
});


//  Save daily logs
app.post("/submitMicroscopeLogs", async (req, res) => {
  try {
    const { date, logs } = req.body;
    const pool = await sql.connect(db);

    for (const l of logs) {
      await pool.request()
        .input("MicroscopeID", sql.Int, l.microscope_id)
        .input("MaintenanceDate", sql.Date, date)
        .input("Cleaning", sql.Bit, l.cleaning)
        .input("WorkingCondition", sql.NVarChar(255), l.working_condition || null)
        .input("Sign", sql.NVarChar(100), l.sign || null)
        .query(`
          MERGE DailyMicroscopeMaintenance AS target
          USING (SELECT @MicroscopeID AS MicroscopeID, @MaintenanceDate AS MaintenanceDate) AS source
          ON target.MicroscopeID = source.MicroscopeID AND target.MaintenanceDate = source.MaintenanceDate
          WHEN MATCHED THEN
            UPDATE SET Cleaning = @Cleaning, WorkingCondition = @WorkingCondition, Sign = @Sign
          WHEN NOT MATCHED THEN
            INSERT (MicroscopeID, MaintenanceDate, Cleaning, WorkingCondition, Sign)
            VALUES (@MicroscopeID, @MaintenanceDate, @Cleaning, @WorkingCondition, @Sign);
        `);
    }

    await updateFormAuthorization("MICROSCOPE MAINTENANCE", date, req.session?.user?.EID || "unknown");

    res.send(" Daily microscope maintenance saved successfully!");
  } catch (err) {
    console.error("Error saving microscope logs:", err);
    res.status(500).send("Error saving logs");
  }
});





















// ======================= BC6000Series MAINTENANCE (DAILY) =======================

app.get("/bc6000", (req, res) => {
  res.sendFile(path.join(__dirname, "bc6000.html"));
});

// Get all activities
app.get("/bc6000/activities", async (req, res) => {
  try {
    const pool = await sql.connect(db);
    const result = await pool.request()
      .query("SELECT activity_id, category, activity_name FROM bc6000_activities ORDER BY category, activity_id");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching BC6000 activities:", err);
    res.status(500).send("Error fetching BC6000 activities");
  }
});

// Get logs for a specific DATE
app.get("/bc6000/logs/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);
    const formName = "BC6000Series MAINTENANCE";

    //  Check lock status
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, formName)
      .input("ActivityDate", sql.Date, date)
      .query(`SELECT AuthStatus FROM FormAuthorization WHERE FormName=@FormName AND ActivityDate=@ActivityDate`);

    if (lockCheck.recordset.length > 0 &&
        ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch daily logs
    const result = await pool.request()
      .input("MaintenanceDate", sql.Date, date)
      .query(`
        SELECT a.activity_id, a.activity_name, a.category,
               ISNULL(l.done, 0) AS done,
               ISNULL(l.sign, '') AS sign
        FROM bc6000_activities a
        LEFT JOIN bc6000_daily_logs l
          ON a.activity_id = l.activity_id AND l.maintenance_date = @MaintenanceDate
        ORDER BY a.category, a.activity_id;
      `);

    res.json({ locked: false, logs: result.recordset });
  } catch (err) {
    console.error("Error fetching BC6000 logs:", err);
    res.status(500).send("Error fetching BC6000 logs");
  }
});

// Save or update logs for selected DATE
app.post("/bc6000/submit", async (req, res) => {
  try {
    const { date, logs } = req.body;
    const pool = await sql.connect(db);
    const formName = "BC6000Series MAINTENANCE";

    for (const log of logs) {
      await pool.request()
        .input("ActivityID", sql.Int, log.activity_id)
        .input("MaintenanceDate", sql.Date, date)
        .input("Done", sql.Bit, log.done)
        .input("Sign", sql.NVarChar(100), log.sign || null)
        .query(`
          MERGE bc6000_daily_logs AS target
          USING (SELECT @ActivityID AS ActivityID, @MaintenanceDate AS MaintenanceDate) AS src
          ON target.activity_id = src.ActivityID AND target.maintenance_date = src.MaintenanceDate
          WHEN MATCHED THEN
            UPDATE SET done = @Done, sign = @Sign
          WHEN NOT MATCHED THEN
            INSERT (activity_id, maintenance_date, done, sign)
            VALUES (@ActivityID, @MaintenanceDate, @Done, @Sign);
        `);
    }

    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
    res.send(" BC6000 Daily Maintenance saved successfully!");
  } catch (err) {
    console.error("Error saving BC6000 logs:", err);
    res.status(500).send("Error saving BC6000 logs");
  }
});













// ======================= WRIGHT'S STAIN LOG (Daily Based) =======================

//  Fetch Wright's log for a specific date
app.get("/wrights/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Check if form is locked for this date
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "WRIGHTS STAIN")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch existing entry for that day
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * 
        FROM wrights_stain_log 
        WHERE CONCAT(year, '-', RIGHT('0' + CAST(month AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST(day AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching Wright's Stain log:", err);
    res.status(500).send("Error fetching Wright's Stain log");
  }
});


//  Save or update Wright's log for one date
app.post("/wrights/submit", async (req, res) => {
  try {
    const { date, ph_buffer, ph_buffer4, ph_buffer7, stain_filtered,
      quality_of_staining, checked_by, remark, corrective_action, tech_sign } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("ph_buffer", sql.NVarChar(50), ph_buffer || null)
      .input("ph_buffer4", sql.NVarChar(50), ph_buffer4 || null)
      .input("ph_buffer7", sql.NVarChar(50), ph_buffer7 || null)
      .input("stain_filtered", sql.NVarChar(50), stain_filtered || null)
      .input("quality_of_staining", sql.NVarChar(100), quality_of_staining || null)
      .input("checked_by", sql.NVarChar(100), checked_by || null)
      .input("remark", sql.NVarChar(sql.MAX), remark || null)
      .input("corrective_action", sql.NVarChar(sql.MAX), corrective_action || null)
      .input("tech_sign", sql.NVarChar(100), tech_sign || null)
      .query(`
        MERGE wrights_stain_log AS target
        USING (SELECT @year AS year, @month AS month, @day AS day) AS source
        ON target.year = source.year AND target.month = source.month AND target.day = source.day
        WHEN MATCHED THEN
          UPDATE SET 
            ph_buffer=@ph_buffer, ph_buffer4=@ph_buffer4, ph_buffer7=@ph_buffer7,
            stain_filtered=@stain_filtered, quality_of_staining=@quality_of_staining,
            checked_by=@checked_by, remark=@remark,
            corrective_action=@corrective_action, tech_sign=@tech_sign
        WHEN NOT MATCHED THEN
          INSERT (year, month, day, ph_buffer, ph_buffer4, ph_buffer7, stain_filtered,
                  quality_of_staining, checked_by, remark, corrective_action, tech_sign)
          VALUES (@year, @month, @day, @ph_buffer, @ph_buffer4, @ph_buffer7, @stain_filtered,
                  @quality_of_staining, @checked_by, @remark, @corrective_action, @tech_sign);
      `);

    //  Update authorization record tracking
    const formName = "WRIGHTS STAIN";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" Wright's Stain log saved successfully!");
  } catch (err) {
    console.error("Error saving Wright's Stain log:", err);
    res.status(500).send("Error saving Wright's Stain log");
  }
});












// ======================= CENTRIFUGE MAINTENANCE LOG (Daily Based) =======================

//  Get log for specific date
app.get("/centrifuge/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Lock check
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "CENTRIFUGE MAINTENANCE")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch existing record for that date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * 
        FROM centrifuge_maintenance_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching centrifuge log:", err);
    res.status(500).send("Error fetching centrifuge log");
  }
});


//  Save or update single-day entry
app.post("/centrifuge/submit", async (req, res) => {
  try {
    const {
      date,
      cleaning_outside,
      cleaning_rotor_chamber,
      start_up,
      daily_sign,
      decontamination,
      weekly_sign,
      cleaning_cups,
      check_carbon_brushes,
      monthly_sign
    } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("cleaning_outside", sql.Bit, cleaning_outside ? 1 : 0)
      .input("cleaning_rotor_chamber", sql.Bit, cleaning_rotor_chamber ? 1 : 0)
      .input("start_up", sql.Bit, start_up ? 1 : 0)
      .input("daily_sign", sql.NVarChar(100), daily_sign || null)
      .input("decontamination", sql.Bit, decontamination ? 1 : 0)
      .input("weekly_sign", sql.NVarChar(100), weekly_sign || null)
      .input("cleaning_cups", sql.Bit, cleaning_cups ? 1 : 0)
      .input("check_carbon_brushes", sql.Bit, check_carbon_brushes ? 1 : 0)
      .input("monthly_sign", sql.NVarChar(100), monthly_sign || null)
      .query(`
        MERGE centrifuge_maintenance_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET
            cleaning_outside=@cleaning_outside,
            cleaning_rotor_chamber=@cleaning_rotor_chamber,
            start_up=@start_up,
            daily_sign=@daily_sign,
            decontamination=@decontamination,
            weekly_sign=@weekly_sign,
            cleaning_cups=@cleaning_cups,
            check_carbon_brushes=@check_carbon_brushes,
            monthly_sign=@monthly_sign
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],cleaning_outside,cleaning_rotor_chamber,start_up,daily_sign,
                  decontamination,weekly_sign,cleaning_cups,check_carbon_brushes,monthly_sign)
          VALUES (@year,@month,@day,@cleaning_outside,@cleaning_rotor_chamber,@start_up,@daily_sign,
                  @decontamination,@weekly_sign,@cleaning_cups,@check_carbon_brushes,@monthly_sign);
      `);

    const formName = "CENTRIFUGE MAINTENANCE";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" Centrifuge Maintenance Log saved successfully!");
  } catch (err) {
    console.error("Error saving centrifuge log:", err);
    res.status(500).send("Error saving centrifuge log");
  }
});










// ======================= WATERBATH MAINTENANCE LOG (Daily Based) =======================

//  Get log for a specific date
app.get("/waterbath/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Check if form is locked for this date
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "WATERBATH MAINTENANCE")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch entry for that date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * 
        FROM waterbath_maintenance_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching waterbath log:", err);
    res.status(500).send("Error fetching waterbath log");
  }
});


//  Save or update log for one date
app.post("/waterbath/submit", async (req, res) => {
  try {
    const { date, water_level, temperature, replace_water, daily_sign, decontamination } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("water_level", sql.NVarChar(100), water_level || null)
      .input("temperature", sql.NVarChar(100), temperature || null)
      .input("replace_water", sql.NVarChar(100), replace_water || null)
      .input("daily_sign", sql.NVarChar(100), daily_sign || null)
      .input("decontamination", sql.NVarChar(100), decontamination || null)
      .query(`
        MERGE waterbath_maintenance_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET 
            water_level=@water_level,
            temperature=@temperature,
            replace_water=@replace_water,
            daily_sign=@daily_sign,
            decontamination=@decontamination
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],water_level,temperature,replace_water,daily_sign,decontamination)
          VALUES (@year,@month,@day,@water_level,@temperature,@replace_water,@daily_sign,@decontamination);
      `);

    //  Update authorization tracking
    const formName = "WATERBATH MAINTENANCE";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" Waterbath maintenance log saved successfully!");
  } catch (err) {
    console.error("Error saving waterbath log:", err);
    res.status(500).send("Error saving waterbath log");
  }
});












// ======================= pH METER LOG (Daily Based) =======================

//  Fetch log for a specific date
app.get("/phmeter/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Check if form is locked for this date
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "pH METER")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch entry for that date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * 
        FROM ph_meter_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching pH meter log:", err);
    res.status(500).send("Error fetching pH meter log");
  }
});


//  Save or update entry for a specific date
app.post("/phmeter/submit", async (req, res) => {
  try {
    const { date, self_test, b_calibration, ph4, ph7, ph9, tech_sign, sup_sign } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("self_test", sql.NVarChar(100), self_test || null)
      .input("b_calibration", sql.NVarChar(100), b_calibration || null)
      .input("ph4", sql.Bit, ph4 ? 1 : 0)
      .input("ph7", sql.Bit, ph7 ? 1 : 0)
      .input("ph9", sql.Bit, ph9 ? 1 : 0)
      .input("tech_sign", sql.NVarChar(100), tech_sign || null)
      .input("sup_sign", sql.NVarChar(100), sup_sign || null)
      .query(`
        MERGE ph_meter_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET 
            self_test=@self_test,
            b_calibration=@b_calibration,
            ph4=@ph4,
            ph7=@ph7,
            ph9=@ph9,
            tech_sign=@tech_sign,
            sup_sign=@sup_sign
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],self_test,b_calibration,ph4,ph7,ph9,tech_sign,sup_sign)
          VALUES (@year,@month,@day,@self_test,@b_calibration,@ph4,@ph7,@ph9,@tech_sign,@sup_sign);
      `);

    const formName = "pH METER";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" pH Meter log saved successfully!");
  } catch (err) {
    console.error("Error saving pH meter log:", err);
    res.status(500).send("Error saving pH meter log");
  }
});










// ======================= OPERATOR MAINTENANCE SCHEDULE FOR XN1000 (Daily Based) =======================

//  Get log for a specific date
app.get("/operatorMaintenanceScheduleForXN1000/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Lock check
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Operator Maintenance Schedule For XN1000")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch existing record for that date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * 
        FROM schedule_for_XN_1000_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching Operator Maintenance logs:", err);
    res.status(500).send("Error fetching Operator Maintenance logs");
  }
});


//  Save or update single-day log
app.post("/operatorMaintenanceScheduleForXN1000/submit", async (req, res) => {
  try {
    const {
      date,
      perform_shutdown,
      cleaning,
      process_control,
      operator_signature,
      supervisor_signature
    } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("perform_shutdown", sql.Bit, perform_shutdown ? 1 : 0)
      .input("cleaning", sql.Bit, cleaning ? 1 : 0)
      .input("process_control", sql.Bit, process_control ? 1 : 0)
      .input("operator_signature", sql.NVarChar(100), operator_signature || null)
      .input("supervisor_signature", sql.NVarChar(100), supervisor_signature || null)
      .query(`
        MERGE schedule_for_XN_1000_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET perform_shutdown=@perform_shutdown, cleaning=@cleaning,
                     process_control=@process_control, operator_signature=@operator_signature,
                     supervisor_signature=@supervisor_signature
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],perform_shutdown,cleaning,process_control,operator_signature,supervisor_signature)
          VALUES (@year,@month,@day,@perform_shutdown,@cleaning,@process_control,@operator_signature,@supervisor_signature);
      `);

    const formName = "Operator Maintenance Schedule For XN1000";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" Operator Maintenance Log saved successfully!");
  } catch (err) {
    console.error("Error saving Operator Maintenance log:", err);
    res.status(500).send("Error saving Operator Maintenance log");
  }
});











// ======================= OPERATOR MAINTENANCE SCHEDULE FOR XN3100 LEFT (Daily) =======================

//  Get logs for specific date
app.get("/operatorMaintenanceScheduleForXN3100Left/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Lock Check
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Operator Maintenance Schedule For XN3100 Left")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch logs for the selected date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * FROM schedule_for_XN_3100_LEFT_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching XN3100 Left logs:", err);
    res.status(500).send("Error fetching XN3100 Left logs");
  }
});


//  Save or update logs for a single day
app.post("/operatorMaintenanceScheduleForXN3100Left/submit", async (req, res) => {
  try {const {date,perform_shutdown,cleaning,process_control,operator_signature,supervisor_signature} = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("perform_shutdown", sql.Bit, perform_shutdown ? 1 : 0)
      .input("cleaning", sql.Bit, cleaning ? 1 : 0)
      .input("process_control", sql.Bit, process_control ? 1 : 0)
      .input("operator_signature", sql.NVarChar(100), operator_signature || null)
      .input("supervisor_signature", sql.NVarChar(100), supervisor_signature || null)
      .query(`
        MERGE schedule_for_XN_3100_LEFT_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET perform_shutdown=@perform_shutdown, cleaning=@cleaning, 
                     process_control=@process_control, operator_signature=@operator_signature, 
                     supervisor_signature=@supervisor_signature
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],perform_shutdown,cleaning,process_control,operator_signature,supervisor_signature)
          VALUES (@year,@month,@day,@perform_shutdown,@cleaning,@process_control,@operator_signature,@supervisor_signature);
      `);

    //  Update authorization metadata
    const formName = "Operator Maintenance Schedule For XN3100 Left";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" XN3100 Left Maintenance Log saved successfully!");
  } catch (err) {
    console.error("Error saving XN3100 Left log:", err);
    res.status(500).send("Error saving XN3100 Left log");
  }
});












// ======================= OPERATOR MAINTENANCE SCHEDULE FOR XN3100 RIGHT (Daily) =======================

//  Get logs for a specific date
app.get("/operatorMaintenanceScheduleForXN3100Right/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Lock Check
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Operator Maintenance Schedule For XN3100 Right")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch data for selected date
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * FROM schedule_for_XN_3100_RIGHT_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching XN3100 Right logs:", err);
    res.status(500).send("Error fetching XN3100 Right logs");
  }
});


//  Save or update logs for a single date
app.post("/operatorMaintenanceScheduleForXN3100Right/submit", async (req, res) => {
  try {
    const {
      date,
      perform_shutdown,
      cleaning,
      process_control,
      operator_signature,
      supervisor_signature
    } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("perform_shutdown", sql.Bit, perform_shutdown ? 1 : 0)
      .input("cleaning", sql.Bit, cleaning ? 1 : 0)
      .input("process_control", sql.Bit, process_control ? 1 : 0)
      .input("operator_signature", sql.NVarChar(100), operator_signature || null)
      .input("supervisor_signature", sql.NVarChar(100), supervisor_signature || null)
      .query(`
        MERGE schedule_for_XN_3100_RIGHT_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET perform_shutdown=@perform_shutdown, cleaning=@cleaning, 
                     process_control=@process_control, operator_signature=@operator_signature, 
                     supervisor_signature=@supervisor_signature
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],perform_shutdown,cleaning,process_control,operator_signature,supervisor_signature)
          VALUES (@year,@month,@day,@perform_shutdown,@cleaning,@process_control,@operator_signature,@supervisor_signature);
      `);

    //  Update authorization metadata
    const formName = "Operator Maintenance Schedule For XN3100 Right";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" XN3100 Right Maintenance Log saved successfully!");
  } catch (err) {
    console.error("Error saving XN3100 Right log:", err);
    res.status(500).send("Error saving XN3100 Right log");
  }
});









// ======================= Maintenance ACL TOP 550 (Daily) =======================

//  Get maintenance logs for a specific date
app.get("/Maintenance_ACL_TOP_550/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    //  Check if form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Maintenance_ACL_TOP_550")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    //  Fetch data for that specific day
    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * FROM Maintenance_ACL_TOP_550_log
        WHERE CONCAT([year], '-', RIGHT('0' + CAST([month] AS VARCHAR(2)), 2), '-', RIGHT('0' + CAST([day] AS VARCHAR(2)), 2)) = @date
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching Maintenance ACL TOP 550 logs:", err);
    res.status(500).send("Error fetching Maintenance ACL TOP 550 logs");
  }
});


//  Save or update daily log
app.post("/Maintenance_ACL_TOP_550/submit", async (req, res) => {
  try {
    const {
      date,
      check_reagent,
      check_alignment_printer_paper,
      ext_cleaning_instrument,
      power_startup,
      check_instrument_interface,
      performed_system_prime,
      check_qc_result,
      tech_sign,
      supervisor_sign
    } = req.body;

    const dt = new Date(date);
    const year = dt.getFullYear();
    const month = dt.getMonth() + 1;
    const day = dt.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("check_reagent", sql.Bit, check_reagent ? 1 : 0)
      .input("check_alignment_printer_paper", sql.Bit, check_alignment_printer_paper ? 1 : 0)
      .input("ext_cleaning_instrument", sql.Bit, ext_cleaning_instrument ? 1 : 0)
      .input("power_startup", sql.Bit, power_startup ? 1 : 0)
      .input("check_instrument_interface", sql.Bit, check_instrument_interface ? 1 : 0)
      .input("performed_system_prime", sql.Bit, performed_system_prime ? 1 : 0)
      .input("check_qc_result", sql.Bit, check_qc_result ? 1 : 0)
      .input("tech_sign", sql.NVarChar(100), tech_sign || null)
      .input("supervisor_sign", sql.NVarChar(100), supervisor_sign || null)
      .query(`
        MERGE Maintenance_ACL_TOP_550_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET check_reagent=@check_reagent,
                     check_alignment_printer_paper=@check_alignment_printer_paper,
                     ext_cleaning_instrument=@ext_cleaning_instrument,
                     power_startup=@power_startup,
                     check_instrument_interface=@check_instrument_interface,
                     performed_system_prime=@performed_system_prime,
                     check_qc_result=@check_qc_result,
                     tech_sign=@tech_sign,
                     supervisor_sign=@supervisor_sign
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],
                  check_reagent,check_alignment_printer_paper,ext_cleaning_instrument,
                  power_startup,check_instrument_interface,performed_system_prime,
                  check_qc_result,tech_sign,supervisor_sign)
          VALUES (@year,@month,@day,
                  @check_reagent,@check_alignment_printer_paper,@ext_cleaning_instrument,
                  @power_startup,@check_instrument_interface,@performed_system_prime,
                  @check_qc_result,@tech_sign,@supervisor_sign);
      `);

    //  Update authorization record
    const formName = "Maintenance_ACL_TOP_550";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");

    res.send(" Maintenance ACL TOP 550 Daily Log saved successfully!");
  } catch (err) {
    console.error("Error saving Maintenance ACL TOP 550 log:", err);
    res.status(500).send("Error saving Maintenance ACL TOP 550 log");
  }
});











// ======================= SYSMEX SP50 (DAY-BASED) =======================
app.get("/sysmex/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();

    const pool = await sql.connect(db);

    // Lock check
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "Operator Maintenance Schedule For Sysmex SP-50")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        logs: []
      });
    }

    // Fetch existing record for that day
    const result = await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(`
        SELECT * FROM schedule_for_SYSMEX_SP_50_log
        WHERE [year]=@year AND [month]=@month AND [day]=@day
      `);

    res.json(result.recordset[0] || {}); // Return single record for that day
  } catch (err) {
    console.error("Error fetching Sysmex logs:", err);
    res.status(500).send("Error fetching Sysmex logs");
  }
});


// Save / Update daily Sysmex entry
app.post("/sysmex/submit", async (req, res) => {
  try {
    const { date, log } = req.body;
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("perform_shutdown", sql.Bit, log.perform_shutdown)
      .input("cleaning", sql.Bit, log.cleaning)
      .input("replacement_of_stain", sql.Bit, log.replacement_of_stain)
      .input("stain1_wright", sql.Bit, log.stain1_wright)
      .input("stain2_giemsa", sql.Bit, log.stain2_giemsa)
      .input("operator_signature", sql.NVarChar, log.operator_signature)
      .input("supervisor_signature", sql.NVarChar, log.supervisor_signature)
      .query(`
        MERGE schedule_for_SYSMEX_SP_50_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET perform_shutdown=@perform_shutdown, cleaning=@cleaning, replacement_of_stain=@replacement_of_stain,
                     stain1_wright=@stain1_wright, stain2_giemsa=@stain2_giemsa,
                     operator_signature=@operator_signature, supervisor_signature=@supervisor_signature
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],perform_shutdown,cleaning,replacement_of_stain,stain1_wright,stain2_giemsa,
                  operator_signature,supervisor_signature)
          VALUES (@year,@month,@day,@perform_shutdown,@cleaning,@replacement_of_stain,
                  @stain1_wright,@stain2_giemsa,@operator_signature,@supervisor_signature);
      `);

    res.send(" Sysmex SP50 daily log saved/updated!");

    const formName = "Operator Maintenance Schedule For Sysmex SP-50";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
  } catch (err) {
    console.error("Error saving Sysmex logs:", err);
    res.status(500).send("Error saving Sysmex logs");
  }
});












// ======================= INTER-OBSERVER RECORD MALARIAL (DAILY) =======================
app.get("/interobserver/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    // Check if the form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "INTER-OBSERVER RECORD MALARIAL")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        log: null
      });
    }

    const result = await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(`
        SELECT * FROM inter_observer_record_malarial_log
        WHERE [year]=@year AND [month]=@month AND [day]=@day
      `);

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("Error fetching Inter-Observer log:", err);
    res.status(500).send("Error fetching Inter-Observer log");
  }
});


app.post("/interobserver/submit", async (req, res) => {
  try {
    const { date, log } = req.body;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("sample_no", sql.NVarChar, log.sample_no)
      .input("result1", sql.NVarChar, log.result1)
      .input("consultant1", sql.NVarChar, log.consultant1)
      .input("result2", sql.NVarChar, log.result2)
      .input("consultant2", sql.NVarChar, log.consultant2)
      .input("consistent_status", sql.NVarChar, log.consistent_status)
      .input("remarks", sql.NVarChar, log.remarks)
      .query(`
        MERGE inter_observer_record_malarial_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET sample_no=@sample_no, result1=@result1, consultant1=@consultant1,
                     result2=@result2, consultant2=@consultant2,
                     consistent_status=@consistent_status, remarks=@remarks
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],sample_no,result1,consultant1,result2,consultant2,consistent_status,remarks)
          VALUES (@year,@month,@day,@sample_no,@result1,@consultant1,@result2,@consultant2,@consistent_status,@remarks);
      `);

    res.send(" Inter-Observer daily record saved successfully!");

    const formName = "INTER-OBSERVER RECORD MALARIAL";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
  } catch (err) {
    console.error("Error saving Inter-Observer log:", err);
    res.status(500).send("Error saving Inter-Observer log");
  }
});











// ======================= INTER-OBSERVER RECORD - RETICULOCYTE COUNT (DAILY) =======================
app.get("/interobserver_Reticulocyte/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    //  Check if this form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "INTER-OBSERVER RECORD Reticulocyte Count")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        log: null
      });
    }

    //  Fetch existing data (if any)
    const result = await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(`
        SELECT * FROM inter_observer_record_Reticulocyte_Count_log
        WHERE [year]=@year AND [month]=@month AND [day]=@day
      `);

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("Error fetching Inter-Observer Reticulocyte log:", err);
    res.status(500).send("Error fetching Inter-Observer Reticulocyte log");
  }
});


app.post("/interobserver_Reticulocyte/submit", async (req, res) => {
  try {
    const { date, log } = req.body;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("sample_no", sql.NVarChar, log.sample_no)
      .input("result1", sql.NVarChar, log.result1)
      .input("consultant1", sql.NVarChar, log.consultant1)
      .input("result2", sql.NVarChar, log.result2)
      .input("consultant2", sql.NVarChar, log.consultant2)
      .input("consistent_status", sql.NVarChar, log.consistent_status)
      .input("remarks", sql.NVarChar, log.remarks)
      .query(`
        MERGE inter_observer_record_Reticulocyte_Count_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET sample_no=@sample_no, result1=@result1, consultant1=@consultant1,
                     result2=@result2, consultant2=@consultant2,
                     consistent_status=@consistent_status, remarks=@remarks
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],sample_no,result1,consultant1,result2,consultant2,consistent_status,remarks)
          VALUES (@year,@month,@day,@sample_no,@result1,@consultant1,@result2,@consultant2,@consistent_status,@remarks);
      `);

    res.send(" Inter-Observer (Reticulocyte) record saved successfully!");

    // Update authorization tracking
    const formName = "INTER-OBSERVER RECORD Reticulocyte Count";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
  } catch (err) {
    console.error("Error saving Inter-Observer Reticulocyte log:", err);
    res.status(500).send("Error saving Inter-Observer Reticulocyte log");
  }
});











// ======================= INTER-OBSERVER RECORD - BODY FLUIDS (DAILY) =======================
app.get("/interobserver_Body_Fluids/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    //  Check if form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "INTER-OBSERVER RECORD Body Fluids")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        log: null
      });
    }

    //  Fetch existing record if any
    const result = await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(`
        SELECT * FROM inter_observer_record_Body_Fluids_log
        WHERE [year]=@year AND [month]=@month AND [day]=@day
      `);

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("Error fetching Inter-Observer Body Fluids log:", err);
    res.status(500).send("Error fetching Inter-Observer Body Fluids log");
  }
});


app.post("/interobserver_Body_Fluids/submit", async (req, res) => {
  try {
    const { date, log } = req.body;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("sample_no", sql.NVarChar, log.sample_no)
      .input("result1", sql.NVarChar, log.result1)
      .input("consultant1", sql.NVarChar, log.consultant1)
      .input("result2", sql.NVarChar, log.result2)
      .input("consultant2", sql.NVarChar, log.consultant2)
      .input("consistent_status", sql.NVarChar, log.consistent_status)
      .input("remarks", sql.NVarChar, log.remarks)
      .query(`
        MERGE inter_observer_record_Body_Fluids_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET sample_no=@sample_no, result1=@result1, consultant1=@consultant1,
                     result2=@result2, consultant2=@consultant2,
                     consistent_status=@consistent_status, remarks=@remarks
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],sample_no,result1,consultant1,result2,consultant2,consistent_status,remarks)
          VALUES (@year,@month,@day,@sample_no,@result1,@consultant1,@result2,@consultant2,@consistent_status,@remarks);
      `);

    res.send(" Inter-Observer (Body Fluids) record saved successfully!");

    const formName = "INTER-OBSERVER RECORD Body Fluids";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
  } catch (err) {
    console.error("Error saving Inter-Observer Body Fluids log:", err);
    res.status(500).send("Error saving Inter-Observer Body Fluids log");
  }
});










// ======================= INTER-OBSERVER RECORD - PERIPHERAL SMEAR (DAILY) =======================
app.get("/interobserver_Peripheral_Smear/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    //  Check if form is locked
    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "INTER-OBSERVER RECORD Peripheral Smear")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName = @FormName AND ActivityDate = @ActivityDate
      `);

    if (
      lockCheck.recordset.length > 0 &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({
        locked: true,
        message: " This form is sent for authorization and locked.",
        log: null
      });
    }

    //  Fetch existing record if any
    const result = await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(`
        SELECT * FROM inter_observer_record_Peripheral_Smear_log
        WHERE [year]=@year AND [month]=@month AND [day]=@day
      `);

    res.json(result.recordset[0] || {});
  } catch (err) {
    console.error("Error fetching Inter-Observer Peripheral Smear log:", err);
    res.status(500).send("Error fetching Inter-Observer Peripheral Smear log");
  }
});

app.post("/interobserver_Peripheral_Smear/submit", async (req, res) => {
  try {
    const { date, log } = req.body;
    const parsed = new Date(date);
    const year = parsed.getFullYear();
    const month = parsed.getMonth() + 1;
    const day = parsed.getDate();

    const pool = await sql.connect(db);

    await pool.request()
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .input("sample_no", sql.NVarChar, log.sample_no)
      .input("result1", sql.NVarChar, log.result1)
      .input("consultant1", sql.NVarChar, log.consultant1)
      .input("result2", sql.NVarChar, log.result2)
      .input("consultant2", sql.NVarChar, log.consultant2)
      .input("consistent_status", sql.NVarChar, log.consistent_status)
      .input("remarks", sql.NVarChar, log.remarks)
      .query(`
        MERGE inter_observer_record_Peripheral_Smear_log AS target
        USING (SELECT @year AS [year], @month AS [month], @day AS [day]) AS src
        ON target.[year]=src.[year] AND target.[month]=src.[month] AND target.[day]=src.[day]
        WHEN MATCHED THEN
          UPDATE SET sample_no=@sample_no, result1=@result1, consultant1=@consultant1,
                     result2=@result2, consultant2=@consultant2,
                     consistent_status=@consistent_status, remarks=@remarks
        WHEN NOT MATCHED THEN
          INSERT ([year],[month],[day],sample_no,result1,consultant1,result2,consultant2,consistent_status,remarks)
          VALUES (@year,@month,@day,@sample_no,@result1,@consultant1,@result2,@consultant2,@consistent_status,@remarks);
      `);

    res.send(" Inter-Observer (Peripheral Smear) record saved successfully!");

    const formName = "INTER-OBSERVER RECORD Peripheral Smear";
    await updateFormAuthorization(formName, date, req.session?.user?.EID || "unknown");
  } catch (err) {
    console.error("Error saving Inter-Observer Peripheral Smear log:", err);
    res.status(500).send("Error saving Inter-Observer Peripheral Smear log");
  }

});











// ================== ABG_COBAS_b221_Log ==================
app.get("/abg-cobas-b221/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT * FROM ABG_COBAS_b221_Log
        WHERE ActivityDate = @ActivityDate
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "No data present" });

    const row = result.recordset[0];

    if (["pending", "authorized"].includes(row.auth_status)) {
      return res.status(403).json({
        locked: true,
        message: "Form sent for authorization and locked",
        data: row
      });
    }

    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ABG data");
  }
});



app.post("/abg-cobas-b221/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("check_fluid_level", sql.NVarChar, d.check_fluid_level)
      .input("check_printer_paper", sql.NVarChar, d.check_printer_paper)
      .input("clean_needle_fillport", sql.NVarChar, d.clean_needle_fillport)
      .input("perform_cleaning_conditioning", sql.NVarChar, d.perform_cleaning_conditioning)
      .input("surface_cleaning", sql.NVarChar, d.surface_cleaning)
      .input("staff_initial", sql.NVarChar, d.staff_initial)
      .input("perform_all_daily_maintenance", sql.NVarChar, d.perform_all_daily_maintenance)
      .input("clean_sample_drip_tray", sql.NVarChar, d.clean_sample_drip_tray)
      .input("clean_chassis", sql.NVarChar, d.clean_chassis)
      .query(`
        MERGE ABG_COBAS_b221_Log AS target
        USING (SELECT @ActivityDate AS ActivityDate) AS source
        ON target.ActivityDate = source.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          check_fluid_level=@check_fluid_level,
          check_printer_paper=@check_printer_paper,
          clean_needle_fillport=@clean_needle_fillport,
          perform_cleaning_conditioning=@perform_cleaning_conditioning,
          surface_cleaning=@surface_cleaning,
          staff_initial=@staff_initial,
          perform_all_daily_maintenance=@perform_all_daily_maintenance,
          clean_sample_drip_tray=@clean_sample_drip_tray,
          clean_chassis=@clean_chassis
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate, check_fluid_level, check_printer_paper,
          clean_needle_fillport, perform_cleaning_conditioning,
          surface_cleaning, staff_initial,
          perform_all_daily_maintenance, clean_sample_drip_tray, clean_chassis
        ) VALUES (
          @ActivityDate, @check_fluid_level, @check_printer_paper,
          @clean_needle_fillport, @perform_cleaning_conditioning,
          @surface_cleaning, @staff_initial,
          @perform_all_daily_maintenance, @clean_sample_drip_tray, @clean_chassis
        );
      `);

    // ✅ VERY IMPORTANT
    const formName = "ABG COBAS b 221 MAINTENANCE";

    await pool.request()
      .input("FormName", sql.NVarChar, formName)
      .input("ActivityDate", sql.Date, d.date)
      .input("CreatedBy", sql.NVarChar, req.session?.user?.EID || "user")
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM FormAuthorization
          WHERE FormName=@FormName AND ActivityDate=@ActivityDate
        )
        INSERT INTO FormAuthorization (FormName, ActivityDate, CreatedBy, AuthStatus)
        VALUES (@FormName, @ActivityDate, @CreatedBy, 'draft')
      `);

    res.send("ABG COBAS b 221 data saved successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving ABG data");
  }
});










// ================== ABG_COBAS_b221_Log ==================
app.get("/9180-ise/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT * FROM ISE_9180_Log
        WHERE ActivityDate = @ActivityDate
      `);

    if (result.recordset.length === 0)
      return res.status(404).json({ message: "No data present" });

    const row = result.recordset[0];

    if (["pending", "authorized"].includes(row.auth_status)) {
      return res.status(403).json({
        locked: true,
        message: "Form sent for authorization and locked",
        data: row
      });
    }

    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching ISE data");
  }
});



app.post("/9180-ise/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("check_fluid_level", sql.NVarChar, d.check_fluid_level)
      .input("check_printer_paper", sql.NVarChar, d.check_printer_paper)
      .input("clean_needle_fillport", sql.NVarChar, d.clean_needle_fillport)
      .input("perform_cleaning_conditioning", sql.NVarChar, d.perform_cleaning_conditioning)
      .input("surface_cleaning", sql.NVarChar, d.surface_cleaning)
      .input("staff_initial", sql.NVarChar, d.staff_initial)
      .input("perform_all_daily_maintenance", sql.NVarChar, d.perform_all_daily_maintenance)
      .input("clean_sample_drip_tray", sql.NVarChar, d.clean_sample_drip_tray)
      .input("clean_chassis", sql.NVarChar, d.clean_chassis)
      .query(`
        MERGE ISE_9180_Log AS target
        USING (SELECT @ActivityDate AS ActivityDate) AS source
        ON target.ActivityDate = source.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          check_fluid_level=@check_fluid_level,
          check_printer_paper=@check_printer_paper,
          clean_needle_fillport=@clean_needle_fillport,
          perform_cleaning_conditioning=@perform_cleaning_conditioning,
          surface_cleaning=@surface_cleaning,
          staff_initial=@staff_initial,
          perform_all_daily_maintenance=@perform_all_daily_maintenance,
          clean_sample_drip_tray=@clean_sample_drip_tray,
          clean_chassis=@clean_chassis
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate, check_fluid_level, check_printer_paper,
          clean_needle_fillport, perform_cleaning_conditioning,
          surface_cleaning, staff_initial,
          perform_all_daily_maintenance, clean_sample_drip_tray, clean_chassis
        ) VALUES (
          @ActivityDate, @check_fluid_level, @check_printer_paper,
          @clean_needle_fillport, @perform_cleaning_conditioning,
          @surface_cleaning, @staff_initial,
          @perform_all_daily_maintenance, @clean_sample_drip_tray, @clean_chassis
        );
      `);

    // ✅ VERY IMPORTANT
    const formName = "9180 ISE MAINTENANCE";

    await pool.request()
      .input("FormName", sql.NVarChar, formName)
      .input("ActivityDate", sql.Date, d.date)
      .input("CreatedBy", sql.NVarChar, req.session?.user?.EID || "user")
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM FormAuthorization
          WHERE FormName=@FormName AND ActivityDate=@ActivityDate
        )
        INSERT INTO FormAuthorization (FormName, ActivityDate, CreatedBy, AuthStatus)
        VALUES (@FormName, @ActivityDate, @CreatedBy, 'draft')
      `);

    res.send("9180 ISE data saved successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving ISE data");
  }
});











// ================== d10-hemoglobin ==================
app.get("/d10-hemoglobin/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT * FROM D10_Hemoglobin_Maintenance_Log
        WHERE ActivityDate = @ActivityDate
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No entry present" });
    }

    const row = result.recordset[0];

    if (["pending", "authorized"].includes(row.auth_status)) {
      return res.status(403).json({
        locked: true,
        message: "Form is locked",
        data: row
      });
    }

    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching D-10 form data");
  }
});


app.post("/d10-hemoglobin/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("surface_cleaning", sql.NVarChar, d.surface_cleaning)
      .input("check_method_setting", sql.NVarChar, d.check_method_setting)
      .input("check_buffer_wash_levels", sql.NVarChar, d.check_buffer_wash_levels)
      .input("cartridge_injection_count", sql.NVarChar, d.cartridge_injection_count)
      .input("check_waste_level", sql.NVarChar, d.check_waste_level)
      .input("pressure_reading", sql.NVarChar, d.pressure_reading)
      .input("check_for_leaks", sql.NVarChar, d.check_for_leaks)
      .input("check_paper_supply", sql.NVarChar, d.check_paper_supply)
      .input("remove_samples", sql.NVarChar, d.remove_samples)
      .input("wipe_spills", sql.NVarChar, d.wipe_spills)
      .input("initials", sql.NVarChar, d.initials)
      .query(`
        MERGE D10_Hemoglobin_Maintenance_Log AS target
        USING (SELECT @ActivityDate AS ActivityDate) AS src
        ON target.ActivityDate = src.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          surface_cleaning=@surface_cleaning,
          check_method_setting=@check_method_setting,
          check_buffer_wash_levels=@check_buffer_wash_levels,
          cartridge_injection_count=@cartridge_injection_count,
          check_waste_level=@check_waste_level,
          pressure_reading=@pressure_reading,
          check_for_leaks=@check_for_leaks,
          check_paper_supply=@check_paper_supply,
          remove_samples=@remove_samples,
          wipe_spills=@wipe_spills,
          initials=@initials,
          auth_status='draft'
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate,
          surface_cleaning, check_method_setting, check_buffer_wash_levels,
          cartridge_injection_count, check_waste_level, pressure_reading,
          check_for_leaks, check_paper_supply, remove_samples,
          wipe_spills, initials
        ) VALUES (
          @ActivityDate,
          @surface_cleaning, @check_method_setting, @check_buffer_wash_levels,
          @cartridge_injection_count, @check_waste_level, @pressure_reading,
          @check_for_leaks, @check_paper_supply, @remove_samples,
          @wipe_spills, @initials
        );
      `);

    // 🔐 Register in FormAuthorization
    await pool.request()
      .input("FormName", sql.NVarChar, "D-10 HEMOGLOBIN-DM22C30002 TESTING SYSTEM")
      .input("ActivityDate", sql.Date, d.date)
      .input("CreatedBy", sql.NVarChar, req.session.user.EID)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM FormAuthorization
          WHERE FormName=@FormName AND ActivityDate=@ActivityDate
        )
        INSERT INTO FormAuthorization (FormName, ActivityDate, CreatedBy, AuthStatus)
        VALUES (@FormName, @ActivityDate, @CreatedBy, 'draft')
      `);

    res.send("D-10 Hemoglobin-DM22C30002 maintenance saved successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving D-10 data");
  }
});












// ================== d10-hemoglobin-DM22K09803 ==================
app.get("/d10-hemoglobin-DM22K09803/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT * FROM D10_Hemoglobin_DM22K09803_Maintenance_Log
        WHERE ActivityDate = @ActivityDate
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "No entry present" });
    }

    const row = result.recordset[0];

    if (["pending", "authorized"].includes(row.auth_status)) {
      return res.status(403).json({
        locked: true,
        message: "Form is locked",
        data: row
      });
    }

    res.json(row);

  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching D-10 form data");
  }
});


app.post("/d10-hemoglobin-DM22K09803/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("surface_cleaning", sql.NVarChar, d.surface_cleaning)
      .input("check_method_setting", sql.NVarChar, d.check_method_setting)
      .input("check_buffer_wash_levels", sql.NVarChar, d.check_buffer_wash_levels)
      .input("cartridge_injection_count", sql.NVarChar, d.cartridge_injection_count)
      .input("check_waste_level", sql.NVarChar, d.check_waste_level)
      .input("pressure_reading", sql.NVarChar, d.pressure_reading)
      .input("check_for_leaks", sql.NVarChar, d.check_for_leaks)
      .input("check_paper_supply", sql.NVarChar, d.check_paper_supply)
      .input("remove_samples", sql.NVarChar, d.remove_samples)
      .input("wipe_spills", sql.NVarChar, d.wipe_spills)
      .input("initials", sql.NVarChar, d.initials)
      .query(`
        MERGE D10_Hemoglobin_DM22K09803_Maintenance_Log AS target
        USING (SELECT @ActivityDate AS ActivityDate) AS src
        ON target.ActivityDate = src.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          surface_cleaning=@surface_cleaning,
          check_method_setting=@check_method_setting,
          check_buffer_wash_levels=@check_buffer_wash_levels,
          cartridge_injection_count=@cartridge_injection_count,
          check_waste_level=@check_waste_level,
          pressure_reading=@pressure_reading,
          check_for_leaks=@check_for_leaks,
          check_paper_supply=@check_paper_supply,
          remove_samples=@remove_samples,
          wipe_spills=@wipe_spills,
          initials=@initials,
          auth_status='draft'
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate,
          surface_cleaning, check_method_setting, check_buffer_wash_levels,
          cartridge_injection_count, check_waste_level, pressure_reading,
          check_for_leaks, check_paper_supply, remove_samples,
          wipe_spills, initials
        ) VALUES (
          @ActivityDate,
          @surface_cleaning, @check_method_setting, @check_buffer_wash_levels,
          @cartridge_injection_count, @check_waste_level, @pressure_reading,
          @check_for_leaks, @check_paper_supply, @remove_samples,
          @wipe_spills, @initials
        );
      `);

    // 🔐 Register in FormAuthorization
    await pool.request()
      .input("FormName", sql.NVarChar, "D-10 HEMOGLOBIN-DM22K09803 TESTING SYSTEM")
      .input("ActivityDate", sql.Date, d.date)
      .input("CreatedBy", sql.NVarChar, req.session.user.EID)
      .query(`
        IF NOT EXISTS (
          SELECT 1 FROM FormAuthorization
          WHERE FormName=@FormName AND ActivityDate=@ActivityDate
        )
        INSERT INTO FormAuthorization (FormName, ActivityDate, CreatedBy, AuthStatus)
        VALUES (@FormName, @ActivityDate, @CreatedBy, 'draft')
      `);

    res.send(" D-10 HEMOGLOBIN-DM22K09803 TESTING SYSTEM saved successfully");

  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving D-10 data");
  }
});










// ================== COBAS PRO INTEGRATED LOG ==================
app.get("/cobas-pro-integrated/:date", async (req, res) => {
  try {
    const { date } = req.params;
    console.log("Fetching data for date:", date);
    const pool = await sql.connect(db);

    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "COBAS PRO INTEGRATED")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName=@FormName AND ActivityDate=@ActivityDate
      `);

      console.log("Lock check result:", lockCheck.recordset);

    if (!lockCheck.recordset.length &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({ locked: true });
    }

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`SELECT * FROM Cobas_PRO_Integrated_Log WHERE ActivityDate=@ActivityDate`);


      console.log("Cobas_PRO_Integrated_Log result:", result.recordset);

    if (!result.recordset.length)
      return res.status(404).send("No entry");

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).send("Error fetching data");
  }
});


app.post("/cobas-pro-integrated/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("wash_rack", sql.NVarChar, d.wash_rack)
      .input("ise_calibration_daily", sql.NVarChar, d.ise_calibration_daily)
      .input("weekly_rack_probe_clean", sql.NVarChar, d.weekly_rack_probe_clean)
      .input("ise_calibration_weekly", sql.NVarChar, d.ise_calibration_weekly)
      .input("reaction_cells", sql.NVarChar, d.reaction_cells)
      .input("photometer_lamp", sql.NVarChar, d.photometer_lamp)
      .input("sipper_flow_path_wash", sql.NVarChar, d.sipper_flow_path_wash)
      .input("filled_by", sql.NVarChar, d.filled_by)
      .query(`
        MERGE Cobas_PRO_Integrated_Log AS t
        USING (SELECT @ActivityDate AS ActivityDate) s
        ON t.ActivityDate = s.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          wash_rack=@wash_rack,
          ise_calibration_daily=@ise_calibration_daily,
          weekly_rack_probe_clean=@weekly_rack_probe_clean,
          ise_calibration_weekly=@ise_calibration_weekly,
          reaction_cells=@reaction_cells,
          photometer_lamp=@photometer_lamp,
          sipper_flow_path_wash=@sipper_flow_path_wash,
          filled_by=@filled_by,
          auth_status='draft'
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate, wash_rack, ise_calibration_daily,
          weekly_rack_probe_clean, ise_calibration_weekly,
          reaction_cells, photometer_lamp,
          sipper_flow_path_wash, filled_by
        )
        VALUES (
          @ActivityDate, @wash_rack, @ise_calibration_daily,
          @weekly_rack_probe_clean, @ise_calibration_weekly,
          @reaction_cells, @photometer_lamp,
          @sipper_flow_path_wash, @filled_by
        );
      `);

    await updateFormAuthorization(
      "COBAS PRO INTEGRATED",
      d.date,
      req.session?.user?.EID || "unknown"
    );

    res.send("Saved successfully");
  } catch (err) {
    res.status(500).send("Error saving form");
  }
});









// ================== COBAS PURE INTEGRATED LOG ==================
app.get("/cobas-pure-integrated/:date", async (req, res) => {
  try {
    const { date } = req.params;
    const pool = await sql.connect(db);

    const lockCheck = await pool.request()
      .input("FormName", sql.NVarChar, "COBAS PURE INTEGRATED")
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT AuthStatus 
        FROM FormAuthorization 
        WHERE FormName=@FormName AND ActivityDate=@ActivityDate
      `);

    if (
      lockCheck.recordset.length &&
      ["pending", "authorized"].includes(lockCheck.recordset[0].AuthStatus)
    ) {
      return res.status(403).json({ locked: true });
    }

    const result = await pool.request()
      .input("ActivityDate", sql.Date, date)
      .query(`SELECT * FROM Cobas_PURE_Integrated_Log WHERE ActivityDate=@ActivityDate`);

    if (!result.recordset.length)
      return res.status(404).send("No entry");

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send("Error fetching data");
  }
});


app.post("/cobas-pure-integrated/submit", async (req, res) => {
  try {
    const d = req.body;
    const pool = await sql.connect(db);

    await pool.request()
      .input("ActivityDate", sql.Date, d.date)
      .input("wash_rack", sql.NVarChar, d.wash_rack)
      .input("ise_calibration_daily", sql.NVarChar, d.ise_calibration_daily)
      .input("weekly_rack_probe_clean", sql.NVarChar, d.weekly_rack_probe_clean)
      .input("ise_calibration_weekly", sql.NVarChar, d.ise_calibration_weekly)
      .input("reaction_cells", sql.NVarChar, d.reaction_cells)
      .input("photometer_lamp", sql.NVarChar, d.photometer_lamp)
      .input("sipper_flow_path_wash", sql.NVarChar, d.sipper_flow_path_wash)
      .input("filled_by", sql.NVarChar, d.filled_by)
      .query(`
        MERGE Cobas_PURE_Integrated_Log AS t
        USING (SELECT @ActivityDate AS ActivityDate) s
        ON t.ActivityDate = s.ActivityDate
        WHEN MATCHED THEN UPDATE SET
          wash_rack=@wash_rack,
          ise_calibration_daily=@ise_calibration_daily,
          weekly_rack_probe_clean=@weekly_rack_probe_clean,
          ise_calibration_weekly=@ise_calibration_weekly,
          reaction_cells=@reaction_cells,
          photometer_lamp=@photometer_lamp,
          sipper_flow_path_wash=@sipper_flow_path_wash,
          filled_by=@filled_by,
          auth_status='draft'
        WHEN NOT MATCHED THEN INSERT (
          ActivityDate, wash_rack, ise_calibration_daily,
          weekly_rack_probe_clean, ise_calibration_weekly,
          reaction_cells, photometer_lamp,
          sipper_flow_path_wash, filled_by
        )
        VALUES (
          @ActivityDate, @wash_rack, @ise_calibration_daily,
          @weekly_rack_probe_clean, @ise_calibration_weekly,
          @reaction_cells, @photometer_lamp,
          @sipper_flow_path_wash, @filled_by
        );
      `);

    await updateFormAuthorization(
      "COBAS PURE INTEGRATED",
      d.date,
      req.session?.user?.EID || "unknown"
    );

    res.send("Saved successfully");
  } catch (err) {
    res.status(500).send("Error saving form");
  }
});









// ================== pathology LOT verification ==================
// CHECK ENTRY BY DATE
app.get("/check-reagent/:date", async (req, res) => {
  const date = req.params.date;
  const pool = await sql.connect(db);

  const formResult = await pool.request()
    .input("d",sql.Date,date)
.query(`
SELECT *
FROM Verification_Reagent_Lot_Pathology
WHERE ActivityDate=@d
ORDER BY id
`);

  const authResult = await pool.request()
    .input("d", sql.Date, date)
    .input("f", sql.NVarChar, "LOT VERIFICATION PATHOLOGY")
    .query(`
      SELECT AuthStatus 
      FROM FormAuthorization 
      WHERE ActivityDate=@d AND FormName=@f
    `);

  if (formResult.recordset.length === 0) {
    return res.json({ exists: false });
  }

  res.json({
    exists: true,
    records: formResult.recordset,
    authStatus: authResult.recordset[0]?.AuthStatus || "draft"
});
});


// SAVE FORM
app.post("/save-reagent", async (req,res)=>{
  const d = req.body;
  const pool = await sql.connect(db);

  for(const e of req.body.entries){

   if(e.id){

      // Existing row -> UPDATE

      await pool.request()
      .input("id", sql.Int, e.id)

      .input("reagent_name", sql.NVarChar, e.reagent_name)
      .input("old_lot_no", sql.NVarChar, e.old_lot_no)
      .input("old_expiry_date", sql.Date, e.old_expiry_date)

      .input("new_lot_no", sql.NVarChar, e.new_lot_no)
      .input("new_expiry_date", sql.Date, e.new_expiry_date)

      .input("verification_test", sql.NVarChar, e.verification_test)
      .input("material_used", sql.NVarChar, e.material_used)

      .input("result_status", sql.NVarChar, e.result_status)

      .input("R1", sql.NVarChar, e.R1)
      .input("R2", sql.NVarChar, e.R2)
      .input("Calculation", sql.NVarChar, e.Calculation)

      .input("remarks", sql.NVarChar, e.remarks)
      .input("tech_sign", sql.NVarChar, e.tech_sign)

      .query(`
      UPDATE Verification_Reagent_Lot_Pathology
      SET
      reagent_name=@reagent_name,
      old_lot_no=@old_lot_no,
      old_expiry_date=@old_expiry_date,

      new_lot_no=@new_lot_no,
      new_expiry_date=@new_expiry_date,

      verification_test=@verification_test,
      material_used=@material_used,

      result_status=@result_status,

      R1=@R1,
      R2=@R2,
      Calculation=@Calculation,

      remarks=@remarks,
      tech_sign=@tech_sign

      WHERE id=@id
      `);

   }else{

      // New row -> INSERT

      await pool.request()
      .input("ActivityDate", sql.Date, d.ActivityDate)

      .input("reagent_name", sql.NVarChar, e.reagent_name)
      .input("old_lot_no", sql.NVarChar, e.old_lot_no)
      .input("old_expiry_date", sql.Date, e.old_expiry_date)

      .input("new_lot_no", sql.NVarChar, e.new_lot_no)
      .input("new_expiry_date", sql.Date, e.new_expiry_date)

      .input("verification_test", sql.NVarChar, e.verification_test)
      .input("material_used", sql.NVarChar, e.material_used)

      .input("result_status", sql.NVarChar, e.result_status)

      .input("R1", sql.NVarChar, e.R1)
      .input("R2", sql.NVarChar, e.R2)
      .input("Calculation", sql.NVarChar, e.Calculation)

      .input("remarks", sql.NVarChar, e.remarks)
      .input("tech_sign", sql.NVarChar, e.tech_sign)

      .query(`
      INSERT INTO Verification_Reagent_Lot_Pathology
      (
      ActivityDate,
      reagent_name,
      old_lot_no,
      old_expiry_date,
      new_lot_no,
      new_expiry_date,
      verification_test,
      material_used,
      result_status,
      R1,
      R2,
      Calculation,
      remarks,
      tech_sign
      )
      VALUES
      (
      @ActivityDate,
      @reagent_name,
      @old_lot_no,
      @old_expiry_date,
      @new_lot_no,
      @new_expiry_date,
      @verification_test,
      @material_used,
      @result_status,
      @R1,
      @R2,
      @Calculation,
      @remarks,
      @tech_sign
      )
      `);
   }
}
res.send("Saved");
});

// SEND TO AUTHORIZATION (LOCK)
app.post("/send-reagent-auth/:date", async (req, res) => {
  const date = req.params.date;
  const user = req.session.user;

  const pool = await sql.connect(db);

  await pool.request()
    .input("FormName", sql.NVarChar, "LOT VERIFICATION PATHOLOGY")
    .input("ActivityDate", sql.Date, date)
    .input("CreatedBy", sql.NVarChar, user.name)
    .query(`
      MERGE FormAuthorization AS t
      USING (SELECT @FormName AS FormName, @ActivityDate AS ActivityDate) s
      ON t.FormName = s.FormName AND t.ActivityDate = s.ActivityDate
      WHEN MATCHED THEN
        UPDATE SET AuthStatus='pending'
      WHEN NOT MATCHED THEN
        INSERT (FormName, ActivityDate, CreatedBy, AuthStatus)
        VALUES (@FormName, @ActivityDate, @CreatedBy, 'pending');
    `);

  res.send("Sent to authorization");

  
});

app.delete("/delete-reagent/:id", async(req,res)=>{

 const pool = await sql.connect(db);

 await pool.request()
 .input("id",sql.Int,req.params.id)
 .query(`
 DELETE FROM Verification_Reagent_Lot_Pathology
 WHERE id=@id
 `);

 res.send("Deleted");

});











// ================== biochemistry LOT verification ==================
app.get("/check-validation/:date", async (req, res) => {
  const { date } = req.params;

  try {
    const pool = await sql.connect(db);

    const result = await pool.request()
      .input("date", sql.Date, date)
      .query(`
        SELECT * FROM Validation_Reagent_New_Lot_Record
        WHERE ActivityDate = @date
      `);

    if (result.recordset.length === 0) {
      return res.json({ exists: false });
    }

    return res.json({
      exists: true,
      row: result.recordset[0]
    });

  } catch (err) {
    console.error("Check entry error:", err);
    res.status(500).send("Error checking entry");
  }
});



app.post("/save-validation", async (req, res) => {
  const data = req.body;

  try {
    // Validate and format the date
    if (!data.ActivityDate || isNaN(new Date(data.ActivityDate).getTime())) {
      return res.status(400).send("Invalid or missing date.");
    }

    const formattedDate = new Date(data.ActivityDate).toISOString().slice(0, 10); // Format as YYYY-MM-DD

    const pool = await sql.connect(db);

    const check = await pool.request()
      .input("date", sql.Date, formattedDate)
      .query(`SELECT * FROM Validation_Reagent_New_Lot_Record WHERE ActivityDate=@date`);

    if (check.recordset.length === 0) {
      // INSERT
      await pool.request()
        .input("ActivityDate", sql.Date, formattedDate)
        .input("ReagentName", sql.NVarChar, data.ReagentName)
        .input("LotNo", sql.NVarChar, data.LotNo)
        .input("ExpiryDate", sql.Date, data.ExpiryDate)
        .input("OpenDate", sql.Date, data.OpenDate)
        .input("OldLot_L1", sql.NVarChar, data.OldLot_L1)
        .input("OldLot_L2", sql.NVarChar, data.OldLot_L2)
        .input("NewLot_L1", sql.NVarChar, data.NewLot_L1)
        .input("NewLot_L2", sql.NVarChar, data.NewLot_L2)
        .input("AcceptableStatus", sql.NVarChar, data.AcceptableStatus)
        .input("TechnicianSignature", sql.NVarChar, data.TechnicianSignature)
        .query(`
          INSERT INTO Validation_Reagent_New_Lot_Record
          (ActivityDate, ReagentName, LotNo, ExpiryDate, OpenDate,
           OldLot_L1, OldLot_L2, NewLot_L1, NewLot_L2,
           AcceptableStatus, TechnicianSignature)
          VALUES
          (@ActivityDate, @ReagentName, @LotNo, @ExpiryDate, @OpenDate,
           @OldLot_L1, @OldLot_L2, @NewLot_L1, @NewLot_L2,
           @AcceptableStatus, @TechnicianSignature)
        `);

      return res.send("Inserted");
    } else {
      // UPDATE
      await pool.request()
        .input("ActivityDate", sql.Date, formattedDate)
        .input("ReagentName", sql.NVarChar, data.ReagentName)
        .input("LotNo", sql.NVarChar, data.LotNo)
        .input("ExpiryDate", sql.Date, data.ExpiryDate)
        .input("OpenDate", sql.Date, data.OpenDate)
        .input("OldLot_L1", sql.NVarChar, data.OldLot_L1)
        .input("OldLot_L2", sql.NVarChar, data.OldLot_L2)
        .input("NewLot_L1", sql.NVarChar, data.NewLot_L1)
        .input("NewLot_L2", sql.NVarChar, data.NewLot_L2)
        .input("AcceptableStatus", sql.NVarChar, data.AcceptableStatus)
        .input("TechnicianSignature", sql.NVarChar, data.TechnicianSignature)
        .query(`
          UPDATE Validation_Reagent_New_Lot_Record
          SET ReagentName=@ReagentName,
              LotNo=@LotNo,
              ExpiryDate=@ExpiryDate,
              OpenDate=@OpenDate,
              OldLot_L1=@OldLot_L1,
              OldLot_L2=@OldLot_L2,
              NewLot_L1=@NewLot_L1,
              NewLot_L2=@NewLot_L2,
              AcceptableStatus=@AcceptableStatus,
              TechnicianSignature=@TechnicianSignature
          WHERE ActivityDate=@ActivityDate
        `);

      return res.send("Updated");
    }
  } catch (err) {
    console.error("Save error:", err);
    res.status(500).send("Save failed");
  }
});

app.post("/send-validation-auth", async (req, res) => {
  const { FormName, ActivityDate } = req.body;
  const user = req.session.user?.EID || "unknown";

  try {
    const pool = await sql.connect(db);

    // Update main table
    await pool.request()
      .input("date", sql.Date, ActivityDate)
      .query(`
        UPDATE Validation_Reagent_New_Lot_Record
        SET auth_status='pending'
        WHERE ActivityDate=@date
      `);

    // Insert or update FormAuthorization
    await pool.request()
      .input("FormName", sql.NVarChar, FormName)
      .input("ActivityDate", sql.Date, ActivityDate)
      .input("CreatedBy", sql.NVarChar, user)
      .query(`
        MERGE FormAuthorization AS T
        USING (SELECT @FormName AS FormName, @ActivityDate AS ActivityDate) AS S
        ON T.FormName=S.FormName AND T.ActivityDate=S.ActivityDate
        WHEN MATCHED THEN
          UPDATE SET AuthStatus='pending'
        WHEN NOT MATCHED THEN
          INSERT (FormName, ActivityDate, CreatedBy, AuthStatus)
          VALUES (@FormName, @ActivityDate, @CreatedBy, 'pending');
      `);

    res.send("Sent for authorization");

  } catch (err) {
    console.error("Auth send error:", err);
    res.status(500).send("Authorization failed");
  }
});




app.post("/authorize-validation", async (req, res) => {
  const { date } = req.body;
  const authBy = req.session.user?.EID || "auth";

  const pool = await sql.connect(db);

  await pool.request()
    .input("date", sql.Date, date)
    .input("authBy", sql.NVarChar, authBy)
    .query(`
      UPDATE Validation_Reagent_New_Lot_Record
      SET auth_status='authorized', auth_by=@authBy, auth_date=GETDATE()
      WHERE ActivityDate=@date
    `);

  res.send("Authorized");
});



app.post("/reject-validation", async (req, res) => {
  const { date } = req.body;
  const authBy = req.session.user?.EID || "auth";

  const pool = await sql.connect(db);

  await pool.request()
    .input("date", sql.Date, date)
    .input("authBy", sql.NVarChar, authBy)
    .query(`
      UPDATE Validation_Reagent_New_Lot_Record
      SET auth_status='rejected', auth_by=@authBy, auth_date=GETDATE()
      WHERE ActivityDate=@date
    `);

  res.send("Rejected and unlocked");
});












// ================== Referral_Lab_Register ==================
app.post("/referral/save", upload.single("pdf"), async (req,res)=>{
 const p = await sql.connect(db);
 const lock = req.body.lock==="true";

 const q = req.body.RegisterID ?
 `UPDATE Referral_Lab_Register SET 
  SampleSentDateTime=@dt,SampleID=@sid,PatientID=@pid,PatientName=@pn,
  TestName=@t,SampleType=@st,ReferralLabName=@rl,SampleCollectedBy=@sc,
  ReportReceivedDate=@rd,ReportInformedTo=@ri,Remarks=@rm,
  RowStatus=@status,
  ReportPDF=ISNULL(@pdf,ReportPDF),ReportPDFName=ISNULL(@pdfname,ReportPDFName)
  WHERE RegisterID=@id`
 :
 `INSERT INTO Referral_Lab_Register
 (SampleSentDateTime,SampleID,PatientID,PatientName,TestName,SampleType,
 ReferralLabName,SampleCollectedBy,ReportReceivedDate,ReportInformedTo,
 ReportPDF,ReportPDFName,Remarks,RowStatus)
 VALUES (@dt,@sid,@pid,@pn,@t,@st,@rl,@sc,@rd,@ri,@pdf,@pdfname,@rm,@status)`;

 const r=p.request()
 .input("dt",sql.DateTime,req.body.SampleSentDateTime)
 .input("sid",sql.NVarChar,req.body.SampleID)
 .input("pid",sql.NVarChar,req.body.PatientID)
 .input("pn",sql.NVarChar,req.body.PatientName)
 .input("t",sql.NVarChar,req.body.TestName)
 .input("st",sql.NVarChar,req.body.SampleType)
 .input("rl",sql.NVarChar,req.body.ReferralLabName)
 .input("sc",sql.NVarChar,req.body.SampleCollectedBy)
 .input("rd",sql.Date,req.body.ReportReceivedDate||null)
 .input("ri",sql.NVarChar,req.body.ReportInformedTo)
 .input("rm",sql.NVarChar,req.body.Remarks)
 .input("status",sql.NVarChar, lock?"locked":"saved")
 .input("pdf",sql.VarBinary, req.file?req.file.buffer:null)
 .input("pdfname",sql.NVarChar, req.file?req.file.originalname:null);

 if(req.body.RegisterID) r.input("id",sql.Int,req.body.RegisterID);
 await r.query(q);
 res.send("OK");
});

app.get("/referral/list", async(req,res)=>{
 const p=await sql.connect(db);
 const r=await p.request()
 .input("s",sql.NVarChar,"%"+(req.query.sample||"")+"%")
 .input("p",sql.NVarChar,"%"+(req.query.patient||"")+"%")
 .query(`SELECT * FROM Referral_Lab_Register 
         WHERE SampleID LIKE @s AND PatientID LIKE @p
         ORDER BY RegisterID DESC`);
 res.json(r.recordset);
});

app.get("/referral/get/:id", async(req,res)=>{
 const p=await sql.connect(db);
 const r=await p.request().input("id",sql.Int,req.params.id)
 .query("SELECT * FROM Referral_Lab_Register WHERE RegisterID=@id");
 res.json(r.recordset[0]);
});

app.get("/referral/pdf/:id", async(req,res)=>{
 const p=await sql.connect(db);
 const r=await p.request().input("id",sql.Int,req.params.id)
 .query("SELECT ReportPDF,ReportPDFName FROM Referral_Lab_Register WHERE RegisterID=@id");
 res.contentType("application/pdf");
 res.send(r.recordset[0].ReportPDF);
});

app.get("/referral/filter", async (req, res) => {
  const p = await sql.connect(db);
  const r = p.request();

  let q = "SELECT * FROM Referral_Lab_Register WHERE 1=1";

  if (req.query.sampleDate) {
    q += " AND CAST(SampleSentDateTime AS DATE) = @sampleDate";
    r.input("sampleDate", sql.Date, req.query.sampleDate);
  }

  if (req.query.reportDate) {
    q += " AND ReportReceivedDate = @reportDate";
    r.input("reportDate", sql.Date, req.query.reportDate);
  }

  if (req.query.status) {
    q += " AND RowStatus = @status";
    r.input("status", sql.NVarChar, req.query.status);
  }

  q += " ORDER BY RegisterID DESC";

  const data = await r.query(q);
  res.json(data.recordset);
});













//  Send form for authorization (employee action)
app.post("/send-for-authorization", async (req, res) => {
  try {
    const { formName, date } = req.body;
    const userEID = req.session?.user?.EID || "unknown";

    const pool = await sql.connect(db);

    const check = await pool.request()
      .input("FormName", sql.NVarChar, formName)
      .input("ActivityDate", sql.Date, date)
      .query(`
        SELECT FormAuthID 
        FROM FormAuthorization 
        WHERE FormName=@FormName AND ActivityDate=@ActivityDate
      `);

    if (check.recordset.length === 0) {
      // INSERT
      await pool.request()
        .input("FormName", sql.NVarChar, formName)
        .input("ActivityDate", sql.Date, date)
        .input("CreatedBy", sql.NVarChar, userEID)
        .query(`
          INSERT INTO FormAuthorization
          (FormName, ActivityDate, CreatedBy, AuthStatus)
          VALUES (@FormName, @ActivityDate, @CreatedBy, 'pending')
        `);
    } else {
      // UPDATE
      await pool.request()
        .input("FormName", sql.NVarChar, formName)
        .input("ActivityDate", sql.Date, date)
        .query(`
          UPDATE FormAuthorization
          SET AuthStatus='pending'
          WHERE FormName=@FormName AND ActivityDate=@ActivityDate
        `);
    }

    res.send(`${formName} form sent for authorization.`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending for authorization");
  }
});





//  Get all pending forms (for authorizer dashboard)
app.get("/pending-forms", async (req, res) => {
  try {
    const pool = await sql.connect(db);
    const result = await pool.request()
      .query(`
        SELECT FormAuthID, FormName, ActivityDate, CreatedBy, AuthStatus
        FROM FormAuthorization
        WHERE AuthStatus = 'pending'
        ORDER BY ActivityDate DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching pending forms:", err);
    res.status(500).send("Error fetching pending forms: " + err.message);
  }
});



//  Authorize a single form
app.post("/authorize-form", async (req, res) => {
  try {
    const { authId } = req.body;
    const authorizedBy = req.session?.user?.EID || "unknown";

    const pool = await sql.connect(db);
    await pool.request()
      .input("FormAuthID", sql.Int, authId)
      .input("AuthBy", sql.NVarChar, authorizedBy)
      .query(`
        UPDATE FormAuthorization
        SET AuthStatus = 'authorized', AuthBy = @AuthBy, AuthDate = GETDATE()
        WHERE FormAuthID = @FormAuthID
      `);

    res.send(" Form authorized successfully.");
  } catch (err) {
    console.error("Error authorizing form:", err);
    res.status(500).send("Error authorizing form: " + err.message);
  }
});




//  Reject a form
app.post("/reject-form", async (req, res) => {
  try {
    const { authId } = req.body;
    const authorizedBy = req.session?.user?.EID || "unknown";

    const pool = await sql.connect(db);
    await pool.request()
      .input("FormAuthID", sql.Int, authId)
      .input("AuthBy", sql.NVarChar, authorizedBy)
      .query(`
        UPDATE FormAuthorization
        SET AuthStatus = 'rejected', AuthBy = @AuthBy, AuthDate = GETDATE()
        WHERE FormAuthID = @FormAuthID
      `);

    res.send("Form rejected successfully.");
  } catch (err) {
    console.error("Error rejecting form:", err);
    res.status(500).send("Error rejecting form: " + err.message);
  }
});




//  Bulk authorization for multiple forms
app.post("/bulk-authorization", async (req, res) => {
  try {
    const { authIds, action } = req.body; // action = "authorize" or "reject"
    const authorizedBy = req.session?.user?.EID || "unknown";

    if (!Array.isArray(authIds) || authIds.length === 0)
      return res.status(400).send("No forms selected.");

    const status = action === "authorize" ? "authorized" : "rejected";
    const pool = await sql.connect(db);

    const idList = authIds.join(",");
    await pool.request().query(`
      UPDATE FormAuthorization
      SET AuthStatus = '${status}', AuthBy = '${authorizedBy}', AuthDate = GETDATE()
      WHERE FormAuthID IN (${idList})
    `);

    res.send(` ${authIds.length} form(s) ${status}.`);
  } catch (err) {
    console.error("Bulk authorization error:", err);
    res.status(500).send("Error during bulk authorization: " + err.message);
  }
});




// ================== FETCH FORM DATA FOR AUTHORIZATION VIEW ==================
app.get("/view-form-data/:formName/:date", async (req, res) => {
  try {
    const { formName, date } = req.params;
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = parsedDate.getMonth() + 1;
    const day = parsedDate.getDate();

    const pool = await sql.connect(db);

    const tableMap = {
      "Daily Activity Checklist": "DailyActivityLog",
      "MICROSCOPE MAINTENANCE": "DailyMicroscopeMaintenance",
      "BC6000Series MAINTENANCE": "bc6000_daily_logs",
      "WRIGHTS STAIN": "wrights_stain_log",
      "CENTRIFUGE MAINTENANCE": "centrifuge_maintenance_log",
      "WATERBATH MAINTENANCE": "waterbath_maintenance_log",
      "pH METER": "ph_meter_log",
      "Operator Maintenance Schedule For XN1000": "schedule_for_XN_1000_log",
      "Operator Maintenance Schedule For XN3100 Left": "schedule_for_XN_3100_LEFT_log",
      "Operator Maintenance Schedule For XN3100 Right": "schedule_for_XN_3100_RIGHT_log",
      "Operator Maintenance Schedule For Sysmex SP-50": "schedule_for_SYSMEX_SP_50_log",
      "Maintenance_ACL_TOP_550": "Maintenance_ACL_TOP_550_log",
      "INTER-OBSERVER RECORD MALARIAL": "inter_observer_record_malarial_log",
      "INTER-OBSERVER RECORD Reticulocyte Count": "inter_observer_record_Reticulocyte_Count_log",
      "INTER-OBSERVER RECORD Body Fluids": "inter_observer_record_Body_Fluids_log",
      "INTER-OBSERVER RECORD Peripheral Smear": "inter_observer_record_Peripheral_Smear_log",
      "ABG COBAS b 221 MAINTENANCE": "ABG_COBAS_b221_Log",
      "9180 ISE MAINTENANCE": "ISE_9180_Log",
      "D-10 HEMOGLOBIN-DM22C30002 TESTING SYSTEM": "D10_Hemoglobin_Maintenance_Log",
      "D-10 HEMOGLOBIN-DM22K09803 TESTING SYSTEM": "D10_Hemoglobin_DM22K09803_Maintenance_Log",
      "COBAS PRO INTEGRATED": "Cobas_PRO_Integrated_Log",
      "COBAS PURE INTEGRATED": "Cobas_PURE_Integrated_Log",
      "LOT VERIFICATION PATHOLOGY": "Verification_Reagent_Lot_Pathology",
      "VALIDATION_REAGENT_NEW_LOT": "Validation_Reagent_New_Lot_Record"
    };

    const tableName = tableMap[formName];
    if (!tableName) return res.status(400).send("Invalid form name.");

    let query;

    //  Handle 3 date-based tables separately
    if (tableName === "DailyActivityLog") {
      query = `select ActivityName,ActivityDate,Status,Remark from DailyActivityLog A, Activities B WHERE  ActivityDate= @date AND a.ActivityID=b.ActivityID ORDER BY a.ActivityID ASC`;
    } 
    else if (tableName === "DailyMicroscopeMaintenance") {
      query = `SELECT MicroscopeName+'/'+SerialNumber,MaintenanceDate,Cleaning,WorkingCondition FROM DailyMicroscopeMaintenance A ,Microscopes B  WHERE MaintenanceDate = @date AND a.MicroscopeID=b.MicroscopeID  ORDER BY A.MicroscopeID ASC`;
    } 
    else if (tableName === "bc6000_daily_logs") {
      query = `select activity_name,maintenance_date,done from bc6000_daily_logs A, bc6000_activities B WHERE maintenance_date = @date AND A.activity_id=b.activity_id ORDER BY log_id ASC`;
    }
    else if (tableName === "ABG_COBAS_b221_Log") {
      query = `SELECT * FROM ABG_COBAS_b221_Log WHERE ActivityDate=@date  ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "ISE_9180_Log") {
      query = `SELECT * FROM ISE_9180_Log WHERE ActivityDate=@date  ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "D10_Hemoglobin_Maintenance_Log") {
      query = `SELECT * FROM D10_Hemoglobin_Maintenance_Log WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "D10_Hemoglobin_DM22K09803_Maintenance_Log") {
      query = `SELECT * FROM D10_Hemoglobin_DM22K09803_Maintenance_Log WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "Cobas_PRO_Integrated_Log") {
      query = `SELECT * FROM Cobas_PRO_Integrated_Log WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "Cobas_PURE_Integrated_Log") {
      query = `SELECT * FROM Cobas_PURE_Integrated_Log WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "Verification_Reagent_Lot_Pathology") {
      query = `SELECT * FROM Verification_Reagent_Lot_Pathology WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else if (tableName === "Validation_Reagent_New_Lot_Record") {
      query = `SELECT * FROM Validation_Reagent_New_Lot_Record WHERE ActivityDate=@date ORDER BY ActivityDate ASC`;
    }
    else {
      //  Add [day] filter for all year/month/day tables
      query = `SELECT * FROM ${tableName} WHERE [year]=@year AND [month]=@month AND [day]=@day ORDER BY [day] ASC`;
    }


    let Day = new Date(day);
    Day = Day.toLocaleDateString("en-CA");


    const result = await pool.request()
      .input("date", sql.Date, date)
      .input("year", sql.Int, year)
      .input("month", sql.Int, month)
      .input("day", sql.Int, day)
      .query(query);

    if (result.recordset.length === 0)
      return res.status(404).send("No entries found for this form.");

    res.json(result.recordset);

  } catch (err) {
    console.error("Error fetching form data for view:", err);
    res.status(500).send("Error fetching form data for view: " + err.message);
  }
});







// REPORT
app.get("/reports", async (req, res) => {
    try {
        const { formName, fromDate, toDate, authStatus } = req.query;
        const pool = await sql.connect(db);

        let query = `
            SELECT FormName, ActivityDate, CreatedBy, AuthStatus, AuthBy, AuthDate
            FROM FormAuthorization
            WHERE 1=1
        `;

        if (formName) {
            query += " AND FormName = @formName";
        }
        if (fromDate) {
            query += " AND ActivityDate >= @fromDate";
        }
        if (toDate) {
            query += " AND ActivityDate <= @toDate";
        }
        if (authStatus) {
            query += " AND AuthStatus = @authStatus";
        }

        const request = pool.request();
        if (formName) request.input("formName", sql.NVarChar, formName);
        if (fromDate) request.input("fromDate", sql.Date, fromDate);
        if (toDate) request.input("toDate", sql.Date, toDate);
        if (authStatus) request.input("authStatus", sql.NVarChar, authStatus);

        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error("Error fetching reports:", err);
        res.status(500).send("Failed to fetch reports.");
    }
});










//  Default route for index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(5000,"0.0.0.0", () => {console.log("Server running at http://10.0.9.188:5000");});
