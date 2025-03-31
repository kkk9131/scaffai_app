/**
 * チェックボックス（A113）を押すと
 * 積込シートを複製＆初期化する処理。
 */
function onEdit(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const range = e.range;
  const editedRow = range.getRow();
  const editedCol = range.getColumn();

  // A113セル（完了チェック）をトリガーにする
  const triggerRow = 113;
  const triggerCol = 1;

  // 処理中フラグ（二重実行を防止する）
  const scriptProperties = PropertiesService.getScriptProperties();
  const isRunning = scriptProperties.getProperty("IS_RUNNING");
  if (isRunning === "true") return;

  // チェックされたら処理スタート
  if (editedRow === triggerRow && editedCol === triggerCol && range.getValue() === true) {
    try {
      scriptProperties.setProperty("IS_RUNNING", "true"); // フラグON

      // 現在のシートを取得して名前を作る
      const originalSheet = e.source.getActiveSheet();
      const originalName = originalSheet.getName();

      const today = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy-MM-dd");
      const baseName = `${today}_積込`;

      // 重複しないシート名を探す（1, 2, 3...）
      let i = 1;
      let newName = `${baseName}_${i}`;
      while (ss.getSheetByName(newName)) {
        i++;
        newName = `${baseName}_${i}`;
      }

      // シートをコピーして新しい名前を付ける
      const copiedSheet = ss.getSheetByName(originalName).copyTo(ss);
      const newSheet = ss.getSheets()[ss.getSheets().length - 1];
      newSheet.setName(newName);

      // 内容をクリアしてチェックリストを初期化
      const startRow = 2;
      const endRow = 110;
      const clearCols = [3, 4, 5]; // C〜E列
      clearCols.forEach(col => {
        newSheet.getRange(startRow, col, endRow - startRow + 1).clearContent();
      });

      // チェックボックスを再生成
      newSheet.getRange(startRow, 4, endRow - startRow + 1).insertCheckboxes(); // D列
      newSheet.getRange(113, 1).insertCheckboxes().setValue(false); // A113
      newSheet.getRange(113, 2).insertCheckboxes().setValue(false); // B113
      newSheet.getRange(113, 3).clearContent(); // 担当者
      newSheet.getRange(113, 4).clearContent(); // 時刻
      newSheet.getRange(113, 5).clearContent(); // メモ欄など

      // 元のシートのA113チェックを戻す
      originalSheet.getRange(triggerRow, triggerCol).setValue(false);

      ss.toast(`✅ シート「${newName}」を1枚だけ追加しました`, "完了", 4);
    } finally {
      scriptProperties.deleteProperty("IS_RUNNING"); // フラグOFF
    }
    return;
  }

  // 必要であれば、ここにC列チェックで通知処理も追加できる
}