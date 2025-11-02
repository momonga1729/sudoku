// グローバル変数
let currentPuzzle = [];
let currentSolution = [];
let userSolution = []; // 文字列配列として管理
let hintsEnabled = true;
let hintsRemaining = 3;
let timerInterval = null;
let seconds = 0;
let editMode = {}; // 編集モード管理 (key: "row-col", value: true/false)
let currentLanguage = 'ja'; // 現在の言語

// 翻訳データ
const translations = {
    ja: {
        // アプリタイトル
        'app-title': 'ナンプレアプリ',

        // メインメニュー
        'menu-title': 'モード選択',
        'menu-play': '問題を解く',
        'menu-solve': '問題を入力して解かせる',

        // ゲーム設定
        'setup-title': 'ゲーム設定',
        'setup-difficulty': '難易度:',
        'difficulty-veryeasy': '超簡単',
        'difficulty-easy': '簡単',
        'difficulty-medium': '普通',
        'difficulty-hard': '難しい',
        'difficulty-custom': 'カスタム',
        'difficulty-veryeasy-desc': '超簡単 (25-29マス, 深さ0)',
        'difficulty-easy-desc': '簡単 (30-35マス, 深さ1)',
        'difficulty-medium-desc': '普通 (36-45マス, 深さ2)',
        'difficulty-hard-desc': '難しい (46-55マス, 深さ3-5)',
        'difficulty-custom-desc': 'カスタム',
        'setup-empty-cells': '空きマス数:',
        'setup-depth': '仮置き深さ:',
        'setup-hint-enable': 'ヒント機能を有効にする',
        'setup-hint-limit': 'ヒント回数:',
        'btn-start': 'ゲーム開始',
        'btn-back': '戻る',

        // ゲーム画面
        'game-difficulty': '難易度',
        'game-hint': 'ヒント',
        'game-time': '時間',
        'game-hint-disabled': '無効',
        'btn-use-hint': 'ヒントを使う',
        'btn-check': '答え合わせ',
        'btn-reset': 'リセット',

        // 比較画面
        'comparison-user': 'あなたの入力',
        'comparison-answer': '正解',

        // 手動入力画面
        'manual-title': '問題を入力してください',
        'manual-description': '空白のマスは0を入力してください',
        'btn-solve': 'この問題を解く',
        'btn-clear': 'クリア',

        // メッセージ
        'msg-no-hints': 'ヒントはもう使えません',
        'msg-all-filled': 'すべてのマスが埋まっています',
        'msg-hint-used': 'ヒントを使用しました',
        'msg-hint-remaining': '残り',
        'msg-hint-times': '回',
        'msg-hint-correct': '間違いを訂正',
        'msg-hint-determined': '確定可能なマス',
        'msg-hint-random': 'ランダム',
        'msg-confirm-answer': 'すべてのマスが埋まっていませんが答え合わせしますか？',
        'msg-correct': '正解です！おめでとうございます！',
        'msg-time': '時間',
        'msg-incorrect': '間違っている箇所があります。正誤を確認してください。',
        'msg-confirm-reset': 'ゲームをリセットしますか？',
        'msg-invalid-puzzle': '無効なナンプレパズルです。入力を確認してください。',
        'msg-solved': '解答を表示しました！',
        'msg-no-solution': 'このナンプレパズルは解けません',
        'msg-depth': '仮置き深さ',
        'msg-depth-over': '以上'
    },
    en: {
        // App title
        'app-title': 'Number Place App',

        // Main menu
        'menu-title': 'Select Mode',
        'menu-play': 'Play Puzzle',
        'menu-solve': 'Solve Puzzle',

        // Game setup
        'setup-title': 'Game Settings',
        'setup-difficulty': 'Difficulty:',
        'difficulty-veryeasy': 'Very Easy',
        'difficulty-easy': 'Easy',
        'difficulty-medium': 'Medium',
        'difficulty-hard': 'Hard',
        'difficulty-custom': 'Custom',
        'difficulty-veryeasy-desc': 'Very Easy (25-29 cells, depth 0)',
        'difficulty-easy-desc': 'Easy (30-35 cells, depth 1)',
        'difficulty-medium-desc': 'Medium (36-45 cells, depth 2)',
        'difficulty-hard-desc': 'Hard (46-55 cells, depth 3-5)',
        'difficulty-custom-desc': 'Custom',
        'setup-empty-cells': 'Empty cells:',
        'setup-depth': 'Depth:',
        'setup-hint-enable': 'Enable hints',
        'setup-hint-limit': 'Hint limit:',
        'btn-start': 'Start Game',
        'btn-back': 'Back',

        // Game screen
        'game-difficulty': 'Difficulty',
        'game-hint': 'Hint',
        'game-time': 'Time',
        'game-hint-disabled': 'Disabled',
        'btn-use-hint': 'Use Hint',
        'btn-check': 'Check Answer',
        'btn-reset': 'Reset',

        // Comparison screen
        'comparison-user': 'Your Input',
        'comparison-answer': 'Correct Answer',

        // Manual input screen
        'manual-title': 'Enter Puzzle',
        'manual-description': 'Enter 0 for empty cells',
        'btn-solve': 'Solve This Puzzle',
        'btn-clear': 'Clear',

        // Messages
        'msg-no-hints': 'No hints remaining',
        'msg-all-filled': 'All cells are filled',
        'msg-hint-used': 'Hint used',
        'msg-hint-remaining': '',
        'msg-hint-times': 'remaining',
        'msg-hint-correct': 'Corrected mistake',
        'msg-hint-determined': 'Determinable cell',
        'msg-hint-random': 'Random',
        'msg-confirm-answer': 'Not all cells are filled. Check answer anyway?',
        'msg-correct': 'Correct! Congratulations!',
        'msg-time': 'Time',
        'msg-incorrect': 'There are errors. Please check.',
        'msg-confirm-reset': 'Reset the game?',
        'msg-invalid-puzzle': 'Invalid puzzle. Please check your input.',
        'msg-solved': 'Solution displayed!',
        'msg-no-solution': 'This puzzle cannot be solved',
        'msg-depth': 'Depth',
        'msg-depth-over': 'or more'
    }
};

