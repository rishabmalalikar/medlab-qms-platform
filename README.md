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
medlab-qms-platform/
│
├── /database
│   └── QMS ALL TABLES.sql
│
├── public
|    ├── Maintenance_ACL_TOP_550.html
|    ├── OperatorMaintenanceScheduleforSYSMEXSP50.html
|    ├── admin-dashboard.html
|    ├── authorizer-dashboard.html
|    ├── bc60000.html
|    ├── centrifuge.html
|    ├── createEmployee.html
|    ├── dailyChecklist.html
|    ├── img
|    │      ├── Authorization.png
|    │      ├── BC6000Series.png
|    │      ├── Body_Fluids.png
|    │      ├── Centrifuge_Maintenance.jpg
|    │      ├── DailyActivityChecklist.png
|    │      ├── KLE.jpg
|    │      ├── KLES_Logo.jpg
|    │      ├── KLES_Logo.png
|    │      ├── MalarialParasite.png
|    │      ├── MicroscopeMaintenance.png
|    │      ├── PeripheralSmear.png
|    │      ├── QMS1.jpg
|    │      ├── ReticulocyteCount.png
|    │      ├── Wright's_Stain_Log.png
|    │      ├── XN 3100 Left.png
|    │      ├── XN 3100 Right.png
|    │      ├── XN1000.png
|    │      ├── create-employee.png
|    │      ├── form.png
|    │      ├── icon_1.png
|    │      ├── pH_Meter.png
|    │      ├── user.png
|    │── water-bath.jpg
|    ├── index.html
|    ├── inter_observer_record_Body_Fluids.html
|    ├── inter_observer_record_Peripheral_Smear.html
|    ├── inter_observer_record_Reticulocyte_Count.html
|    ├── inter_observer_record_malarial.html
|    ├── login.html
|    ├── microscopeMaintenance.html
|    ├── model.js
|    ├── operatorMaintenanceScheduleForXN1000.html
|    ├── operatorMaintenanceScheduleForXN3100Left.html
|    ├── operatorMaintenanceScheduleForXN3100Right.html
|    ├── phmeter.html
|    ├── view_form_data.html
|    ├── watherbath.html
|    └── wrights.html
├──sessions
├──server.js
└── README.md
```

---

## 📌 Purpose
This system improves accuracy, efficiency, and compliance in medical laboratory workflows by automating routine instrument maintenance and centralizing documentation.

---

## 👤 Author
**Rishab S Malalikar**  
Independently developed and implemented as a real-world production system.


