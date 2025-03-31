// --- LINE通知を送る関数 ---
function sendLineNotification(taskName, sheetNameLabel) {
  try {
    const props = PropertiesService.getScriptProperties();
    let accessToken = props.getProperty('LINE_TOKEN');

    if (!accessToken) {
      SpreadsheetApp.getActiveSpreadsheet().toast("LINEトークンが未設定です", "エラー", 5);
      return false;
    }

    let 現場名 = "", 作業者 = "";
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const siteSheet = ss.getSheetByName("現場情報");
      if (siteSheet) {
        現場名 = siteSheet.getRange("B4").getValue() || "未設定";
        const 作業者1 = siteSheet.getRange("B7").getValue() || "";
        const 作業者2 = siteSheet.getRange("B8").getValue() || "";
        作業者 = 作業者1 && 作業者2 ? `${作業者1}・${作業者2}` : (作業者1 || 作業者2 || "未設定");
      }
    } catch (e) {
      現場名 = "未設定";
      作業者 = "未設定";
    }

    const message = `📋 作業完了通知\n現場名：${現場名}\nシート名：${sheetNameLabel}\n作業項目：${taskName}\n作業者：${作業者}\n完了時刻：${new Date().toLocaleString('ja-JP')}`;
    const response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + accessToken
      },
      payload: JSON.stringify({ messages: [{ type: "text", text: message }] }),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    if (code >= 200 && code < 300) {
      return true;
    } else {
      Logger.log("LINE通知失敗：" + response.getContentText());
      return false;
    }
  } catch (error) {
    Logger.log("通知エラー：" + error);
    return false;
  }
}

// --- 月次シートに記録する関数 ---
function recordToMonthlySheet(taskName, timestamp) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const siteSheet = ss.getSheetByName("現場情報");
    const rawDate = siteSheet.getRange("B5").getValue();
    const 作業日 = rawDate ? new Date(rawDate) : new Date();
    const 現場名 = siteSheet.getRange("B4").getValue() || "未設定";
    const 作業者1 = siteSheet.getRange("B7").getValue() || "未設定";
    const 作業者2 = siteSheet.getRange("B8").getValue() || "";
    const 作業者 = 作業者2 ? `${作業者1}・${作業者2}` : 作業者1;

    const yearMonth = Utilities.formatDate(作業日, "Asia/Tokyo", "yyyy-MM");
    let reportSheet = ss.getSheetByName(yearMonth);
    if (!reportSheet) {
      reportSheet = ss.insertSheet(yearMonth);
      reportSheet.appendRow(["作業日", "現場名", "作業者", "作業項目", "完了時刻"]);
    }

    reportSheet.appendRow([作業日, 現場名, 作業者, taskName, timestamp]);
    return true;
  } catch (error) {
    Logger.log("記録エラー：" + error);
    return false;
  }
}

// --- 指定された複数のシートをリセットする ---
function resetMultipleSheets(sheetNames) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  sheetNames.forEach(name => {
    const sheet = ss.getSheetByName(name);
    if (!sheet) return;

    switch(name) {
      case "現場情報":
        resetSiteInfoSheet(sheet);
        break;
      case "リーダー指示書":
      case "アシスタント指示書":
        resetInstructionSheet(sheet);
        break;
      case "進捗管理":
        resetProgressSheet(sheet);
        break;
    }
  });
}

// 各リセット処理（中身は省略してOK）
function resetSiteInfoSheet(sheet) { sheet.getRange("B4:B10").clearContent(); }
function resetInstructionSheet(sheet) { sheet.getRange("D3:D8").clearContent(); }
function resetProgressSheet(sheet) { sheet.getRange("B2:E6").clearContent(); }