// 翻訳取得ヘルパー関数
function t(key) {
    return translations[currentLanguage][key] || key;
}

// 言語切り替え関数
function setLanguage(lang) {
    currentLanguage = lang;

    // すべての翻訳対象要素を更新
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });

    // 難易度選択のoption要素を更新
    const difficultySelect = document.getElementById('difficulty');
    if (difficultySelect) {
        const options = difficultySelect.querySelectorAll('option');
        options.forEach(option => {
            const value = option.value;
            const key = `difficulty-${value}-desc`;
            if (translations[lang][key]) {
                option.textContent = translations[lang][key];
            }
        });
    }

    // アクティブボタンの切り替え
    document.getElementById('lang-ja').classList.toggle('active', lang === 'ja');
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
}

// 画面遷移関数
function showMainMenu() {
    hideAllScreens();
    resetGameUI();
    document.getElementById('main-menu').classList.remove('hidden');
    stopTimer();
}

function showGameSetup() {
    hideAllScreens();
    resetGameUI();
    document.getElementById('game-setup').classList.remove('hidden');
    stopTimer();
}

function showManualInput() {
    hideAllScreens();
    document.getElementById('manual-input').classList.remove('hidden');
    createInputGrid();
    stopTimer();
}

function hideAllScreens() {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
}

// ゲームUI初期化（共通処理）
function resetGameUI() {
    // 比較エリアを非表示、元のグリッドを表示
    const comparisonArea = document.getElementById('solution-comparison');
    if (comparisonArea) {
        comparisonArea.classList.add('hidden');
    }
    const sudokuGrid = document.getElementById('sudoku-grid');
    if (sudokuGrid) {
        sudokuGrid.classList.remove('hidden');
    }

    // メッセージをクリア
    const messageEl = document.getElementById('message');
    if (messageEl) {
        messageEl.textContent = '';
        messageEl.className = '';
    }
}

// ヒント機能の有効/無効の切り替え
document.addEventListener('DOMContentLoaded', () => {
    const hintCheckbox = document.getElementById('hint-enabled');
    const hintLimitGroup = document.getElementById('hint-limit-group');
    const difficultySelect = document.getElementById('difficulty');
    const customSettings = document.getElementById('custom-settings');

    hintCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            hintLimitGroup.style.display = 'block';
        } else {
            hintLimitGroup.style.display = 'none';
        }
    });

    // 難易度選択でカスタム設定の表示/非表示を切り替え
    difficultySelect.addEventListener('change', (e) => {
        if (e.target.value === 'custom') {
            customSettings.style.display = 'block';
        } else {
            customSettings.style.display = 'none';
        }
    });

    // 初期言語を日本語に設定
    setLanguage('ja');
});

