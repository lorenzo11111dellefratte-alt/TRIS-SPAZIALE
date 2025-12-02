const cells = document.querySelectorAll('.cell');
const message = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');

const clickSound = document.getElementById('clickSound');
const winSound = document.getElementById('winSound');
const drawSound = document.getElementById('drawSound');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let scores = { X: 0, O: 0 };
let gameActive = true;

const winningCombinations = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if(board[index] !== '' || !gameActive) return;

  board[index] = currentPlayer;
  e.target.classList.add(currentPlayer);
  e.target.textContent = currentPlayer;
  clickSound.play();

  checkResult();
}

function checkResult() {
  let roundWon = false;
  for(const combo of winningCombinations){
    const [a,b,c] = combo;
    if(board[a] && board[a] === board[b] && board[a] === board[c]){
      roundWon = true;
      combo.forEach(i => cells[i].classList.add('winner'));
      break;
    }
  }

  if(roundWon){
    message.textContent = `🎉 Giocatore ${currentPlayer} ha vinto!`;
    scores[currentPlayer]++;
    updateScore();
    winSound.play();
    gameActive = false;
    return;
  }

  if(!board.includes('')){
    message.textContent = "Pareggio! Che sfida epica!";
    drawSound.play();
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  message.textContent = `Turno di ${currentPlayer}`;
}

function updateScore(){
  scoreX.textContent = `X: ${scores.X}`;
  scoreO.textContent = `O: ${scores.O}`;
}

function restartGame(){
  board = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  message.textContent = `Turno di ${currentPlayer}`;
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('X','O','winner');
  });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
