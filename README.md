# FlowTrack – Workforce Session Management Engine

FlowTrack is a lightweight session-based workforce management system built using Google Apps Script with Google Sheets as the backend database.

This project demonstrates:

- Multi-user authentication
- Session lifecycle management (Login / Logout)
- Activity tracking structure
- Spreadsheet-backed database architecture
- Environment configuration using Script Properties
- Local development workflow using clasp
- GitHub-based version control

---

## 🧱 Architecture

**Frontend**
- HTML
- Vanilla JavaScript

**Backend**
- Google Apps Script
- Spreadsheet-based persistence

**Dev Workflow**
- clasp (local development)
- Git
- GitHub

---

## 🔐 Security

Database identifiers are not hardcoded in the repository.

Environment configuration is handled via:

```
PropertiesService.getScriptProperties()
```

---

## 🚀 Setup Instructions

1. Create a new Google Spreadsheet.
2. Add required sheets:
   - USERS
   - SESSIONS
   - ACTIVITY_LOG
   - SETTINGS
3. In Apps Script:
   - Add Script Property:
     - Key: `DB_ID`
     - Value: your spreadsheet ID
4. Deploy as Web App.

---

## 📌 Current Status

Authentication and session initialization engine completed.

Further modules (activity transitions, compliance engine, dashboard UI) in development.

---

Built by Mark Anton Badong