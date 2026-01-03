# 🗳️ Animal E-Voting System

[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=white)]()
[![Spring Boot](https://img.shields.io/badge/Backend-Spring%20Boot-6DB33F?logo=springboot&logoColor=white)]()
[![Spring Security](https://img.shields.io/badge/Security-Spring%20Security-6DB33F?logo=springsecurity&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-orange?logo=jsonwebtokens&logoColor=white)]()
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)]()
[![Java](https://img.shields.io/badge/Language-Java-007396?logo=openjdk&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/Language-JavaScript-F7DF1E?logo=javascript&logoColor=black)]()
[![Vercel](https://img.shields.io/badge/Hosting-Frontend%20on%20Vercel-black?logo=vercel&logoColor=white)]()
[![Railway](https://img.shields.io/badge/Hosting-Backend%20on%20Railway-0B0D0E?logo=railway&logoColor=white)]()
[![Cloudflare](https://img.shields.io/badge/Security-Cloudflare-F38020?logo=cloudflare&logoColor=white)]()

A full-stack electronic voting platform inspired by real-world election workflows (AEC-style).  
The system implements **secure anonymous voting**, **role-based access control**, **audit logging**, **recount workflow**, and a fully deployed public environment.

🔗 [**Live Frontend**](https://voting.wyprojects.com/  )
🔗 [**Backend API** ](https://api-vote.wyprojects.com  )
🔗 [**Health Check for Backend**  ](https://api-vote.wyprojects.com/actuator/health)


---

## 🚀 Tech Stack

### **Frontend**
- React (Create React App)
- React Router
- Axios
- Hosted on **Vercel**
- Custom domain: `https://voting.wyprojects.com/`

### **Backend**
- Spring Boot  
- Spring Security (JWT Authentication)
- Role-Based Access Control (RBAC)
- AES-256 Vote Anonymisation
- REST API
- Hosted on **Railway**

### **Database**
- MongoDB Atlas
- Daily automatic reset (clean demo environment)

### **Security**
- Cloudflare (DDoS Protection + CDN)
- JWT Authorization
- IP-limited API
- Strict CORS validation

---

## 🎨 Frontend Overview

The frontend is a fully responsive React application deployed on **Vercel** with a custom domain.

🔗 **Live Frontend:** https://voting.wyprojects.com/

### 🧩 Key Responsibilities
- Provides UI for all user roles  
- Handles routing (Dashboard, Ballot, Results, Login/Register)  
- Communicates with the backend using JWT-secured REST API  
- Dynamically displays election status (Upcoming → Active → Closed)  
- Role-based navigation rendering  
- Ballot display, candidate listing, results panel  
- Protected routes (UI-level RBAC)
- API health check (`/actuator/health`)

### 🖼️ UI/UX Highlights
- Pill-style election status labels  
- Card-based ballot layout with hover states  
- Clean spacing & typography  
- Mobile-responsive  
- Role-specific dashboards  
- Error/empty states  
- Election timeline panel (start time, end time, status, voter status)

### 💡 Frontend Tech Details
- React (CRA)
- React Router
- Axios
- JWT handling in memory
- Reusable UI components (Status Pills, Tags, Cards)
- Conditional rendering for roles
- Fetches backend health on load

### 🖥️ Frontend Deployment
- Hosted on **Vercel**
- Automatic build from `apps/web`
- CORS allowed for this domain only
- SSL enabled by default

---

## 🛠️ Backend Overview

The backend is built with **Spring Boot** and provides a fully secure, production-style REST API.  
It supports:

- JWT authentication  
- Role-based access control (Admin, Delegate, Logger, Voter)  
- AES-256 encrypted & anonymised vote storage  
- BCrypt hashing for credentials  
- Encrypted audit logs  
- Election workflow control  
- Recount logic for Delegates  
- Daily database reset (cron + mongosh)

**API Base URL:**  
https://api-vote.wyprojects.com


---

## 🌐 Deployment & Infrastructure

The system is deployed using a modern, production-style cloud setup:

### **Frontend (Vercel)**
- Global CDN  
- Automatic HTTPS  
- Zero-config deployment  
- Custom domain  
- Path: `/apps/web`

### **Backend (Railway)**
- Spring Boot service  
- Environment variables securely stored  
- Auto-redeploy on changes  
- Custom API domain: `api-vote.wyprojects.com`

### **Security Layer (Cloudflare)**
- DDoS Protection  
- WAF Firewall  
- SSL Proxy  
- Bot Mitigation  
- DNS Routing

### **Database (MongoDB Atlas)**
- Cloud NoSQL database  
- Network access rules  
- Daily automated reset with `cron + mongosh`

---

## 🏛️ System Architecture

```
                   +-----------------------------+
                   |         Vercel (UI)         |
                   |     React Frontend App      |
                   +--------------+--------------+
                                  |
                                  | HTTPS (CORS allowed)
                                  v
                      +-----------+------------+
                      |     Cloudflare Proxy   |
                      | (DDoS, CDN, Firewall)  |
                      +-----------+------------+
                                  |
                                  v
                      +-----------+------------+
                      |      Railway Backend   |
                      |     Spring Boot API    |
                      +-----------+------------+
                                  |
                                  v
                      +-----------+------------+
                      |     MongoDB Atlas      |
                      |  Encrypted Vote Store  |
                      +-----------+------------+
```

---

## ✨ Features

### 🔐 Secure Voting
- Anonymous ballots  
- One-vote-per-user  
- AES-256 encrypted vote documents  
- Admin & delegate cannot see voter details  
- Results shown only after election closes  

### 🧩 Role-Based Access Control

| Role | Capabilities |
|------|--------------|
| **Voter** | Cast vote, view election status & results |
| **Delegate** | Manage parties/candidates, trigger recount |
| **Logger** | View/export audit logs |
| **Admin** | Election configuration + creating privileged accounts |

