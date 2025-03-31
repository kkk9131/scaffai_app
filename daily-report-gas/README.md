# 📝 日報自動通知テンプレート

Google スプレッドシート上のチェック操作から  
LINE 通知＋月次シート記録を自動化するテンプレートです。  
複数現場対応・最終確認後の一括リセットにも対応しています。

---

## 🔧 機能一覧

- ✅ チェックボックスで日報完了通知（LINEに送信）
- ✅ 完了時刻を自動記録
- ✅ 月別シートに作業履歴を記録（重複チェックあり）
- ✅ 「最終確認」で全シートを初期化
- ✅ テスト通知／トークン登録もワンクリックで可能

---

## 📁 ファイル構成（VSCode管理）

| ファイル名 | 役割 |
|------------|------|
| `main_dailyReport.gs` | チェックで処理開始する onEdit トリガー本体 |
| `common_notifyAndRecord.gs` | LINE通知・記録・リセットなどの共通処理 |
| `setup_functions.gs` | トークン設定・トリガー登録・テスト通知など初期設定系 |

---

## 🚀 導入手順（初回）

```bash
npm install -g @google/clasp         # clasp が未導入なら実行
clasp login                          # Googleアカウント認証
mkdir daily-report-gas && cd $_     # プロジェクトフォルダ作成
clasp create --type sheets --title "日報自動通知テンプレ"

次に .gs ファイルを3つ作成し、コードを貼り付けて clasp push：
clasp push      # GAS に反映
clasp open      # スクリプトエディタを開く

🔐 初期設定（LINE連携）
	1.	LINE Developers で Messaging API トークンを取得
	2.	setup_functions.gs の setLineToken() に貼り付け
	3.	スクリプトエディタで setLineToken() を実行

⸻

✅ 運用フロー（現場作業）


💡 カスタマイズ例
	•	通知先を個別に分岐（担当者別LINE ID連携）
	•	Google Docsへの報告書生成連携
	•	スプレッドシート複数現場対応（1現場1シート）

⸻

📝 ライセンス／利用条件
	•	社内利用・カスタマイズ自由
	•	クレジット不要・報告不要
	•	改造・派生プロジェクトもOK！

⸻

Created by Kaz_Trigger
---