// タイマー機能
function startTimer() {
    seconds = 0;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        seconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('time').textContent =
        `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// 数独ソルバー (バックトラッキング)
function solveSudoku(board) {
    const emptyCell = findEmptyCell(board);

    if (!emptyCell) {
        return true; // パズル完成
    }

    const [row, col] = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            board[row][col] = num;

            if (solveSudoku(board)) {
                return true;
            }

            board[row][col] = 0; // バックトラック
        }
    }

    return false;
}

function findEmptyCell(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                return [row, col];
            }
        }
    }
    return null;
}

function isValidMove(board, row, col, num) {
    // 行チェック
    for (let x = 0; x < 9; x++) {
        if (board[row][x] === num) {
            return false;
        }
    }

    // 列チェック
    for (let x = 0; x < 9; x++) {
        if (board[x][col] === num) {
            return false;
        }
    }

    // 3x3ボックスチェック
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

// 完全な数独パズルを生成
function generateCompleteSudoku() {
    const board = Array(9).fill(0).map(() => Array(9).fill(0));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                shuffle(numbers);
                for (let num of numbers) {
                    if (isValidMove(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// パズルから数字を削除して問題を作成
function createPuzzle(completedBoard, difficulty) {
    const puzzle = completedBoard.map(row => [...row]);

    if (difficulty === 'veryeasy') {
        // 超簡単：すべてのマスが一つに確定している状態を作る
        return createVeryEasyPuzzle(puzzle);
    }

    let cellsToRemove;
    switch (difficulty) {
        case 'easy':
            cellsToRemove = 30 + Math.floor(Math.random() * 6); // 30-35
            break;
        case 'medium':
            cellsToRemove = 36 + Math.floor(Math.random() * 10); // 36-45
            break;
        case 'hard':
            cellsToRemove = 46 + Math.floor(Math.random() * 10); // 46-55
            break;
        default:
            cellsToRemove = 40;
    }

    // すべてのセルをランダムな順序でリストアップ
    const allCells = [];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            allCells.push({row, col});
        }
    }
    shuffle(allCells);

    let removed = 0;
    for (const cell of allCells) {
        if (removed >= cellsToRemove) break;

        const {row, col} = cell;
        const originalValue = puzzle[row][col];
        puzzle[row][col] = 0;

        // 削除後も解けるかチェック
        const testPuzzle = puzzle.map(r => [...r]);
        if (solveSudoku(testPuzzle)) {
            // 解ける場合は削除を確定
            removed++;
        } else {
            // 解けない場合は元に戻す
            puzzle[row][col] = originalValue;
        }
    }

    return puzzle;
}

// 超簡単モード：すべて確定可能な問題を作成
function createVeryEasyPuzzle(completedBoard) {
    const puzzle = completedBoard.map(row => [...row]);
    const cellsToProcess = [];

    // すべてのセルをリストアップ
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            cellsToProcess.push({row, col});
        }
    }

    // ランダムな順序でセルを処理
    shuffle(cellsToProcess);

    // 各セルを削除してみて、確定可能かチェック
    for (const cell of cellsToProcess) {
        const {row, col} = cell;
        const originalValue = puzzle[row][col];
        puzzle[row][col] = 0;

        // このセルが確定可能か（候補が1つだけか）チェック
        const candidates = [];
        for (let num = 1; num <= 9; num++) {
            if (isValidMove(puzzle, row, col, num)) {
                candidates.push(num);
            }
        }

        // 候補が1つでない場合は元に戻す
        if (candidates.length !== 1) {
            puzzle[row][col] = originalValue;
        }
    }

    return puzzle;
}

// 候補を取得するヘルパー関数
function getCandidates(board, row, col) {
    const candidates = [];
    for (let num = 1; num <= 9; num++) {
        if (isValidMove(board, row, col, num)) {
            candidates.push(num);
        }
    }
    return candidates;
}

// 難易度測定：必要な仮置き深さを計算
function measureDifficulty(puzzle, maxDepth = Infinity) {
    const board = puzzle.map(r => [...r]);
    return measureDifficultyRecursive(board, 0, maxDepth);
}

function measureDifficultyRecursive(board, currentDepth, maxDepth) {
    // 論理的に確定できるマスをすべて埋める
    let progress = true;
    while (progress) {
        progress = false;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (board[row][col] === 0) {
                    const candidates = getCandidates(board, row, col);
                    if (candidates.length === 1) {
                        board[row][col] = candidates[0];
                        progress = true;
                    }
                }
            }
        }
    }

    // 目標深さに達したら早期終了（これ以上測定する必要なし）
    if (currentDepth >= maxDepth) {
        return currentDepth;
    }

    // 完成したかチェック
    const emptyCell = findEmptyCell(board);
    if (!emptyCell) {
        return currentDepth; // 解けた！
    }

    // まだ空白がある → 仮置きが必要
    // 候補が最も少ないマスを選ぶ
    let minCandidates = 10;
    let targetCell = null;
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                const candidates = getCandidates(board, row, col);
                if (candidates.length < minCandidates) {
                    minCandidates = candidates.length;
                    targetCell = {row, col, candidates};
                }
            }
        }
    }

    if (!targetCell || targetCell.candidates.length === 0) {
        return Infinity; // 矛盾
    }

    // すべての候補を試して、最小の深さを返す
    let minDepth = Infinity;
    for (const num of targetCell.candidates) {
        const testBoard = board.map(r => [...r]);
        testBoard[targetCell.row][targetCell.col] = num;
        const depth = measureDifficultyRecursive(testBoard, currentDepth + 1);
        minDepth = Math.min(minDepth, depth);
    }

    return minDepth;
}

// 改善された問題生成：空白マス数と仮置き深さの両方を条件にする
function createPuzzleWithDifficulty(completedBoard, difficulty, customEmptyCells = null, customDepth = null) {
    const maxAttempts = 100; // 最大試行回数

    // 難易度に応じた設定
    let emptyCellsRange, depthRange;

    if (difficulty === 'custom') {
        // カスタム難易度：ユーザー指定の値を使用
        const emptyCells = customEmptyCells !== null ? customEmptyCells : 40;
        const depth = customDepth !== null ? customDepth : 2;
        emptyCellsRange = {min: emptyCells, max: emptyCells};
        depthRange = {min: depth, max: depth};
    } else {
        switch (difficulty) {
            case 'veryeasy':
                emptyCellsRange = {min: 25, max: 29};
                depthRange = {min: 0, max: 0};
                break;
            case 'easy':
                emptyCellsRange = {min: 30, max: 35};
                depthRange = {min: 1, max: 1};
                break;
            case 'medium':
                emptyCellsRange = {min: 36, max: 45};
                depthRange = {min: 2, max: 2};
                break;
            case 'hard':
                emptyCellsRange = {min: 46, max: 55};
                depthRange = {min: 3, max: 5};
                break;
            default:
                emptyCellsRange = {min: 30, max: 35};
                depthRange = {min: 1, max: 1};
        }
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const puzzle = completedBoard.map(row => [...row]);

        // 目標の空白マス数を決定
        const targetEmpty = emptyCellsRange.min +
            Math.floor(Math.random() * (emptyCellsRange.max - emptyCellsRange.min + 1));

        // ランダムにマスを削除
        const allCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                allCells.push({row, col});
            }
        }
        shuffle(allCells);

        let removed = 0;
        for (const cell of allCells) {
            if (removed >= targetEmpty) break;

            const {row, col} = cell;
            const originalValue = puzzle[row][col];
            puzzle[row][col] = 0;

            // 削除後も解けるかチェック
            const testPuzzle = puzzle.map(r => [...r]);
            if (solveSudoku(testPuzzle)) {
                removed++;
            } else {
                puzzle[row][col] = originalValue;
            }
        }

        // 難易度（仮置き深さ）をチェック
        const depth = measureDifficulty(puzzle);

        // 条件を満たしているかチェック
        const isValidDepth = depth >= depthRange.min && depth <= depthRange.max;

        if (isValidDepth) {
            console.log(`問題生成成功: 空白${removed}マス, 深さ${depth}, 試行${attempt + 1}回目`);
            return puzzle;
        }
    }

    // 最大試行回数を超えた場合は、古い方法にフォールバック
    console.log('最大試行回数を超えたため、簡易モードで生成');
    return createPuzzle(completedBoard, difficulty);
}

// ゲーム開始
function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    hintsEnabled = document.getElementById('hint-enabled').checked;
    hintsRemaining = hintsEnabled ? parseInt(document.getElementById('hint-limit').value) : 0;

    // カスタム難易度の設定を取得
    let customEmptyCells = null;
    let customDepth = null;
    if (difficulty === 'custom') {
        customEmptyCells = parseInt(document.getElementById('empty-cells').value);
        customDepth = parseInt(document.getElementById('depth').value);
    }

    // 難易度の表示名を設定
    const difficultyDisplay = document.getElementById('difficulty-display');
    if (difficulty === 'custom') {
        difficultyDisplay.textContent = `${t('game-difficulty')}: ${t('difficulty-custom')} (${t('setup-empty-cells')} ${customEmptyCells}, ${t('setup-depth')} ${customDepth})`;
    } else {
        difficultyDisplay.textContent = `${t('game-difficulty')}: ${t('difficulty-' + difficulty)}`;
    }

    // パズル生成
    const completedBoard = generateCompleteSudoku();
    currentSolution = completedBoard.map(row => [...row]);
    currentPuzzle = createPuzzleWithDifficulty(completedBoard, difficulty, customEmptyCells, customDepth);

    // userSolutionを文字列配列として初期化
    userSolution = Array(9).fill(null).map(() => Array(9).fill(''));
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] !== 0) {
                userSolution[row][col] = String(currentPuzzle[row][col]);
            }
        }
    }

    editMode = {};

    // UI更新
    hideAllScreens();
    resetGameUI();
    document.getElementById('game-screen').classList.remove('hidden');

    createGameGrid();
    updateHintInfo();

    startTimer();

    // 左上隅のセルにフォーカス
    setTimeout(() => {
        const grid = document.getElementById('sudoku-grid');
        const firstCell = grid.querySelector('input');
        if (firstCell) {
            firstCell.focus();
        }
    }, 100);
}

// ゲームグリッド作成
function createGameGrid() {
    const grid = document.getElementById('sudoku-grid');
    grid.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // 3x3ボックスの境界線を太くする
            if (col % 3 === 0 && col !== 0) {
                cell.classList.add('border-left');
            }
            if (row % 3 === 0 && row !== 0) {
                cell.classList.add('border-top');
            }

            if (currentPuzzle[row][col] !== 0) {
                cell.value = currentPuzzle[row][col];
                cell.readOnly = true;
                cell.classList.add('fixed');
                cell.tabIndex = 0; // フォーカス可能にする
            } else {
                cell.value = userSolution[row][col] || '';
                cell.tabIndex = 0; // フォーカス可能にする
                cell.addEventListener('input', (e) => handleInput(e, row, col));
                cell.addEventListener('focus', (e) => handleFocus(e, row, col));

                // 既存の候補メモに背景色を適用
                if (userSolution[row][col] && userSolution[row][col].length > 1) {
                    cell.classList.add('candidate');
                    adjustFontSize(cell);
                }
            }

            // すべてのセルにキーボードナビゲーションを追加
            cell.addEventListener('keydown', (e) => handleKeyNavigation(e, row, col));

            grid.appendChild(cell);
        }
    }
}

// フォーカス処理
function handleFocus(event, row, col) {
    const key = `${row}-${col}`;
    if (!editMode[key]) {
        // 編集モードでない場合、入力欄を選択状態にする
        event.target.setSelectionRange(event.target.value.length, event.target.value.length);
    }
}

// 入力処理
function handleInput(event, row, col) {
    const key = `${row}-${col}`;
    let value = event.target.value;

    // 数字のみ許可
    value = value.replace(/[^1-9]/g, '');

    if (editMode[key]) {
        // 編集モード：自由に編集可能
        event.target.value = value;
        userSolution[row][col] = value;
    } else {
        // 通常モード：末尾に追記
        event.target.value = value;
        userSolution[row][col] = value;
    }

    // 文字数に応じてフォントサイズを調整
    adjustFontSize(event.target);

    // 背景色の設定（ゲーム中はヒントにならないように白/薄ピンクのみ）
    event.target.classList.remove('invalid');
    event.target.classList.remove('candidate');

    if (value.length > 1) {
        // 複数候補の場合は薄ピンク
        event.target.classList.add('candidate');
    }
    // 1文字以下の場合は白（何もしない）
}

// フォントサイズ調整
function adjustFontSize(input) {
    const length = input.value.length;
    if (length <= 1) {
        input.style.fontSize = '1.3em';
    } else if (length <= 3) {
        input.style.fontSize = '1.0em';
    } else if (length <= 5) {
        input.style.fontSize = '0.8em';
    } else {
        input.style.fontSize = '0.65em';
    }
}

// キーボードナビゲーション
function handleKeyNavigation(event, row, col) {
    const key = `${row}-${col}`;
    const grid = document.getElementById('sudoku-grid');
    const allCells = grid.querySelectorAll('input');

    // Enterキー：編集モード切り替え
    if (event.key === 'Enter') {
        event.preventDefault();
        editMode[key] = !editMode[key];
        if (editMode[key]) {
            event.target.style.outline = '2px solid #ff9800';
        } else {
            event.target.style.outline = '';
        }
        return;
    }

    // Escapeキー：編集モード終了 & 入力クリア
    if (event.key === 'Escape') {
        event.preventDefault();
        if (editMode[key]) {
            editMode[key] = false;
            event.target.style.outline = '';
        } else {
            event.target.value = '';
            userSolution[row][col] = '';
            adjustFontSize(event.target);
        }
        return;
    }

    // 編集モード中は矢印キーでナビゲーションしない
    if (editMode[key]) {
        return;
    }

    let newRow = row;
    let newCol = col;

    switch(event.key) {
        case 'ArrowUp':
            event.preventDefault();
            if (newRow > 0) newRow--;
            break;
        case 'ArrowDown':
            event.preventDefault();
            if (newRow < 8) newRow++;
            break;
        case 'ArrowLeft':
            event.preventDefault();
            if (newCol > 0) newCol--;
            break;
        case 'ArrowRight':
            event.preventDefault();
            if (newCol < 8) newCol++;
            break;
        default:
            return;
    }

    // 新しいセルにフォーカス
    const newIndex = newRow * 9 + newCol;
    allCells[newIndex].focus();
}

// ヒント機能
function useHint() {
    if (!hintsEnabled || hintsRemaining <= 0) {
        document.getElementById('message').textContent = t('msg-no-hints');
        return;
    }

    let targetCell = null;

    // 第一優先：間違えているセルを探す
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] === 0) {
                const userValue = userSolution[row][col];
                // 1文字入力されていて、かつ間違っている場合
                if (userValue.length === 1 && parseInt(userValue) !== currentSolution[row][col]) {
                    targetCell = {row, col, reason: t('msg-hint-correct')};
                    break;
                }
            }
        }
        if (targetCell) break;
    }

    // 第二優先：確定できるセル（候補が1つしかないセル）を探す
    if (!targetCell) {
        const tempBoard = userSolution.map(r => r.map(c => c.length === 1 ? parseInt(c) : 0));

        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentPuzzle[row][col] === 0 && userSolution[row][col] === '') {
                    // このセルに入る候補を探す
                    const candidates = [];
                    for (let num = 1; num <= 9; num++) {
                        if (isValidMove(tempBoard, row, col, num)) {
                            candidates.push(num);
                        }
                    }
                    // 候補が1つしかない場合
                    if (candidates.length === 1) {
                        targetCell = {row, col, reason: t('msg-hint-determined')};
                        break;
                    }
                }
            }
            if (targetCell) break;
        }
    }

    // 第三優先：ランダムに空のセルを選ぶ
    if (!targetCell) {
        const emptyCells = [];
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                if (currentPuzzle[row][col] === 0 && userSolution[row][col] === '') {
                    emptyCells.push({row, col});
                }
            }
        }

        if (emptyCells.length === 0) {
            document.getElementById('message').textContent = t('msg-all-filled');
            return;
        }

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        targetCell = {row: randomCell.row, col: randomCell.col, reason: t('msg-hint-random')};
    }

    // ヒントを表示
    const row = targetCell.row;
    const col = targetCell.col;

    const grid = document.getElementById('sudoku-grid');
    const cellIndex = row * 9 + col;
    const inputCell = grid.children[cellIndex];

    inputCell.value = currentSolution[row][col];
    inputCell.readOnly = true;
    inputCell.classList.remove('invalid');
    inputCell.classList.add('hint');
    userSolution[row][col] = String(currentSolution[row][col]);

    hintsRemaining--;
    updateHintInfo();
    const remaining = currentLanguage === 'ja'
        ? `${t('msg-hint-remaining')}${hintsRemaining}${t('msg-hint-times')}`
        : `${hintsRemaining} ${t('msg-hint-times')}`;
    document.getElementById('message').textContent = `${t('msg-hint-used')} (${targetCell.reason}) (${remaining})`;
}

function updateHintInfo() {
    const hintInfo = document.getElementById('hint-info');
    if (hintsEnabled) {
        const times = currentLanguage === 'ja' ? `${hintsRemaining}${t('msg-hint-times')}` : `${hintsRemaining} ${t('msg-hint-times')}`;
        hintInfo.textContent = `${t('game-hint')}: ${times}`;
    } else {
        hintInfo.textContent = `${t('game-hint')}: ${t('game-hint-disabled')}`;
        document.getElementById('hint-btn').disabled = true;
    }
}

// 答えを表示
function showSolution() {
    const confirmed = confirm('答えを表示しますか？(ゲームは終了します)');
    if (!confirmed) return;

    stopTimer();

    // 元のグリッドを非表示
    document.getElementById('sudoku-grid').classList.add('hidden');

    // 比較エリアを表示
    const comparisonArea = document.getElementById('solution-comparison');
    comparisonArea.classList.remove('hidden');

    // ユーザーの入力グリッドを作成
    createComparisonGrid('user-grid', userSolution, true);

    // 正解グリッドを作成
    createComparisonGrid('answer-grid', currentSolution, false);

    document.getElementById('message').textContent = '答えを表示しました';
}

// 比較用グリッドを作成
function createComparisonGrid(gridId, solution, showMarks) {
    const grid = document.getElementById(gridId);
    grid.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            // 3x3ボックスの境界線を太くする
            if (col % 3 === 0 && col !== 0) {
                cell.classList.add('border-left');
            }
            if (row % 3 === 0 && row !== 0) {
                cell.classList.add('border-top');
            }

            const value = solution[row][col];

            if (showMarks) {
                // ユーザー入力グリッド：正誤マーク付き
                if (currentPuzzle[row][col] !== 0) {
                    // 固定セル
                    cell.textContent = value || '';
                    cell.classList.add('fixed');
                } else if (value === '' || value.length === 0) {
                    // 空白
                    cell.textContent = '';
                    cell.classList.add('user-empty');
                } else if (value.length === 1 && parseInt(value) === currentSolution[row][col]) {
                    // 正解
                    cell.textContent = value + ' ○';
                    cell.classList.add('user-correct');
                } else {
                    // 不正解または候補メモ
                    cell.textContent = value + ' ×';
                    cell.classList.add('user-incorrect');
                    // 候補メモの場合はフォントサイズを小さく
                    if (value.length > 1) {
                        cell.style.fontSize = '0.8em';
                    }
                }
            } else {
                // 正解グリッド
                cell.textContent = value;
                if (currentPuzzle[row][col] !== 0) {
                    cell.classList.add('fixed');
                } else {
                    cell.classList.add('solution');
                }
            }

            grid.appendChild(cell);
        }
    }
}

// 答え合わせ
function checkSolution() {
    let allFilled = true;
    let isValidSolution = true;

    // ユーザーの解答を数値配列に変換
    const userBoard = Array(9).fill(null).map(() => Array(9).fill(0));

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const userValue = userSolution[row][col];
            if (userValue === '' || userValue.length === 0) {
                allFilled = false;
            } else if (userValue.length === 1) {
                userBoard[row][col] = parseInt(userValue);
            } else {
                // 候補メモが残っている場合は未完成
                allFilled = false;
            }
        }
    }

    const messageEl = document.getElementById('message');

    // すべてのマスが埋まっていない場合、確認ダイアログを表示
    if (!allFilled) {
        const confirmed = confirm(t('msg-confirm-answer'));
        if (!confirmed) {
            return;
        }
    }

    // 埋まっている場合、数独のルールを満たしているかチェック
    if (allFilled) {
        // 全行、全列、全3x3ボックスをチェック
        for (let i = 0; i < 9; i++) {
            // 行チェック
            const rowSet = new Set(userBoard[i]);
            if (rowSet.size !== 9 || rowSet.has(0)) {
                isValidSolution = false;
                break;
            }

            // 列チェック
            const colSet = new Set();
            for (let j = 0; j < 9; j++) {
                colSet.add(userBoard[j][i]);
            }
            if (colSet.size !== 9 || colSet.has(0)) {
                isValidSolution = false;
                break;
            }
        }

        // 3x3ボックスチェック
        if (isValidSolution) {
            for (let boxRow = 0; boxRow < 3; boxRow++) {
                for (let boxCol = 0; boxCol < 3; boxCol++) {
                    const boxSet = new Set();
                    for (let i = 0; i < 3; i++) {
                        for (let j = 0; j < 3; j++) {
                            boxSet.add(userBoard[boxRow * 3 + i][boxCol * 3 + j]);
                        }
                    }
                    if (boxSet.size !== 9 || boxSet.has(0)) {
                        isValidSolution = false;
                        break;
                    }
                }
                if (!isValidSolution) break;
            }
        }

        // 初期配置と矛盾していないかチェック
        if (isValidSolution) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (currentPuzzle[row][col] !== 0 && userBoard[row][col] !== currentPuzzle[row][col]) {
                        isValidSolution = false;
                        break;
                    }
                }
                if (!isValidSolution) break;
            }
        }
    }

    // 答え合わせ結果
    if (allFilled && isValidSolution) {
        stopTimer();
        messageEl.textContent = `${t('msg-correct')} (${t('msg-time')}: ${document.getElementById('time').textContent})`;
        messageEl.className = 'message-success';

        // すべてのセルを読み取り専用に
        const grid = document.getElementById('sudoku-grid');
        const cells = grid.querySelectorAll('input');
        cells.forEach(cell => {
            cell.readOnly = true;
            cell.classList.add('correct');
        });
    } else {
        // 間違いがある場合、比較表示を行う
        stopTimer();

        // 元のグリッドを非表示
        document.getElementById('sudoku-grid').classList.add('hidden');

        // 比較エリアを表示
        const comparisonArea = document.getElementById('solution-comparison');
        comparisonArea.classList.remove('hidden');

        // ユーザーの入力グリッドを作成（ユーザーの解答をそのまま表示）
        createComparisonGrid('user-grid', userSolution, true);

        // 正解グリッドを作成（生成された答えを表示）
        createComparisonGrid('answer-grid', currentSolution, false);

        messageEl.textContent = t('msg-incorrect');
        messageEl.className = 'message-error';
    }
}

// ゲームリセット
function resetGame() {
    const confirmed = confirm(t('msg-confirm-reset'));
    if (!confirmed) return;

    // userSolutionを文字列配列として再初期化
    userSolution = Array(9).fill(null).map(() => Array(9).fill(''));
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (currentPuzzle[row][col] !== 0) {
                userSolution[row][col] = String(currentPuzzle[row][col]);
            }
        }
    }

    editMode = {};

    resetGameUI();
    createGameGrid();

    // ヒントをリセット
    hintsRemaining = hintsEnabled ? parseInt(document.getElementById('hint-limit').value) : 0;
    updateHintInfo();

    // タイマーリセット
    stopTimer();
    startTimer();
}

// 手動入力グリッド作成
function createInputGrid() {
    const grid = document.getElementById('input-grid');
    grid.innerHTML = '';

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('input');
            cell.type = 'text';
            cell.maxLength = 1;
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;

            // 3x3ボックスの境界線を太くする
            if (col % 3 === 0 && col !== 0) {
                cell.classList.add('border-left');
            }
            if (row % 3 === 0 && row !== 0) {
                cell.classList.add('border-top');
            }

            cell.addEventListener('input', (e) => {
                let value = e.target.value;
                if (!/^[0-9]$/.test(value)) {
                    e.target.value = '';
                }
            });

            grid.appendChild(cell);
        }
    }
}

// 入力グリッドクリア
function clearInputGrid() {
    const cells = document.querySelectorAll('#input-grid input');
    cells.forEach(cell => {
        cell.value = '';
        cell.classList.remove('invalid');
    });
    document.getElementById('input-message').textContent = '';
}

// パズルを解く
function solvePuzzle() {
    const cells = document.querySelectorAll('#input-grid input');
    const inputBoard = Array(9).fill(0).map(() => Array(9).fill(0));

    // 入力を読み取る
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = cell.value ? parseInt(cell.value) : 0;
        inputBoard[row][col] = value;
    });

    // 入力バリデーション
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const num = inputBoard[row][col];
            if (num !== 0) {
                inputBoard[row][col] = 0; // 一時的に0にして重複チェック
                if (!isValidMove(inputBoard, row, col, num)) {
                    document.getElementById('input-message').textContent = t('msg-invalid-puzzle');
                    document.getElementById('input-message').className = 'message-error';
                    inputBoard[row][col] = num; // 元に戻す
                    return;
                }
                inputBoard[row][col] = num; // 元に戻す
            }
        }
    }

    // まずパズルを解く
    const solutionBoard = inputBoard.map(row => [...row]);
    if (solveSudoku(solutionBoard)) {
        // 解答を表示
        let index = 0;
        for (let row = 0; row < 9; row++) {
            for (let col = 0; col < 9; col++) {
                cells[index].value = solutionBoard[row][col];
                if (inputBoard[row][col] === 0) {
                    cells[index].classList.add('solution');
                }
                cells[index].readOnly = true;
                index++;
            }
        }

        // 解答表示後、難易度（仮置き深さ）を測定（最大6まで）
        document.getElementById('input-message').textContent = t('msg-solved') + ' (測定中...)';
        document.getElementById('input-message').className = 'message-success';

        // 少し遅延させてUIを更新
        setTimeout(() => {
            const depth = measureDifficulty(inputBoard, 6);
            let depthText = '';
            if (depth > 6) {
                depthText = ` (${t('msg-depth')}: 7${t('msg-depth-over')})`;
            } else {
                depthText = ` (${t('msg-depth')}: ${depth})`;
            }
            document.getElementById('input-message').textContent = t('msg-solved') + depthText;
        }, 10);
    } else {
        document.getElementById('input-message').textContent = t('msg-no-solution');
        document.getElementById('input-message').className = 'message-error';
    }
}
