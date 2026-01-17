# MedLab QMS Platform

A locally hosted, end-to-end Quality Management System (QMS) designed for medical laboratories to digitize instrument maintenance, documentation workflows, and compliance processes.

This system replaces manual paper-based records with structured digital forms, improving accuracy, traceability, and operational efficiency.

---

## 🧩 Problem Statement
Medical laboratories traditionally maintain daily instrument and quality records on paper, which leads to:
- Data inconsistency
- Manual errors
- Difficulty during audits
- Poor record traceability

This platform digitizes the entire workflow and centralizes all records in a secure system.

---

## 🚀 Key Features

### 1. Instrument Maintenance Forms
- Daily, weekly, and monthly maintenance forms
- Structured data storage for audits and compliance
- Secure record management

### 2. Role-Based Access Control

#### 🛠 Admin Dashboard
- Create and manage users
- Assign roles and permissions
- Monitor system-wide activity

#### ✔ Authorizer Dashboard
- Review submitted forms
- Approve or reject entries
- Ensure quality and compliance standards

#### 👨‍🔧 Employee Dashboard
- Submit assigned maintenance forms
- View form status
- Simple and intuitive UI for daily usage

---

## 🔄 Workflow
1. Technician submits maintenance form
2. Form is locked and sent for authorization
3. Authorizer reviews the data
4. Form is either approved or rejected
5. Rejected forms are unlocked for correction

---

## 🧱 Tech Stack
- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js (Express)
- **Database:** SQL Server
- **Hosting:** Local server

---

## 📁 Project Structure

```
medlab-qms-platform
├── database
│   └── QMS ALL TABLES.sql
├── public
│   ├── 9180-ise.html
│   ├── Maintenance_ACL_TOP_550.html
│   ├── OperatorMaintenanceScheduleforSYSMEXSP50.html
│   ├── Report.html
│   ├── abg-cobas-b221.html
│   ├── admin-dashboard.html
│   ├── authorizer-dashboard.html
│   ├── bc60000.html
│   ├── centrifuge.html
│   ├── cobas-pro-integrated.html
│   ├── cobas-pure-integrated.html
│   ├── createEmployee.html
│   ├── d10-hemoglobin-DM22K09803.html
│   ├── d10-hemoglobin.html
│   ├── dailyChecklist.html
│   ├── img
│   │   ├── 9180 ISE .png
│   │   ├── ABG.png
│   │   ├── Authorization.png
│   │   ├── BC6000Series.png
│   │   ├── Body_Fluids.png
│   │   ├── Centrifuge_Maintenance.jpg
│   │   ├── Cobas Pro.png
│   │   ├── Cobas Pure.png
│   │   ├── DailyActivityChecklist.png
│   │   ├── KLE.jpg
│   │   ├── KLES_Logo.jpg
│   │   ├── KLES_Logo.png
│   │   ├── Maintenance Schedule For ACL TOP 550.png
│   │   ├── MalarialParasite.png
│   │   ├── MicroscopeMaintenance.png
│   │   ├── Operator Maintenance Schedule For Sysmex SP-50.png
│   │   ├── PeripheralSmear.png
│   │   ├── QMS1.jpg
│   │   ├── ReticulocyteCount.png
│   │   ├── Wright's_Stain_Log.png
│   │   ├── XN 3100 Left.png
│   │   ├── XN 3100 Right.png
│   │   ├── XN1000.png
│   │   ├── create-employee.png
│   │   ├── d10-hemoglobin DM22C30002.png
│   │   ├── form.png
│   │   ├── icon_1.png
│   │   ├── pH_Meter.png
│   │   ├── user.png
│   │   └── water-bath.jpg
│   ├── index.html
│   ├── inter_observer_record_Body_Fluids.html
│   ├── inter_observer_record_Peripheral_Smear.html
│   ├── inter_observer_record_Reticulocyte_Count.html
│   ├── inter_observer_record_malarial.html
│   ├── login.html
│   ├── microscopeMaintenance.html
│   ├── model.js
│   ├── operatorMaintenanceScheduleForXN1000.html
│   ├── operatorMaintenanceScheduleForXN3100Left.html
│   ├── operatorMaintenanceScheduleForXN3100Right.html
│   ├── phmeter.html
│   ├── test.html
│   ├── view_form_data.html
│   ├── watherbath.html
│   └── wrights.html
├── server.js
└── sessions
│   └── d-h93fuBe-ijXXNPfdNUi-L6fEKU3lSs.json
└── README.md
```

---

## 📌 Purpose
This system improves accuracy, efficiency, and compliance in medical laboratory workflows by automating routine instrument maintenance and centralizing documentation.

---

## 👤 Author
**Rishab S Malalikar**  
Independently developed and implemented as a real-world production system.


