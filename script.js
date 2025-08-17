/*
 * Multi‑game 10x10 chess board
 *
 * This script no longer uses a single hard‑coded password. Instead, any
 * non‑empty passphrase entered by the user will load a unique game state
 * stored in the browser's localStorage. Each game is keyed by its
 * passphrase (e.g. "password123"). Returning to the same passphrase will
 * resume the previous board; entering a new passphrase will start a fresh
 * board. All boards are saved after every move.
 */

const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error');
const loginContainer = document.getElementById('login');
const boardContainer = document.getElementById('chessboard');

// Track the currently active passphrase and board state
let currentPassword = null;
let boardState = [];
let selectedPiece = null;

// Listen for login attempts. Any non‑empty password is accepted. An empty
// password shows an error.
loginBtn.addEventListener('click', () => {
    const entered = passwordInput.value.trim();
    if (!entered) {
        errorMsg.textContent = 'Please enter a password.';
        return;
    }
    errorMsg.textContent = '';
    currentPassword = entered;
    // Hide login UI and show the chessboard
    loginContainer.style.display = 'none';
    boardContainer.style.display = 'block';
    initPieces();
    loadGame();
});

// Initialize an empty 10x10 board state
function initBoardState() {
    boardState = [];
    for (let row = 0; row < 10; row++) {
        const rowArray = [];
        for (let col = 0; col < 10; col++) {
            rowArray.push('');
        }
        boardState.push(rowArray);
    }
}

// Render the board based on the current boardState
function renderBoard() {
    const board = document.querySelector('.board');
    board.innerHTML = '';
    for (let row = 0; row < 10; row++) {
        for (let col = 0; col < 10; col++) {
            const square = document.createElement('div');
            square.classList.add('square');
            if ((row + col) % 2 === 0) {
                square.classList.add('light');
            } else {
                square.classList.add('dark');
            }
            square.dataset.row = row;
            square.dataset.col = col;

            // Populate the square with the current piece, if any
            square.textContent = boardState[row][col] || '';

            // Handle placing a piece on click
            square.addEventListener('click', function() {
                if (selectedPiece) {
                    boardState[row][col] = selectedPiece;
                    square.textContent = selectedPiece;
                    saveGame();
                    clearPieceSelection();
                    selectedPiece = null;
                }
            });

            // Handle removing a piece via right‑click
            square.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                boardState[row][col] = '';
                square.textContent = '';
                saveGame();
            });

            board.appendChild(square);
        }
    }
}

// Load the game for the current passphrase. If a saved state exists in
// localStorage, use it; otherwise start a new blank board.
function loadGame() {
    const saved = localStorage.getItem('chessGame_' + currentPassword);
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Validate that parsed is a 10x10 array
            if (Array.isArray(parsed) && parsed.length === 10) {
                boardState = parsed;
            } else {
                initBoardState();
            }
        } catch (e) {
            initBoardState();
        }
    } else {
        initBoardState();
    }
    renderBoard();
}

// Save the current board state to localStorage keyed by the passphrase
function saveGame() {
    if (currentPassword) {
        localStorage.setItem('chessGame_' + currentPassword, JSON.stringify(boardState));
    }
}

// Initialize the piece palette. Selecting a piece sets selectedPiece. Only
// call this after login.
function initPieces() {
    const palette = document.getElementById('pieces');
    palette.innerHTML = '';
    const pieces = [
        { code: 'P', name: 'Pawn' },
        { code: 'R', name: 'Rook' },
        { code: 'N', name: 'Knight' },
        { code: 'B', name: 'Bishop' },
        { code: 'Q', name: 'Queen' },
        { code: 'K', name: 'King' },
        { code: 'C', name: 'Cardinal' }, // Example piece for 10x10 variants
        { code: 'M', name: 'Marshall' }  // Example piece for 10x10 variants
    ];
    pieces.forEach(piece => {
        const btn = document.createElement('button');
        btn.textContent = piece.code;
        btn.title = piece.name;
        btn.classList.add('piece-btn');
        btn.addEventListener('click', function() {
            selectedPiece = piece.code;
            clearPieceSelection();
            btn.classList.add('selected');
        });
        palette.appendChild(btn);
    });
}

// Clear the selection highlight on all piece buttons
function clearPieceSelection() {
    document.querySelectorAll('.piece-btn').forEach(btn => btn.classList.remove('selected'));
}
