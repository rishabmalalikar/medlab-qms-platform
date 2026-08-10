CREATE TABLE employees (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  EID NVARCHAR(100) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  role NVARCHAR(50) DEFAULT 'employee'	
);

ALTER TABLE employees
ADD department NVARCHAR(100) NULL
 
select* from employees

INSERT INTO employees (name, email, password,department)
VALUES ('', 'it@klehospital.org', 'kleit1234');

UPDATE employees
SET EID = 101111918
WHERE EID='4740';

UPDATE employees
SET EID = '000007',password='Star@567'
WHERE EID='7';

select * from employees where EID='000007'

INSERT INTO employees (name, EID, password,role,department)VALUES('admin','Kle1141','1234567','admin','admin');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mahantesh','Kle1142','1234567','authorizer','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Arun','Kle1143','1234567','employee','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Sharath','Kle4442','1234567','authorizer','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Anand','Kle1145','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Shweta','637','1234567','employee','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr.Anil.M','7','1234567','authorizer','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.Ganesh R Chavan','224','1234567','authorizer','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Rajeshwari S Handigund','4740','1234567','authorizer','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Preeti  S Maste  HOD','5285','1234567','authorizer','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Adarsh Sanikop','101111452','1234567','authorizer','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. MAHANTESH  C. KAPSE','123','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.ABRAHAM  P. BANSODE','176','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.  VIJAY B.  PATIL','177','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.STANLEY  R. ARALIKATTI','397','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.VIJAY H.  BHOGAN.','1053','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.VANITA R. INCHAL.','6569','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.ANITA  S. PATIL','4691','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.MAHANANDA  S. HALAGIMARDI','4823','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. WILSONKUMAR A. KALEBAR','6124','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss PRIYANKA KORE','8994','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss SAHANA  CHACHADI','8993','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss.SNEHAL S.SHAHAPURKAR','9600','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss NIKITA G.DILEKAR','9998','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.VISHAL YARAGATTIMATH','2931','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.SHAILA PATIL','4834','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. SHOBHA SOMASHEKHAR HANJI','173','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. RAJSHEKHAR RAMANAGOUDA PATIL','178','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. PRAKASH BHAGAVANTHA RAO','3410','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MS. SHRIDEVI RAMACHANDRA ARABALLI','5531','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. SUNIL PARAPPA KAMATE','6353','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SOMANAGOUDA PATIL','7901','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. MANIKANT ANDANI','8329','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. UMESH ANGADI','8587','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. GLORY GONGATI','10007','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. GEETA MEKHALI','10008','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. PRASAD CHAVAN','9123','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. NEELAVVA HIREMANI','9196','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. UJWALA MALAGE','9201','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. MANJULA HATTIMANI','9319','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SHIVARAJ KUMBAR','9514','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SUSHANT DEVAMORE','9821','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. ASHWINI SUTAR','9823','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. SUNIL BALAPPA DEVAMANE','4296','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. UDAYKUMAR MALLAPPA MELINAMANI','404','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. RADHA BHAJANTRI','7448','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Gouravva .M Karki','121','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Prabhu .B. Yaragamblimath','242','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Renuka .A. Hannikeri','379','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Shobha. R. Patil','3226','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Gajanan .V Madival','5152','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mahantesh B Sankavvagol','5209','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Nagappa T Tubaki','6384','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Sunil V Subedar','6910','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Gangavva K Godi','7450','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Ruksanaparveen  Z Hafeez','7722','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Divya  S Modage','8372','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.Manjunath A Holkar','8741','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Lava L Bhajantri  ( Clerk )','1046','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Ravindra. M Vannur (Clerk )','6905','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mallakarujan  Maribasannavar','9403','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Basavaraj K Patil','9579','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Satish M  Gunaki','9818','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Deepa  G Shapurkar','10015','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Bharati B  Madiwal','10075','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Mahadevi  N Banaji (Clerk)','10111170','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mahesh N  Kantrate','10012','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Shivanand S  Hiremath','10009','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Bhagyashree G. Murgali','246','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Manjula U. Chikkamath','4853','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Smita M. Yaradal','4587','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Vittal Ganachari','7883','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Ritu R. Barge','8302','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Girija R. Patil','278','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Pritam V. Kundangar','5522','1234567','employee','Histopathology');






create table sessions(
	session_id NVARCHAR(255) primary key not null,
	expires bigint not null,
	data NVARCHAR(max) not null
);
select * from sessions




CREATE TABLE FormAuthorization (
    FormAuthID INT IDENTITY(1,1) PRIMARY KEY,
    FormName NVARCHAR(100) NOT NULL,
    ActivityDate DATE NOT NULL,
    CreatedBy NVARCHAR(100),
    AuthStatus NVARCHAR(20) DEFAULT 'draft',  -- draft, pending, authorized, rejected
    AuthBy NVARCHAR(100) NULL,
    AuthDate DATETIME NULL,
    UNIQUE (FormName, ActivityDate)
);
select * from FormAuthorization where AuthStatus='pending'




