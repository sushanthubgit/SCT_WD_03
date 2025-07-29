const board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let vsComputer = false;

const winningCombinations = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeRadios = document.querySelectorAll('input[name="mode"]');

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (!gameActive || board[index] !== null) return;

  makeMove(index, currentPlayer);
  if (checkWin(currentPlayer)) {
    statusDisplay.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
    disableBoard();
    return;
  }
  if (checkDraw()) {
    statusDisplay.textContent = "It's a draw!";
    gameActive = false;
    return;
  }
  switchPlayer();

  if (vsComputer && currentPlayer === 'O' && gameActive) {
    computerMove();
  }
}

function makeMove(index, player) {
  board[index] = player;
  cells[index].textContent = player;
  cells[index].classList.add('disabled');
}

function switchPlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
  return winningCombinations.some(combination => {
    return combination.every(index => board[index] === player);
  });
}

function checkDraw() {
  return board.every(cell => cell !== null);
}

function disableBoard() {
  cells.forEach(cell => cell.classList.add('disabled'));
}

function resetGame() {
  for (let i = 0; i < board.length; i++) {
    board[i] = null;
  }
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled');
  });
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
}

function computerMove() {
  // Simple AI: pick a random empty cell
  let emptyIndices = board.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
  if (emptyIndices.length === 0) return;

  // For better UX, add a slight delay
  setTimeout(() => {
    let choice = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    makeMove(choice, currentPlayer);
    if (checkWin(currentPlayer)) {
      statusDisplay.textContent = `Player ${currentPlayer} wins!`;
      gameActive = false;
      disableBoard();
      return;
    }
    if (checkDraw()) {
      statusDisplay.textContent = "It's a draw!";
      gameActive = false;
      return;
    }
    switchPlayer();
  }, 500);
}

function handleModeChange() {
  vsComputer = document.querySelector('input[name="mode"]:checked').value === 'pvc';
  resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
modeRadios.forEach(radio => radio.addEventListener('change', handleModeChange));

statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
