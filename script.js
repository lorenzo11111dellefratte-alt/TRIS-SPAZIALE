let board = ["","","","","","","","",""];
let turn = "X";
let score = {X:0, O:0, Draw:0};
let firstPlayer = "X";
let mode = "2players";
let difficulty = "easy";
let colorX = "#ff0000";
let colorO = "#00ff00";
let soundActive = true;

function startGame(selectedMode){
  mode = selectedMode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  resetBoard();
}

function showRobotMenu(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("robotMenu").classList.remove("hidden");
}

function backToMenu(){
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function startGameRobot(selectedDifficulty){
  difficulty = selectedDifficulty;
  startGame("robot");
}

function showSettings(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

function saveSettings(){
  colorX = document.getElementById("colorX").value;
  colorO = document.getElementById("colorO").value;
  soundActive = document.getElementById("soundToggle").checked;
  backToMenu();
}

function applyBackground(){
  const file = document.getElementById("bgFile").files[0];
  if(file){
    const reader = new FileReader();
    reader.onload = function(e){
      document.body.style.backgroundImage = `url(${e.target.result})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    }
    reader.readAsDataURL(file);
  }
}

function defaultBackground(){
  document.body.style.background = "radial-gradient(circle, #0a0a2a, #000)";
  document.body.style.backgroundSize = "auto";
}

function makeMove(index){
  if(board[index] === "" && !(mode==="robot" && turn==="O")){
    board[index] = turn;
    const cell = document.querySelectorAll(".cell")[index];
    cell.textContent = turn;
    cell.style.color = (turn==="X")?colorX:colorO;
    if(soundActive) document.getElementById("clickSound").play();

    if(checkWin()){
      if(soundActive) document.getElementById("winSound").play();
      alert(`Ha vinto ${turn}!`);
      score[turn]++;
      updateScore();
      resetBoard();
      return;
    }

    if(board.every(c=>c!=="")){
      if(soundActive) document.getElementById("drawSound").play();
      alert("Pareggio!");
      score.Draw++;
      updateScore();
      resetBoard();
      return;
    }

    turn = (turn==="X")?"O":"X";
    document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;

    if(mode==="robot" && turn==="O"){
      setTimeout(robotMove, 200); // immediato
    }
  }
}

function robotMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move;
  if(difficulty==="easy"){
    move = empty[Math.floor(Math.random()*empty.length)];
  } else if(difficulty==="medium"){
    move = mediumAIMove();
  } else {
    move = hardAIMove();
  }
  makeMove(move);
}

function mediumAIMove(){
  for(let i=0;i<9;i++){
    if(board[i]===""){
      board[i]="O";
      if(checkWin()){board[i]=""; return i;}
      board[i]="X";
      if(checkWin()){board[i]=""; return i;}
      board[i]="";
    }
  }
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  return empty[Math.floor(Math.random()*empty.length)];
}

function hardAIMove(){
  return mediumAIMove();
}

function checkWin(){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(pattern=>pattern.every(i=>board[i]===turn));
}

function updateScore(){
  document.getElementById("scoreX").textContent = score.X;
  document.getElementById("scoreO").textContent = score.O;
  document.getElementById("scoreDraw").textContent = score.Draw;
}

function resetBoard(){
  board=["","","","","","","","",""];
  document.querySelectorAll(".cell").forEach(c=>c.textContent="");
  firstPlayer = (firstPlayer==="X")?"O":"X";
  turn = firstPlayer;
  document.getElementById("turn").textContent = `Turno: Giocatore ${turn}`;
}

function resetScores(){
  score={X:0,O:0,Draw:0};
  updateScore();
}