/*CREATE TABLE dailychecklist (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [month] CHAR(2) NOT NULL,
    [year] CHAR(4) NOT NULL,
    shift VARCHAR(20) NOT NULL,  -- morning / evening / checkedby
    equipment VARCHAR(100) NOT NULL,
    day_1 INT DEFAULT 0,
    day_2 INT DEFAULT 0,
    day_3 INT DEFAULT 0,
    day_4 INT DEFAULT 0,
    day_5 INT DEFAULT 0,
    day_6 INT DEFAULT 0,
    day_7 INT DEFAULT 0,
    day_8 INT DEFAULT 0,
    day_9 INT DEFAULT 0,
    day_10 INT DEFAULT 0,
    day_11 INT DEFAULT 0,
    day_12 INT DEFAULT 0,
    day_13 INT DEFAULT 0,
    day_14 INT DEFAULT 0,
    day_15 INT DEFAULT 0,
    day_16 INT DEFAULT 0,
    day_17 INT DEFAULT 0,
    day_18 INT DEFAULT 0,
    day_19 INT DEFAULT 0,
    day_20 INT DEFAULT 0,
    day_21 INT DEFAULT 0,
    day_22 INT DEFAULT 0,
    day_23 INT DEFAULT 0,
    day_24 INT DEFAULT 0,
    day_25 INT DEFAULT 0,
    day_26 INT DEFAULT 0,
    day_27 INT DEFAULT 0,
    day_28 INT DEFAULT 0,
    day_29 INT DEFAULT 0,
    day_30 INT DEFAULT 0,
    day_31 INT DEFAULT 0,
    CONSTRAINT uq_daily UNIQUE ([month], [year], shift, equipment)
);
ALTER TABLE 
ADD status VARCHAR(20) DEFAULT 'draft',
    authorized_by NVARCHAR(100) NULL,
    authorized_date DATETIME NULL;

select * from dailychecklist*/




CREATE TABLE Activities (
    ActivityID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityName NVARCHAR(255) NOT NULL
);
INSERT INTO Activities (ActivityName) VALUES
('Check new sample status (collected and reported)'),
('Monitoring of label on sample received'),
('Daily QC signature and file/Haematology & Clinical pathology'),
('Refrigerators temperature/ Room temperature'),
('Monitoring sample Rejection sheet'),
('Biomedical waste register'),
('Daily Hypochlorite solution in liquid waste bottle'),
('Sample retention'),
('Check LJ'),
('Signature on worksheet'),
('Critical value register'),
('Lot Verification'),
('Filing of requisition form/ Instruments Printout/ worksheet.'),
('Others'),
('Kit Literature'),
('Instruments cleaning of upper surface/ Floor Cleaning');




CREATE TABLE DailyActivityLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityID INT NOT NULL,
    ActivityDate DATE NOT NULL,
    Status BIT NOT NULL DEFAULT 0, -- 0 = Not Done, 1 = Done
    Remark NVARCHAR(500),
    CONSTRAINT FK_DailyActivityLog_Activity FOREIGN KEY (ActivityID)
     REFERENCES Activities(ActivityID),
    CONSTRAINT UQ_Activity_Log UNIQUE (ActivityID, ActivityDate)
);
ALTER TABLE DailyActivityLog
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from DailyActivityLog where ActivityDate ='2025-01-01'
select ActivityName,ActivityDate,Status,Remark from DailyActivityLog A, Activities B where ActivityDate='2025-09-01' and a.ActivityID=b.ActivityID




CREATE TABLE Microscopes (
    MicroscopeID INT IDENTITY(1,1) PRIMARY KEY,
    MicroscopeName NVARCHAR(255) NOT NULL,
    SerialNumber NVARCHAR(100) NULL
);
INSERT INTO Microscopes (MicroscopeName, SerialNumber) VALUES
('Olympus Cx21fs1', '9H81585'),
('Olympus CH201', 'I11J69'),
('Olympus CH201', '19K0189'),
('Olympus CH20iBIMF', 'I11J59'),
('Olympus CX21', '7L12379'),
('Olympus CX21 FSI', '7L10999'),
('Magnus MLX', '21C0183');




CREATE TABLE DailyMicroscopeMaintenance (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    MicroscopeID INT NOT NULL,
    MaintenanceDate DATE NOT NULL,
    Cleaning BIT NOT NULL DEFAULT 0,             
    WorkingCondition NVARCHAR(255) NULL,         
    Sign NVARCHAR(100) NULL,            
    CONSTRAINT FK_Maintenance_Microscope FOREIGN KEY (MicroscopeID)
        REFERENCES Microscopes(MicroscopeID),
    -- Ensure only ONE entry per Microscope per Date
    CONSTRAINT UQ_MicroscopeDate UNIQUE (MicroscopeID, MaintenanceDate)
);
ALTER TABLE DailyMicroscopeMaintenance
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from DailyMicroscopeMaintenance
SELECT MicroscopeName+'/'+SerialNumber,MaintenanceDate,Cleaning,WorkingCondition FROM DailyMicroscopeMaintenance A ,Microscopes B  WHERE MaintenanceDate='2025-10-03' AND a.MicroscopeID=b.MicroscopeID  ORDER BY A.MicroscopeID ASC



CREATE TABLE bc6000_activities (
    activity_id INT IDENTITY(1,1) PRIMARY KEY,
    category NVARCHAR(20) NOT NULL CHECK (category IN ('Daily','Weekly','Bi-Weekly')),
    activity_name NVARCHAR(255) NOT NULL
);
INSERT INTO bc6000_activities (category, activity_name) VALUES
('Daily', 'Physical Check (Power Cable & Instrument)'),
('Daily', 'Check Reagent Tubing for Bubbles or Pinch'),
('Daily', 'Check Waste Container'),
('Daily', 'Clean Dust Around & On Machine'),
('Daily', 'Use of Probe Cleanser (When Required)');

INSERT INTO bc6000_activities (category, activity_name) VALUES
('Weekly', 'Perform Probe Cleanser Maintenance'),
('Weekly', 'Hgb Bath'),
('Weekly', 'WNB Bath'),
('Weekly', 'Diff Bath'),
('Weekly', 'RBC Bath'),
('Weekly', 'Sample Probe');

INSERT INTO bc6000_activities (category, activity_name) VALUES
('Bi-Weekly', 'Perform Probe Cleanser Maintenance'),
('Bi-Weekly', 'Hgb Bath'),
('Bi-Weekly', 'WNB Bath'),
('Bi-Weekly', 'Diff Bath'),
('Bi-Weekly', 'RBC Bath'),
('Bi-Weekly', 'Sample Probe'),
('Bi-Weekly', 'Flowcell'),
('Bi-Weekly', 'Aperture'),
('Bi-Weekly', 'WC1 Cistern'),
('Bi-Weekly', 'RET Bath');



