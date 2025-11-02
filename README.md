# Sudoku Web App

[日本語版はこちら](#日本語版)

A browser-based Sudoku web application with multiple difficulty levels and smart features.

## Features

- **5 Difficulty Levels**
  - Very Easy: 25-29 empty cells, depth 0 (all cells logically determinable)
  - Easy: 30-35 empty cells, depth 1
  - Medium: 36-45 empty cells, depth 2
  - Hard: 46-55 empty cells, depth 3-5
  - Custom: Specify empty cell count and assumption depth

  *Note: "Depth" refers to the minimum number of assumptions (trial-and-error) needed to solve the puzzle logically.*

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

- **Puzzle Solver Mode**
  - Input your own puzzle and get the solution
  - Automatically measures puzzle difficulty (depth up to 6)
  - Displays assumption depth required to solve

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

## Puzzle Generation

- **Solvability**: All generated puzzles are guaranteed to have at least one solution
- **Uniqueness**: The algorithm does not guarantee unique solutions. Some puzzles (especially "Hard" difficulty) may have multiple valid solutions
- **Difficulty Measurement**: Uses a depth-first search algorithm to measure the minimum number of assumptions needed to solve the puzzle

## License

MIT License

---

# 日本語版

ブラウザで動作するナンプレ（Number Place）Webアプリケーションです。

## 特徴

- **5つの難易度レベル**
  - 超簡単：25-29個の空白、深さ0（すべてのマスが論理的に確定可能）
  - 簡単：30-35個の空白、深さ1
  - 普通：36-45個の空白、深さ2
  - 難しい：46-55個の空白、深さ3-5
  - カスタム：空白マス数と仮置き深さを指定

  *注：「深さ」とは、パズルを論理的に解くために必要な最小の仮置き（試行錯誤）回数を指します。*

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

- **問題を解かせるモード**
  - 自分で入力した問題の解答を表示
  - 自動的に問題の難易度を測定（深さ6まで）
  - 解くために必要な仮置き深さを表示

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

## 問題生成について

- **解の存在**: 生成されるすべての問題は、少なくとも1つの解を持つことが保証されています
- **解の一意性**: アルゴリズムは解の一意性を保証しません。一部の問題（特に「難しい」難易度）は複数の有効な解を持つ可能性があります
- **難易度測定**: 深さ優先探索アルゴリズムを使用して、パズルを解くために必要な最小の仮置き回数を測定します

## ライセンス

MIT License
