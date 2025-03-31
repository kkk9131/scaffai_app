// LINE通知用のトークンを設定する（初回だけ実行）
function setLineToken() {
  const token = "ここに自分のLINEトークンを貼り付けてね";
  PropertiesService.getScriptProperties().setProperty('LINE_TOKEN', token);
}

// トリガーの手動設定（初回だけ実行）
function setupTriggers() {
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'onEdit') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  ScriptApp.newTrigger('onEdit').forSpreadsheet(SpreadsheetApp.getActive()).onEdit().create();
}

// テスト通知を送る（動作確認用）
function testNotification() {
  const result = sendLineNotification("テスト通知", "テスト");
  const msg = result ? "送信成功" : "送信失敗";
  SpreadsheetApp.getActiveSpreadsheet().toast(msg, "テスト結果", 3);
}