CREATE TABLE bc6000_daily_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    activity_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    done BIT NOT NULL DEFAULT 0,
    sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_activity_date UNIQUE (activity_id, maintenance_date),
    CONSTRAINT FK_bc6000_activity FOREIGN KEY (activity_id) REFERENCES bc6000_activities(activity_id)
);

ALTER TABLE bc6000_daily_logs
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from bc6000_daily_logs
select activity_name,maintenance_date,done from bc6000_daily_logs A, bc6000_activities B WHERE maintenance_date = '2025-01-01' And A.activity_id=b.activity_id ORDER BY log_id ASC





CREATE TABLE wrights_stain_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    ph_buffer NVARCHAR(50) NULL,
    ph_buffer4 NVARCHAR(50) NULL,
    ph_buffer7 NVARCHAR(50) NULL,
    stain_filtered NVARCHAR(50) NULL,
    quality_of_staining NVARCHAR(100) NULL,
    checked_by NVARCHAR(100) NULL,
    remark NVARCHAR(MAX) NULL,
    corrective_action NVARCHAR(MAX) NULL,
    tech_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_wrights_stain UNIQUE (year, month, day)
);
ALTER TABLE wrights_stain_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from wrights_stain_log
SELECT * FROM wrights_stain_log WHERE [year]=2025 AND [month]=1 AND [day]=5 ORDER BY [day] ASC



CREATE TABLE centrifuge_maintenance_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    -- Daily
    cleaning_outside BIT DEFAULT 0,
    cleaning_rotor_chamber BIT DEFAULT 0,
    start_up BIT DEFAULT 0,
    daily_sign NVARCHAR(100) NULL,
    -- Weekly
    decontamination BIT DEFAULT 0,
    weekly_sign NVARCHAR(100) NULL,
    -- Monthly
    cleaning_cups BIT DEFAULT 0,
    check_carbon_brushes BIT DEFAULT 0,
    monthly_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_centrifuge UNIQUE (year, month, day)
);
ALTER TABLE centrifuge_maintenance_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from centrifuge_maintenance_log




CREATE TABLE waterbath_maintenance_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    water_level NVARCHAR(100) NULL,
    temperature NVARCHAR(100) NULL,
    replace_water NVARCHAR(100) NULL,
    daily_sign NVARCHAR(100) NULL,
    decontamination NVARCHAR(100) NULL,
    CONSTRAINT UQ_waterbath UNIQUE ([year], [month], [day])
);
ALTER TABLE waterbath_maintenance_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from waterbath_maintenance_log




CREATE TABLE ph_meter_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    self_test NVARCHAR(100) NULL,
    b_calibration NVARCHAR(100) NULL,
    ph4 BIT DEFAULT 0,
    ph7 BIT DEFAULT 0,
    ph9 BIT DEFAULT 0,
    tech_sign NVARCHAR(100) NULL,
    sup_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_phmeter UNIQUE ([year], [month], [day])
);
ALTER TABLE ph_meter_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from ph_meter_log




CREATE TABLE schedule_for_XN_1000_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN1000 UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_1000_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_1000_log




CREATE TABLE schedule_for_XN_3100_LEFT_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN3100LEFT UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_3100_LEFT_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_3100_LEFT_log




CREATE TABLE schedule_for_XN_3100_RIGHT_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN3100RIGHT UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_3100_RIGHT_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_3100_RIGHT_log




CREATE TABLE schedule_for_SYSMEX_SP_50_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    replacement_of_stain BIT DEFAULT 0,
    stain1_wright BIT DEFAULT 0,
    stain2_giemsa BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
	CONSTRAINT UQ_schedule_for_SYSMEX_SP_50 UNIQUE ([year],[month],[day])
);
ALTER TABLE schedule_for_SYSMEX_SP_50_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_SYSMEX_SP_50_log



    
CREATE TABLE Maintenance_ACL_TOP_550_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    check_reagent BIT DEFAULT 0,
    check_alignment_printer_paper BIT DEFAULT 0,
    ext_cleaning_instrument BIT DEFAULT 0,
    power_startup BIT DEFAULT 0,
    check_instrument_interface BIT DEFAULT 0,
    performed_system_prime BIT DEFAULT 0,
    check_qc_result BIT DEFAULT 0,
    tech_sign NVARCHAR(100) NULL,
    supervisor_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_Maintenance_ACL_TOP_550 UNIQUE ([year],[month],[day])
);
ALTER TABLE Maintenance_ACL_TOP_550_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from Maintenance_ACL_TOP_550_log




CREATE TABLE inter_observer_record_malarial_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_malarial UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_malarial_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_malarial_log




CREATE TABLE inter_observer_record_Reticulocyte_Count_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Reticulocyte_Count UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Reticulocyte_Count_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Reticulocyte_Count_log




CREATE TABLE inter_observer_record_Body_Fluids_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Body_Fluids UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Body_Fluids_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Body_Fluids_log




CREATE TABLE inter_observer_record_Peripheral_Smear_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Peripheral_Smear UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Peripheral_Smear_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Peripheral_Smear_log



CREATE TABLE ABG_COBAS_b221_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    check_fluid_level NVARCHAR(50),
    check_printer_paper NVARCHAR(50),
    clean_needle_fillport NVARCHAR(50),
    perform_cleaning_conditioning NVARCHAR(50),
    surface_cleaning NVARCHAR(50),
    staff_initial NVARCHAR(50),

    perform_all_daily_maintenance NVARCHAR(50),
    clean_sample_drip_tray NVARCHAR(50),
    clean_chassis NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from ABG_COBAS_b221_Log



CREATE TABLE ISE_9180_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    check_fluid_level NVARCHAR(50),
    check_printer_paper NVARCHAR(50),
    clean_needle_fillport NVARCHAR(50),
    perform_cleaning_conditioning NVARCHAR(50),
    surface_cleaning NVARCHAR(50),
    staff_initial NVARCHAR(50),

    perform_all_daily_maintenance NVARCHAR(50),
    clean_sample_drip_tray NVARCHAR(50),
    clean_chassis NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from ISE_9180_Log



