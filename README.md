# medlab-qms-platform
A locally hosted Medical Laboratory Quality Management System (QMS) built with HTML, CSS, JS, and SQL database. Includes daily instrument maintenance forms, employee dashboard for data entry, authorization dashboard for form approval, and admin dashboard for user creation and access control.


# MedLab QMS Platform

A locally hosted **Quality Management System (QMS)** designed for **medical laboratories** to digitize instrument maintenance, documentation workflows, and compliance processes. This platform provides multi-role access, structured data management, and easy form handling for daily lab operations.

---

## 🚀 Features

### **1. Multi-Form Instrument Maintenance System**

* Daily, weekly, and monthly maintenance forms
* Structured records for compliance and audits
* Secure storage of all submitted documentation

### **2. Role-Based Dashboards**

#### **🛠 Admin Dashboard**

* Create, edit, and manage users
* Assign access permissions
* Access the Authorization and Employee dashboards
* Monitor system-wide activity

#### **✔ Authorization Dashboard**

* View submitted forms from employees
* Approve or reject maintenance entries
* Ensure QC compliance and documentation standards

#### **👨‍🔧 Employee Dashboard**

* Submit daily maintenance forms
* Access only assigned forms
* Simple and clear UI for quick form entry

---

## 🧱 Tech Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Locally hosted server
* **Database:** SQL-based local database

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

The MedLab QMS Platform improves **accuracy**, **efficiency**, and **compliance** in medical lab workflows by digitizing routine instrument maintenance and centralizing documentation.

