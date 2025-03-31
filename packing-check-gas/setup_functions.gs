/**
 * LINE通知用のトークンを登録する関数
 * 初回だけ実行すればOK！
 */
function setLineToken() {
  const token = "ここにLINEのアクセストークンを貼ってください";
  PropertiesService.getScriptProperties().setProperty('LINE_TOKEN', token);
  Logger.log("✅ LINE_TOKENを設定しました");
  SpreadsheetApp.getUi().alert("✅ LINEトークンの設定が完了しました");
}

/**
 * 通知がちゃんと飛ぶかを確認するテスト関数
 */
function testSendNotification() {
  const name = "テスト担当者";
  const timestamp = new Date();
  const result = sendLineNotification(name, timestamp);
  if (result) {
    SpreadsheetApp.getUi().alert("✅ 通知テスト成功！");
  } else {
    SpreadsheetApp.getUi().alert("❌ 通知送信に失敗しました");
  }
}