CREATE TABLE D10_Hemoglobin_Maintenance_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    surface_cleaning NVARCHAR(100),
    check_method_setting NVARCHAR(100),
    check_buffer_wash_levels NVARCHAR(100),
    cartridge_injection_count NVARCHAR(100),
    check_waste_level NVARCHAR(100),
    pressure_reading NVARCHAR(100),
    check_for_leaks NVARCHAR(100),
    check_paper_supply NVARCHAR(100),
    remove_samples NVARCHAR(100),
    wipe_spills NVARCHAR(100),
    initials NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from D10_Hemoglobin_Maintenance_Log




CREATE TABLE D10_Hemoglobin_DM22K09803_Maintenance_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    surface_cleaning NVARCHAR(100),
    check_method_setting NVARCHAR(100),
    check_buffer_wash_levels NVARCHAR(100),
    cartridge_injection_count NVARCHAR(100),
    check_waste_level NVARCHAR(100),
    pressure_reading NVARCHAR(100),
    check_for_leaks NVARCHAR(100),
    check_paper_supply NVARCHAR(100),
    remove_samples NVARCHAR(100),
    wipe_spills NVARCHAR(100),
    initials NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from D10_Hemoglobin_DM22K09803_Maintenance_Log


CREATE TABLE Cobas_PRO_Integrated_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    wash_rack NVARCHAR(100),
    ise_calibration_daily NVARCHAR(100),

    weekly_rack_probe_clean NVARCHAR(100),
    ise_calibration_weekly NVARCHAR(100),

    reaction_cells NVARCHAR(100),
    photometer_lamp NVARCHAR(100),

    sipper_flow_path_wash NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from Cobas_PRO_Integrated_Log

ALTER TABLE Cobas_PRO_Integrated_Log
ADD filled_by NVARCHAR(100);



CREATE TABLE Cobas_PURE_Integrated_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    wash_rack NVARCHAR(100),
    ise_calibration_daily NVARCHAR(100),

    weekly_rack_probe_clean NVARCHAR(100),
    ise_calibration_weekly NVARCHAR(100),

    reaction_cells NVARCHAR(100),
    photometer_lamp NVARCHAR(100),

    sipper_flow_path_wash NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME,

	filled_by NVARCHAR(100)
);

select * from Cobas_PURE_Integrated_Log



CREATE TABLE employees (
  id INT IDENTITY(1,1) PRIMARY KEY,
  name NVARCHAR(100) NOT NULL,
  EID NVARCHAR(100) NOT NULL UNIQUE,
  password NVARCHAR(255) NOT NULL,
  role NVARCHAR(50) DEFAULT 'employee'	
);

ALTER TABLE employees
ADD department NVARCHAR(100) NULL
 
select* from employees

INSERT INTO employees (name, email, password,department)
VALUES ('', 'it@klehospital.org', 'kleit1234');

UPDATE employees
SET EID = 101111918
WHERE EID='4740';

UPDATE employees
SET EID = '000007',password='Star@567'
WHERE EID='7';

select * from employees where EID='000007'

INSERT INTO employees (name, EID, password,role,department)VALUES('admin','Kle1141','1234567','admin','admin');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mahantesh','Kle1142','1234567','authorizer','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Arun','Kle1143','1234567','employee','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Sharath','Kle4442','1234567','authorizer','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Anand','Kle1145','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Shweta','637','1234567','employee','Bio Chemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr.Anil.M','7','1234567','authorizer','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.Ganesh R Chavan','224','1234567','authorizer','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Rajeshwari S Handigund','4740','1234567','authorizer','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Preeti  S Maste  HOD','5285','1234567','authorizer','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Dr. Adarsh Sanikop','101111452','1234567','authorizer','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. MAHANTESH  C. KAPSE','123','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.ABRAHAM  P. BANSODE','176','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.  VIJAY B.  PATIL','177','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.STANLEY  R. ARALIKATTI','397','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.VIJAY H.  BHOGAN.','1053','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.VANITA R. INCHAL.','6569','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.ANITA  S. PATIL','4691','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.MAHANANDA  S. HALAGIMARDI','4823','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. WILSONKUMAR A. KALEBAR','6124','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss PRIYANKA KORE','8994','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss SAHANA  CHACHADI','8993','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss.SNEHAL S.SHAHAPURKAR','9600','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss NIKITA G.DILEKAR','9998','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.VISHAL YARAGATTIMATH','2931','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs.SHAILA PATIL','4834','1234567','employee','Biochemistry');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. SHOBHA SOMASHEKHAR HANJI','173','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. RAJSHEKHAR RAMANAGOUDA PATIL','178','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. PRAKASH BHAGAVANTHA RAO','3410','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MS. SHRIDEVI RAMACHANDRA ARABALLI','5531','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. SUNIL PARAPPA KAMATE','6353','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SOMANAGOUDA PATIL','7901','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. MANIKANT ANDANI','8329','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. UMESH ANGADI','8587','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. GLORY GONGATI','10007','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. GEETA MEKHALI','10008','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. PRASAD CHAVAN','9123','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. NEELAVVA HIREMANI','9196','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. UJWALA MALAGE','9201','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. MANJULA HATTIMANI','9319','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SHIVARAJ KUMBAR','9514','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. SUSHANT DEVAMORE','9821','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. ASHWINI SUTAR','9823','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. SUNIL BALAPPA DEVAMANE','4296','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MR. UDAYKUMAR MALLAPPA MELINAMANI','404','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('MRS. RADHA BHAJANTRI','7448','1234567','employee','Pathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Gouravva .M Karki','121','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Prabhu .B. Yaragamblimath','242','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Renuka .A. Hannikeri','379','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Shobha. R. Patil','3226','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Gajanan .V Madival','5152','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mahantesh B Sankavvagol','5209','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Nagappa T Tubaki','6384','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Sunil V Subedar','6910','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Gangavva K Godi','7450','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Ruksanaparveen  Z Hafeez','7722','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Divya  S Modage','8372','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr.Manjunath A Holkar','8741','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Lava L Bhajantri  ( Clerk )','1046','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Ravindra. M Vannur (Clerk )','6905','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mallakarujan  Maribasannavar','9403','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Basavaraj K Patil','9579','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Satish M  Gunaki','9818','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Deepa  G Shapurkar','10015','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Miss. Bharati B  Madiwal','10075','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Mahadevi  N Banaji (Clerk)','10111170','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Mahesh N  Kantrate','10012','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Shivanand S  Hiremath','10009','1234567','employee','Microbiology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Bhagyashree G. Murgali','246','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Manjula U. Chikkamath','4853','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Smita M. Yaradal','4587','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mr. Vittal Ganachari','7883','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Ritu R. Barge','8302','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Girija R. Patil','278','1234567','employee','Histopathology');
INSERT INTO employees (name, EID, password,role,department)VALUES('Mrs. Pritam V. Kundangar','5522','1234567','employee','Histopathology');






