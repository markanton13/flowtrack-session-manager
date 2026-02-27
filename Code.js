// ===============================
// FLOWTRACK ENGINE - CORE v1
// ===============================

const DB_ID = "1HK9lwmolCrriraIQkoH0fO_Z4blPVyuspMPbZDqjhV8";

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

    if (
      String(userEmail).toLowerCase().trim() == String(email).toLowerCase().trim() &&
      Number(userPass) == Number(password) &&
      active === true
    ) {

      // 🔥 CREATE SESSION
      const sessionSheet = getDB().getSheetByName("SESSIONS");

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
        user: { userId, name, role },
        sessionId: sessionId
      };
    }
  }

  return { success: false, message: "Invalid credentials" };
}


function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Login")
    .setTitle("FlowTrack");
}

function testDB() {
  const sheet = getDB().getSheetByName("USERS");
  const data = sheet.getDataRange().getValues();
  Logger.log(data);
}