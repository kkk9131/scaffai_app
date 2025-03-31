/**
 * LINEに積込完了通知を送る
 * @param {string} name 担当者名
 * @param {Date} timestamp 完了時刻
 */
function sendLineNotification(name, timestamp) {
  const token = PropertiesService.getScriptProperties().getProperty('LINE_TOKEN');
  if (!token) {
    Logger.log("❌ LINE_TOKENが設定されていません");
    return false;
  }

  // 日付形式を文字列に変換
  const timeStr = Utilities.formatDate(timestamp, "Asia/Tokyo", "yyyy/MM/dd HH:mm:ss");
  const message = `📦 積み込み完了通知\n担当者: ${name}\n時刻: ${timeStr}`;

  try {
    const response = UrlFetchApp.fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      },
      payload: JSON.stringify({
        messages: [{ type: "text", text: message }]
      }),
      muteHttpExceptions: true
    });

    const code = response.getResponseCode();
    Logger.log(`📤 LINE通知レスポンス: ${code}`);
    return (code >= 200 && code < 300);
  } catch (err) {
    Logger.log("❌ LINE通知エラー: " + err);
    return false;
  }
}

/**
 * 積込チェックリストを初期化する関数
 * @param {Sheet} sheet - 対象のシート
 */
function resetInput(sheet) {
  const checkStartRow = 2;
  const checkEndRow = 110;
  const checkCol = 4;
  const quantityCol = 3;

  const completeCheckRow = 113;
  const completeCheckCol = 2;
  const nameCol = 3;
  const timeCol = 4;

  for (let i = checkStartRow; i <= checkEndRow; i++) {
    sheet.getRange(i, checkCol).setValue(false);       // D列チェックを外す
    sheet.getRange(i, quantityCol).clearContent();     // C列をクリア
  }

  sheet.getRange(completeCheckRow, nameCol).clearContent();     // 担当者
  sheet.getRange(completeCheckRow, timeCol).clearContent();     // 時刻
  sheet.getRange(completeCheckRow, completeCheckCol).setValue(false); // B列チェック外す

  SpreadsheetApp.getActiveSpreadsheet().toast("✅ 入力を初期化しました", "リセット完了", 5);
}