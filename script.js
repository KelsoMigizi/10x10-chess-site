// Simple 10x10 chess board script
// Replace this password with your own secret passphrase
const PASSWORD = 'friends';

const loginBtn = document.getElementById('loginBtn');
const passwordInput = document.getElementById('password');
const errorMsg = document.getElementById('error');
const loginContainer = document.getElementById('login');
const boardContainer = document.getElementById('chessboard');

loginBtn.addEventListener('click', () => {
    const entered = passwordInput.value.trim();
    if (entered === PASSWORD) {
        loginContainer.style.display = 'none';
        boardContainer.style.display = 'block';
        initBoard();
        initPieces();
    } else {
        errorMsg.textContent = 'Incorrect password. Please try again.';
    }
});

function initBoard() {
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

            square.addEventListener('click', function() {
                if (selectedPiece) {
                    this.textContent = selectedPiece;
                    clearPieceSelection();
                    selectedPiece = null;
                }
            });

            square.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                this.textContent = '';
            });

            board.appendChild(square);
        }
    }
}

let selectedPiece = null;

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

function clearPieceSelection() {
    document.querySelectorAll('.piece-btn').forEach(btn => btn.classList.remove('selected'));
}
