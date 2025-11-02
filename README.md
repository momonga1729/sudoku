# Sudoku Web App

[日本語版はこちら](#日本語版)

A browser-based Sudoku web application with multiple difficulty levels and smart features.

## Features

- **4 Difficulty Levels**
  - Very Easy: All cells logically determinable (unique solution guaranteed)
  - Easy: 30-35 empty cells
  - Medium: 36-45 empty cells
  - Hard: 46-55 empty cells (multiple solutions possible)

- **Keyboard Controls**
  - Arrow keys: Navigate between cells
  - Enter: Toggle edit mode
  - Escape: Clear input

- **Candidate Notes**
  - Enter multiple numbers in a cell (e.g., "123", "45")
  - Font size automatically adjusts based on content length
  - Pink background indicates candidate notes

- **Smart Hint System**
  1. First priority: Corrects mistakes
  2. Second priority: Suggests determinable cells
  3. Third priority: Random hint

- **Flexible Answer Checking**
  - Accepts alternative solutions if they follow Sudoku rules
  - Side-by-side comparison view to identify errors

- **Additional Features**
  - Timer
  - Hint count limit
  - Responsive design
  - Language toggle (Japanese/English)

## How to Play

1. Open `index.html` in your browser
2. Select difficulty and hint settings
3. Start the game

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript

## License

MIT License

---

# 日本語版

ブラウザで動作する数独（Sudoku）Webアプリケーションです。

## 特徴

- **4つの難易度レベル**
  - 超簡単：すべてのマスが確定可能（一意解保証）
  - 簡単：30-35個の空白
  - 普通：36-45個の空白
  - 難しい：46-55個の空白（複数解の可能性あり）

- **キーボード操作**
  - 矢印キー：マス移動
  - Enter：編集モード切り替え
  - Escape：入力クリア

- **候補メモ機能**
  - 複数の数字を入力可能（例：「123」「45」）
  - 文字数に応じて自動的にフォントサイズ調整
  - 薄ピンク背景で候補メモを表示

- **賢いヒント機能**
  1. 間違いの訂正を優先
  2. 確定可能なマスを提案
  3. ランダムにヒント表示

- **柔軟な答え合わせ**
  - 別解でもルールを満たしていれば正解
  - 左右比較表示で間違い箇所を確認

- **その他**
  - タイマー機能
  - ヒント回数制限
  - レスポンシブデザイン
  - 言語切り替え（日本語/英語）

## 使い方

1. `index.html` をブラウザで開く
2. 難易度とヒント設定を選択
3. ゲーム開始

## 技術スタック

- HTML5
- CSS3
- Vanilla JavaScript

## ライセンス

MIT License