create table sessions(
	session_id NVARCHAR(255) primary key not null,
	expires bigint not null,
	data NVARCHAR(max) not null
);
select * from sessions




CREATE TABLE FormAuthorization (
    FormAuthID INT IDENTITY(1,1) PRIMARY KEY,
    FormName NVARCHAR(100) NOT NULL,
    ActivityDate DATE NOT NULL,
    CreatedBy NVARCHAR(100),
    AuthStatus NVARCHAR(20) DEFAULT 'draft',  -- draft, pending, authorized, rejected
    AuthBy NVARCHAR(100) NULL,
    AuthDate DATETIME NULL,
    UNIQUE (FormName, ActivityDate)
);
select * from FormAuthorization where AuthStatus='pending'




/*CREATE TABLE dailychecklist (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [month] CHAR(2) NOT NULL,
    [year] CHAR(4) NOT NULL,
    shift VARCHAR(20) NOT NULL,  -- morning / evening / checkedby
    equipment VARCHAR(100) NOT NULL,
    day_1 INT DEFAULT 0,
    day_2 INT DEFAULT 0,
    day_3 INT DEFAULT 0,
    day_4 INT DEFAULT 0,
    day_5 INT DEFAULT 0,
    day_6 INT DEFAULT 0,
    day_7 INT DEFAULT 0,
    day_8 INT DEFAULT 0,
    day_9 INT DEFAULT 0,
    day_10 INT DEFAULT 0,
    day_11 INT DEFAULT 0,
    day_12 INT DEFAULT 0,
    day_13 INT DEFAULT 0,
    day_14 INT DEFAULT 0,
    day_15 INT DEFAULT 0,
    day_16 INT DEFAULT 0,
    day_17 INT DEFAULT 0,
    day_18 INT DEFAULT 0,
    day_19 INT DEFAULT 0,
    day_20 INT DEFAULT 0,
    day_21 INT DEFAULT 0,
    day_22 INT DEFAULT 0,
    day_23 INT DEFAULT 0,
    day_24 INT DEFAULT 0,
    day_25 INT DEFAULT 0,
    day_26 INT DEFAULT 0,
    day_27 INT DEFAULT 0,
    day_28 INT DEFAULT 0,
    day_29 INT DEFAULT 0,
    day_30 INT DEFAULT 0,
    day_31 INT DEFAULT 0,
    CONSTRAINT uq_daily UNIQUE ([month], [year], shift, equipment)
);
ALTER TABLE 
ADD status VARCHAR(20) DEFAULT 'draft',
    authorized_by NVARCHAR(100) NULL,
    authorized_date DATETIME NULL;

select * from dailychecklist*/




CREATE TABLE Activities (
    ActivityID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityName NVARCHAR(255) NOT NULL
);
INSERT INTO Activities (ActivityName) VALUES
('Check new sample status (collected and reported)'),
('Monitoring of label on sample received'),
('Daily QC signature and file/Haematology & Clinical pathology'),
('Refrigerators temperature/ Room temperature'),
('Monitoring sample Rejection sheet'),
('Biomedical waste register'),
('Daily Hypochlorite solution in liquid waste bottle'),
('Sample retention'),
('Check LJ'),
('Signature on worksheet'),
('Critical value register'),
('Lot Verification'),
('Filing of requisition form/ Instruments Printout/ worksheet.'),
('Others'),
('Kit Literature'),
('Instruments cleaning of upper surface/ Floor Cleaning');




CREATE TABLE DailyActivityLog (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityID INT NOT NULL,
    ActivityDate DATE NOT NULL,
    Status BIT NOT NULL DEFAULT 0, -- 0 = Not Done, 1 = Done
    Remark NVARCHAR(500),
    CONSTRAINT FK_DailyActivityLog_Activity FOREIGN KEY (ActivityID)
     REFERENCES Activities(ActivityID),
    CONSTRAINT UQ_Activity_Log UNIQUE (ActivityID, ActivityDate)
);
ALTER TABLE DailyActivityLog
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from DailyActivityLog where ActivityDate ='2025-01-01'
select ActivityName,ActivityDate,Status,Remark from DailyActivityLog A, Activities B where ActivityDate='2025-09-01' and a.ActivityID=b.ActivityID




CREATE TABLE Microscopes (
    MicroscopeID INT IDENTITY(1,1) PRIMARY KEY,
    MicroscopeName NVARCHAR(255) NOT NULL,
    SerialNumber NVARCHAR(100) NULL
);
INSERT INTO Microscopes (MicroscopeName, SerialNumber) VALUES
('Olympus Cx21fs1', '9H81585'),
('Olympus CH201', 'I11J69'),
('Olympus CH201', '19K0189'),
('Olympus CH20iBIMF', 'I11J59'),
('Olympus CX21', '7L12379'),
('Olympus CX21 FSI', '7L10999'),
('Magnus MLX', '21C0183');




