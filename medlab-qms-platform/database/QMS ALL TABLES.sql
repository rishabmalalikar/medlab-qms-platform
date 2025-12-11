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
select * from FormAuthorization






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

select * from DailyActivityLog
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




