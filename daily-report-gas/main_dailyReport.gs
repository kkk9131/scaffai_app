/**
 * チェックボックスが押されたときに動くメイン関数
 * 各種処理（通知・記録・リセット）を呼び出す入口
 */
function onEdit(e) {
  const sheetName = '進捗管理';
  const checkCol = 4;
  const timeCol = 5;
  const notifiedCol = 6;

  const sheet = e.source.getSheetByName(sheetName);
  const activeSheet = e.source.getActiveSheet();

  if (!activeSheet || activeSheet.getName() !== sheetName) return;

  const range = e.range;
  if (range.getColumn() !== checkCol || range.getRow() === 1) return;

  const row = range.getRow();
  const checkboxValue = range.getValue();
  if (checkboxValue !== true) return;

  const taskName = sheet.getRange(row, 1).getValue();
  const notified = sheet.getRange(row, notifiedCol).getValue();
  const sheetNameLabel = sheet.getName();

  if (notified !== "通知済") {
    const timestamp = new Date();
    sheet.getRange(row, timeCol).setValue(timestamp);

    if (sendLineNotification(taskName, sheetNameLabel)) {
      sheet.getRange(row, notifiedCol).setValue("通知済");
      recordToMonthlySheet(taskName, timestamp);

      if (taskName === "最終確認") {
        const sheetsToReset = ["現場情報", "リーダー指示書", "アシスタント指示書", "進捗管理"];
        resetMultipleSheets(sheetsToReset);
      }
    }
  }
}