CREATE TABLE DailyMicroscopeMaintenance (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    MicroscopeID INT NOT NULL,
    MaintenanceDate DATE NOT NULL,
    Cleaning BIT NOT NULL DEFAULT 0,             
    WorkingCondition NVARCHAR(255) NULL,         
    Sign NVARCHAR(100) NULL,            
    CONSTRAINT FK_Maintenance_Microscope FOREIGN KEY (MicroscopeID)
        REFERENCES Microscopes(MicroscopeID),
    -- Ensure only ONE entry per Microscope per Date
    CONSTRAINT UQ_MicroscopeDate UNIQUE (MicroscopeID, MaintenanceDate)
);
ALTER TABLE DailyMicroscopeMaintenance
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from DailyMicroscopeMaintenance
SELECT MicroscopeName+'/'+SerialNumber,MaintenanceDate,Cleaning,WorkingCondition FROM DailyMicroscopeMaintenance A ,Microscopes B  WHERE MaintenanceDate='2025-10-03' AND a.MicroscopeID=b.MicroscopeID  ORDER BY A.MicroscopeID ASC



CREATE TABLE bc6000_activities (
    activity_id INT IDENTITY(1,1) PRIMARY KEY,
    category NVARCHAR(20) NOT NULL CHECK (category IN ('Daily','Weekly','Bi-Weekly')),
    activity_name NVARCHAR(255) NOT NULL
);
INSERT INTO bc6000_activities (category, activity_name) VALUES
('Daily', 'Physical Check (Power Cable & Instrument)'),
('Daily', 'Check Reagent Tubing for Bubbles or Pinch'),
('Daily', 'Check Waste Container'),
('Daily', 'Clean Dust Around & On Machine'),
('Daily', 'Use of Probe Cleanser (When Required)');

INSERT INTO bc6000_activities (category, activity_name) VALUES
('Weekly', 'Perform Probe Cleanser Maintenance'),
('Weekly', 'Hgb Bath'),
('Weekly', 'WNB Bath'),
('Weekly', 'Diff Bath'),
('Weekly', 'RBC Bath'),
('Weekly', 'Sample Probe');

INSERT INTO bc6000_activities (category, activity_name) VALUES
('Bi-Weekly', 'Perform Probe Cleanser Maintenance'),
('Bi-Weekly', 'Hgb Bath'),
('Bi-Weekly', 'WNB Bath'),
('Bi-Weekly', 'Diff Bath'),
('Bi-Weekly', 'RBC Bath'),
('Bi-Weekly', 'Sample Probe'),
('Bi-Weekly', 'Flowcell'),
('Bi-Weekly', 'Aperture'),
('Bi-Weekly', 'WC1 Cistern'),
('Bi-Weekly', 'RET Bath');



CREATE TABLE bc6000_daily_logs (
    log_id INT IDENTITY(1,1) PRIMARY KEY,
    activity_id INT NOT NULL,
    maintenance_date DATE NOT NULL,
    done BIT NOT NULL DEFAULT 0,
    sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_activity_date UNIQUE (activity_id, maintenance_date),
    CONSTRAINT FK_bc6000_activity FOREIGN KEY (activity_id) REFERENCES bc6000_activities(activity_id)
);

ALTER TABLE bc6000_daily_logs
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from bc6000_daily_logs
select activity_name,maintenance_date,done from bc6000_daily_logs A, bc6000_activities B WHERE maintenance_date = '2025-01-01' And A.activity_id=b.activity_id ORDER BY log_id ASC





CREATE TABLE wrights_stain_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    ph_buffer NVARCHAR(50) NULL,
    ph_buffer4 NVARCHAR(50) NULL,
    ph_buffer7 NVARCHAR(50) NULL,
    stain_filtered NVARCHAR(50) NULL,
    quality_of_staining NVARCHAR(100) NULL,
    checked_by NVARCHAR(100) NULL,
    remark NVARCHAR(MAX) NULL,
    corrective_action NVARCHAR(MAX) NULL,
    tech_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_wrights_stain UNIQUE (year, month, day)
);
ALTER TABLE wrights_stain_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from wrights_stain_log
SELECT * FROM wrights_stain_log WHERE [year]=2025 AND [month]=1 AND [day]=5 ORDER BY [day] ASC



CREATE TABLE centrifuge_maintenance_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    day INT NOT NULL CHECK (day BETWEEN 1 AND 31),
    -- Daily
    cleaning_outside BIT DEFAULT 0,
    cleaning_rotor_chamber BIT DEFAULT 0,
    start_up BIT DEFAULT 0,
    daily_sign NVARCHAR(100) NULL,
    -- Weekly
    decontamination BIT DEFAULT 0,
    weekly_sign NVARCHAR(100) NULL,
    -- Monthly
    cleaning_cups BIT DEFAULT 0,
    check_carbon_brushes BIT DEFAULT 0,
    monthly_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_centrifuge UNIQUE (year, month, day)
);
ALTER TABLE centrifuge_maintenance_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from centrifuge_maintenance_log




CREATE TABLE waterbath_maintenance_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    water_level NVARCHAR(100) NULL,
    temperature NVARCHAR(100) NULL,
    replace_water NVARCHAR(100) NULL,
    daily_sign NVARCHAR(100) NULL,
    decontamination NVARCHAR(100) NULL,
    CONSTRAINT UQ_waterbath UNIQUE ([year], [month], [day])
);
ALTER TABLE waterbath_maintenance_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from waterbath_maintenance_log




CREATE TABLE ph_meter_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    self_test NVARCHAR(100) NULL,
    b_calibration NVARCHAR(100) NULL,
    ph4 BIT DEFAULT 0,
    ph7 BIT DEFAULT 0,
    ph9 BIT DEFAULT 0,
    tech_sign NVARCHAR(100) NULL,
    sup_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_phmeter UNIQUE ([year], [month], [day])
);
ALTER TABLE ph_meter_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select *from ph_meter_log




