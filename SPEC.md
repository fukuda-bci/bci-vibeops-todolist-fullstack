# SPEC.md - マルチユーザー・タスク管理ツール (簡易版)

## 1. 概要
複数人でタスクを共有・管理するツール。
**認証機能は持たず**、誰でもタスクの作成・編集・メンバーの管理が可能。
UIは日本語化され、視認性の高いデザインを採用。

## 2. UI仕様
### ページ
- **ダッシュボード**:
  - タスク一覧表示。
  - **フィルタ機能**:
    - ステータス (すべて, 未着手, 進行中, 完了)
    - 担当者 (すべての担当者, 各メンバー)
  - **タスクカード**:
    - タイトル、説明、担当者名、ステータス変更ドロップダウン、編集/削除ボタン。
    - 視認性向上のため、文字色は濃いグレー/黒を使用。
- **メンバー管理**:
  - メンバーの追加（名前、メールアドレス）。
  - メンバー一覧表示と削除。
- **タスク詳細/編集 (モーダル)**:
  - タスク作成・編集。
  - タイトル、説明、担当者（ドロップダウン選択）を入力。
  - ダークモード環境でも視認性を確保（白背景、黒文字）。

### デザイン方針
- **配色**: ベースは白/グレー。アクセントに青 (`blue-600`)。
- **コントラスト**: 文字色は `text-gray-900` (ほぼ黒) や `text-gray-700` を中心に使用し、読みやすさを重視。
- **ステータス表記**: 日本語統一 (TODO -> 未着手, IN_PROGRESS -> 進行中, DONE -> 完了)。

## 3. データモデル (Django)

### Member (メンバー)
- `name`: CharField (名前)
- `email`: EmailField (メールアドレス - 任意)
- `created_at`: DateTimeField

### Task (タスク)
- `title`: CharField
- `description`: TextField
- `status`: ChoiceField (TODO, IN_PROGRESS, DONE)
- `assignee`: ForeignKey(Member, null=True, on_delete=SET_NULL)
- `due_date`: DateTimeField(null=True)
- `created_at`: DateTimeField
- `updated_at`: DateTimeField

### Comment (コメント) - *実装予定*
- `task`: ForeignKey(Task)
- `content`: TextField
- `created_at`: DateTimeField

## 4. API設計 (Django REST Framework)

### Members
- `GET /api/members/`: メンバー一覧
- `POST /api/members/`: メンバー作成
- `DELETE /api/members/{id}/`: メンバー削除

### Tasks
- `GET /api/tasks/`: タスク一覧
- `POST /api/tasks/`: タスク作成
- `GET /api/tasks/{id}/`: タスク詳細
- `PUT/PATCH /api/tasks/{id}/`: タスク更新
- `DELETE /api/tasks/{id}/`: タスク削除

## 5. ディレクトリ構成
```
root/
  backend/
    members/        # メンバー管理アプリ
    tasks/          # タスク管理アプリ
    config/         # Django設定
  frontend/
    src/
      app/
        members/    # メンバー管理ページ
        page.tsx    # ダッシュボード
      components/
        TaskCard.tsx
        TaskModal.tsx
      lib/
        api.ts      # APIクライアント
        constants.ts # 定数 (ステータスラベル等)
        types.ts    # 型定義
```
