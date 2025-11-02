// グローバル変数
let currentPuzzle = [];
let currentSolution = [];
let userSolution = []; // 文字列配列として管理
let hintsEnabled = true;
let hintsRemaining = 3;
let timerInterval = null;
let seconds = 0;
let editMode = {}; // 編集モード管理 (key: "row-col", value: true/false)

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

    hintCheckbox.addEventListener('change', (e) => {
        if (e.target.checked) {
            hintLimitGroup.style.display = 'block';
        } else {
            hintLimitGroup.style.display = 'none';
        }
    });
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

// ゲーム開始
function startGame() {
    const difficulty = document.getElementById('difficulty').value;
    hintsEnabled = document.getElementById('hint-enabled').checked;
    hintsRemaining = hintsEnabled ? parseInt(document.getElementById('hint-limit').value) : 0;

    // パズル生成
    const completedBoard = generateCompleteSudoku();
    currentSolution = completedBoard.map(row => [...row]);
    currentPuzzle = createPuzzle(completedBoard, difficulty);

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

    // バリデーション（1文字の場合のみ）
    if (value.length === 1) {
        const numValue = parseInt(value);
        // 一時的に数値配列を作成してチェック
        const tempBoard = userSolution.map(r => r.map(c => c.length === 1 ? parseInt(c) : 0));
        if (!isValidMove(tempBoard, row, col, numValue)) {
            event.target.classList.add('invalid');
        } else {
            event.target.classList.remove('invalid');
        }
    } else {
        event.target.classList.remove('invalid');
    }
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
        document.getElementById('message').textContent = 'ヒントはもう使えません';
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
                    targetCell = {row, col, reason: '間違いを訂正'};
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
                        targetCell = {row, col, reason: '確定可能なマス'};
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
            document.getElementById('message').textContent = 'すべてのマスが埋まっています';
            return;
        }

        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        targetCell = {row: randomCell.row, col: randomCell.col, reason: 'ランダム'};
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
    document.getElementById('message').textContent = `ヒントを使用しました (${targetCell.reason}) (残り${hintsRemaining}回)`;
}

function updateHintInfo() {
    const hintInfo = document.getElementById('hint-info');
    if (hintsEnabled) {
        hintInfo.textContent = `ヒント: ${hintsRemaining}回`;
    } else {
        hintInfo.textContent = 'ヒント: 無効';
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
        const confirmed = confirm('すべてのマスが埋まっていませんが答え合わせしますか？');
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
        messageEl.textContent = `正解です！おめでとうございます！ (時間: ${document.getElementById('time').textContent})`;
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

        // 正解グリッドを作成（ユーザーの解答を表示）
        createComparisonGrid('answer-grid', userSolution, false);

        messageEl.textContent = '間違っている箇所があります。正誤を確認してください。';
        messageEl.className = 'message-error';
    }
}

// ゲームリセット
function resetGame() {
    const confirmed = confirm('ゲームをリセットしますか？');
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
                    document.getElementById('input-message').textContent = '無効な数独パズルです。入力を確認してください。';
                    document.getElementById('input-message').className = 'message-error';
                    inputBoard[row][col] = num; // 元に戻す
                    return;
                }
                inputBoard[row][col] = num; // 元に戻す
            }
        }
    }

    // パズルを解く
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
        document.getElementById('input-message').textContent = '解答を表示しました！';
        document.getElementById('input-message').className = 'message-success';
    } else {
        document.getElementById('input-message').textContent = 'この数独パズルは解けません';
        document.getElementById('input-message').className = 'message-error';
    }
}
