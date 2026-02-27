// ===============================
// FLOWTRACK ENGINE - CORE v1
// ===============================

const DB_ID = PropertiesService.getScriptProperties().getProperty("DB_ID");

function getDB() {
  return SpreadsheetApp.openById(DB_ID);
}

// ---------- AUTH ----------

function login(email, password) {

  const sheet = getDB().getSheetByName("USERS");
  const lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    return { success: false, message: "No users found" };
  }

  const data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();

  for (let i = 0; i < data.length; i++) {

    const [userId, name, userEmail, userPass, role, managerId, active] = data[i];
    Logger.log("Checking: " + userEmail + " | " + userPass + " | active: " + active);

    if (
  String(userEmail).toLowerCase().trim() === String(email).toLowerCase().trim() &&
  String(userPass).trim() === String(password).trim() &&
  (active === true || String(active).toLowerCase() === "true")
) {

      const sessionSheet = getDB().getSheetByName("SESSIONS");
      const sessions = sessionSheet.getDataRange().getValues();

      // 🔒 Prevent multiple active sessions
      for (let s = 1; s < sessions.length; s++) {
        const [sid, uid, start, end, status] = sessions[s];

        if (uid === userId && status === "ACTIVE") {
          return {
            success: false,
            message: "User already logged in."
          };
        }
      }

      const sessionId = "S" + new Date().getTime();
      const now = new Date();

      sessionSheet.appendRow([
        sessionId,
        userId,
        now,
        "",
        "ACTIVE",
        now
      ]);

      return {
        success: true,
        user: {
          userId: String(userId),
          name: String(name),
          role: String(role)
        },
        sessionId: String(sessionId)
      };
    }
  }

  return { success: false, message: "Invalid credentials" };
}

function doGet(e) {
  try {

    const baseUrl = ScriptApp.getService().getUrl();
    let page = "Login";
    let sessionId = null;

    // Check if parameters exist
    if (e && e.parameter) {

      sessionId = e.parameter.sessionId || null;
      const requestedPage = e.parameter.page || null;

      // If sessionId exists, validate it
      if (sessionId) {

        const check = validateSession(sessionId);

        if (check.valid) {

          if (requestedPage === "agent") page = "Agent";
          else if (requestedPage === "manager") page = "Manager";
          else if (requestedPage === "admin") page = "Admin";

        }
      }
    }

    const template = HtmlService.createTemplateFromFile(page);

    // Inject variables into HTML
    template.baseUrl = baseUrl;
    template.sessionId = sessionId;

    return template.evaluate().setTitle("FlowTrack");

  } catch (err) {

    return HtmlService.createHtmlOutput(
      "<h3>Routing Error:</h3><pre>" + err.message + "</pre>"
    );
  }
}

function testDB() {
  const sheet = getDB().getSheetByName("USERS");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}

function logout(sessionId) {

  Logger.log("Logout called with sessionId: " + sessionId);

  const sheet = getDB().getSheetByName("SESSIONS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    const sheetSessionId = String(data[i][0]).trim();
    Logger.log("Checking row sessionId: " + sheetSessionId);

    if (sheetSessionId === String(sessionId).trim()) {

      sheet.getRange(i + 1, 4).setValue(new Date());
      sheet.getRange(i + 1, 5).setValue("OFFLINE");
      sheet.getRange(i + 1, 6).setValue(new Date());

      Logger.log("Session matched and updated.");
      return true;
    }
  }

  Logger.log("No matching session found.");
  return false;
}

function updateStatus(sessionId, newStatus) {

  const sheet = getDB().getSheetByName("SESSIONS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {

    if (data[i][0] === sessionId) {

      sheet.getRange(i + 1, 5).setValue(newStatus);
      sheet.getRange(i + 1, 6).setValue(new Date());

      break;
    }
  }

  return true;
}

function validateSession(sessionId) {

  const sheet = getDB().getSheetByName("SESSIONS");
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    const [sid, userId, start, end, status] = data[i];

    if (sid === sessionId && status === "ACTIVE") {
      return { valid: true, userId: userId };
    }
  }

  return { valid: false };
}