CREATE TABLE schedule_for_XN_1000_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN1000 UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_1000_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_1000_log




CREATE TABLE schedule_for_XN_3100_LEFT_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN3100LEFT UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_3100_LEFT_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_3100_LEFT_log




CREATE TABLE schedule_for_XN_3100_RIGHT_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    process_control BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
    CONSTRAINT UQ_scheduleforXN3100RIGHT UNIQUE ([year], [month], [day])
);
ALTER TABLE schedule_for_XN_3100_RIGHT_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_XN_3100_RIGHT_log




CREATE TABLE schedule_for_SYSMEX_SP_50_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    perform_shutdown BIT DEFAULT 0,
    cleaning BIT DEFAULT 0,
    replacement_of_stain BIT DEFAULT 0,
    stain1_wright BIT DEFAULT 0,
    stain2_giemsa BIT DEFAULT 0,
    operator_signature NVARCHAR(100) NULL,
    supervisor_signature NVARCHAR(100) NULL,
	CONSTRAINT UQ_schedule_for_SYSMEX_SP_50 UNIQUE ([year],[month],[day])
);
ALTER TABLE schedule_for_SYSMEX_SP_50_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from schedule_for_SYSMEX_SP_50_log



    
CREATE TABLE Maintenance_ACL_TOP_550_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    check_reagent BIT DEFAULT 0,
    check_alignment_printer_paper BIT DEFAULT 0,
    ext_cleaning_instrument BIT DEFAULT 0,
    power_startup BIT DEFAULT 0,
    check_instrument_interface BIT DEFAULT 0,
    performed_system_prime BIT DEFAULT 0,
    check_qc_result BIT DEFAULT 0,
    tech_sign NVARCHAR(100) NULL,
    supervisor_sign NVARCHAR(100) NULL,
    CONSTRAINT UQ_Maintenance_ACL_TOP_550 UNIQUE ([year],[month],[day])
);
ALTER TABLE Maintenance_ACL_TOP_550_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from Maintenance_ACL_TOP_550_log




CREATE TABLE inter_observer_record_malarial_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_malarial UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_malarial_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_malarial_log




CREATE TABLE inter_observer_record_Reticulocyte_Count_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Reticulocyte_Count UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Reticulocyte_Count_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Reticulocyte_Count_log




CREATE TABLE inter_observer_record_Body_Fluids_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Body_Fluids UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Body_Fluids_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Body_Fluids_log




CREATE TABLE inter_observer_record_Peripheral_Smear_log (
    id INT IDENTITY(1,1) PRIMARY KEY,
    [year] INT NOT NULL,
    [month] INT NOT NULL CHECK ([month] BETWEEN 1 AND 12),
    [day] INT NOT NULL CHECK ([day] BETWEEN 1 AND 31),
    sample_no NVARCHAR(50) NULL,
    result1 NVARCHAR(255) NULL,
    consultant1 NVARCHAR(100) NULL,
    result2 NVARCHAR(255) NULL,
    consultant2 NVARCHAR(100) NULL,
    consistent_status NVARCHAR(50) NULL,
    remarks NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_inter_observer_record_Peripheral_Smear UNIQUE ([year], [month], [day])
);
ALTER TABLE inter_observer_record_Peripheral_Smear_log
ADD auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100) NULL,
    auth_date DATETIME NULL;

select * from inter_observer_record_Peripheral_Smear_log



CREATE TABLE ABG_COBAS_b221_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    check_fluid_level NVARCHAR(50),
    check_printer_paper NVARCHAR(50),
    clean_needle_fillport NVARCHAR(50),
    perform_cleaning_conditioning NVARCHAR(50),
    surface_cleaning NVARCHAR(50),
    staff_initial NVARCHAR(50),

    perform_all_daily_maintenance NVARCHAR(50),
    clean_sample_drip_tray NVARCHAR(50),
    clean_chassis NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from ABG_COBAS_b221_Log



CREATE TABLE ISE_9180_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    check_fluid_level NVARCHAR(50),
    check_printer_paper NVARCHAR(50),
    clean_needle_fillport NVARCHAR(50),
    perform_cleaning_conditioning NVARCHAR(50),
    surface_cleaning NVARCHAR(50),
    staff_initial NVARCHAR(50),

    perform_all_daily_maintenance NVARCHAR(50),
    clean_sample_drip_tray NVARCHAR(50),
    clean_chassis NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from ISE_9180_Log



CREATE TABLE D10_Hemoglobin_Maintenance_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    surface_cleaning NVARCHAR(100),
    check_method_setting NVARCHAR(100),
    check_buffer_wash_levels NVARCHAR(100),
    cartridge_injection_count NVARCHAR(100),
    check_waste_level NVARCHAR(100),
    pressure_reading NVARCHAR(100),
    check_for_leaks NVARCHAR(100),
    check_paper_supply NVARCHAR(100),
    remove_samples NVARCHAR(100),
    wipe_spills NVARCHAR(100),
    initials NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from D10_Hemoglobin_Maintenance_Log




CREATE TABLE D10_Hemoglobin_DM22K09803_Maintenance_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    surface_cleaning NVARCHAR(100),
    check_method_setting NVARCHAR(100),
    check_buffer_wash_levels NVARCHAR(100),
    cartridge_injection_count NVARCHAR(100),
    check_waste_level NVARCHAR(100),
    pressure_reading NVARCHAR(100),
    check_for_leaks NVARCHAR(100),
    check_paper_supply NVARCHAR(100),
    remove_samples NVARCHAR(100),
    wipe_spills NVARCHAR(100),
    initials NVARCHAR(50),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from D10_Hemoglobin_DM22K09803_Maintenance_Log


CREATE TABLE Cobas_PRO_Integrated_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    wash_rack NVARCHAR(100),
    ise_calibration_daily NVARCHAR(100),

    weekly_rack_probe_clean NVARCHAR(100),
    ise_calibration_weekly NVARCHAR(100),

    reaction_cells NVARCHAR(100),
    photometer_lamp NVARCHAR(100),

    sipper_flow_path_wash NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select * from Cobas_PRO_Integrated_Log

ALTER TABLE Cobas_PRO_Integrated_Log
ADD filled_by NVARCHAR(100);



CREATE TABLE Cobas_PURE_Integrated_Log (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    wash_rack NVARCHAR(100),
    ise_calibration_daily NVARCHAR(100),

    weekly_rack_probe_clean NVARCHAR(100),
    ise_calibration_weekly NVARCHAR(100),

    reaction_cells NVARCHAR(100),
    photometer_lamp NVARCHAR(100),

    sipper_flow_path_wash NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',
    auth_by NVARCHAR(100),
    auth_date DATETIME,

	filled_by NVARCHAR(100)
);

select * from Cobas_PURE_Integrated_Log



CREATE TABLE Verification_Reagent_Lot_Pathology(
    id INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,
    reagent_name NVARCHAR(100),
    old_lot_no NVARCHAR(50),
    old_expiry_date DATE,
    new_lot_no NVARCHAR(50),
    new_expiry_date DATE,
    verification_test NVARCHAR(200),
    material_used NVARCHAR(200),
    result_status NVARCHAR(50), -- Consistent / Inconsistent
    remarks NVARCHAR(300),
    tech_sign NVARCHAR(100),
    auth_status NVARCHAR(20) DEFAULT 'Pending', -- Pending / Sent / Authorized
    created_at DATETIME DEFAULT GETDATE()
);


ALTER TABLE Verification_Reagent_Lot_Pathology
DROP CONSTRAINT UQ__Verifica__9CA71D3919F85CB3;


ALTER TABLE Verification_Reagent_Lot_Pathology
ADD
    R1 DECIMAL(18,2) NULL,
    R2 DECIMAL(18,2) NULL,
    Calculation DECIMAL(18,2) NULL;


	ALTER TABLE Verification_Reagent_Lot_Pathology
ALTER COLUMN Calculation VARCHAR(255) NULL

select * from Verification_Reagent_Lot_Pathology




CREATE TABLE Validation_Reagent_New_Lot_Record (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    ReagentName NVARCHAR(150) NULL,

    LotNo NVARCHAR(50),
    ExpiryDate DATE,
    OpenDate DATE,

    OldLot_L1 NVARCHAR(50),
    OldLot_L2 NVARCHAR(50),

    NewLot_L1 NVARCHAR(50),
    NewLot_L2 NVARCHAR(50),

    AcceptableStatus NVARCHAR(50),
    TechnicianSignature NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',  -- draft, pending, authorized, rejected
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select* from Validation_Reagent_New_Lot_Record


CREATE TABLE Referral_Lab_Register (
    RegisterID INT IDENTITY(1,1) PRIMARY KEY,

    SampleSentDateTime DATETIME NOT NULL,
    SampleID NVARCHAR(50),
    PatientID NVARCHAR(50),
    PatientName NVARCHAR(100),
    TestName NVARCHAR(100),
    SampleType NVARCHAR(50),
    ReferralLabName NVARCHAR(100),
    SampleCollectedBy NVARCHAR(100),
    ReportReceivedDate DATE,
    ReportInformedTo NVARCHAR(100),

    ReportPDF VARBINARY(MAX),      -- PDF stored in DB
    ReportPDFName NVARCHAR(200),

    Remarks NVARCHAR(200),

    RowStatus NVARCHAR(20) DEFAULT 'saved'  -- saved / locked
);
select * from Referral_Lab_Register

UPDATE Referral_Lab_Register
SET ReportPDFName = 'lab_report_17714748327441_10226510.pdf'
WHERE SampleID = 1234567891;



select * from Verification_Reagent_Lot_Pathology




CREATE TABLE Validation_Reagent_New_Lot_Record (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    ActivityDate DATE NOT NULL UNIQUE,

    ReagentName NVARCHAR(150) NULL,

    LotNo NVARCHAR(50),
    ExpiryDate DATE,
    OpenDate DATE,

    OldLot_L1 NVARCHAR(50),
    OldLot_L2 NVARCHAR(50),

    NewLot_L1 NVARCHAR(50),
    NewLot_L2 NVARCHAR(50),

    AcceptableStatus NVARCHAR(50),
    TechnicianSignature NVARCHAR(100),

    auth_status VARCHAR(20) DEFAULT 'draft',  -- draft, pending, authorized, rejected
    auth_by NVARCHAR(100),
    auth_date DATETIME
);

select* from Validation_Reagent_New_Lot_Record


CREATE TABLE Referral_Lab_Register (
    RegisterID INT IDENTITY(1,1) PRIMARY KEY,

    SampleSentDateTime DATETIME NOT NULL,
    SampleID NVARCHAR(50),
    PatientID NVARCHAR(50),
    PatientName NVARCHAR(100),
    TestName NVARCHAR(100),
    SampleType NVARCHAR(50),
    ReferralLabName NVARCHAR(100),
    SampleCollectedBy NVARCHAR(100),
    ReportReceivedDate DATE,
    ReportInformedTo NVARCHAR(100),

    ReportPDF VARBINARY(MAX),      -- PDF stored in DB
    ReportPDFName NVARCHAR(200),

    Remarks NVARCHAR(200),

    RowStatus NVARCHAR(20) DEFAULT 'saved'  -- saved / locked
);
select * from Referral_Lab_Register

UPDATE Referral_Lab_Register
SET ReportPDFName = 'lab_report_17714748327441_10226510.pdf'
WHERE SampleID = 1234567891;


delete
from Referral_Lab_Register
where RegisterID=2