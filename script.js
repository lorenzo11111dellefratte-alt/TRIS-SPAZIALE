let board = ["","","","","","","","",""];
let turn = "X";
let score = {X:0, O:0, Draw:0};
let firstPlayer = "X";
let mode = "2players";
let difficulty = "easy";
let colorX = "#ff0000";
let colorO = "#00ff00";
let soundActive = true;
let robotLock = false; 
let defaultBackground = "radial-gradient(circle,#0a0a2a,#000)";

/* MENU */
function startGame(selectedMode){
  mode = selectedMode;
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("game").classList.remove("hidden");
  resetBoard();
}

function backToMenu(){  
  document.getElementById("robotMenu").classList.add("hidden");
  document.getElementById("settings").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function backToMenuFromGame(){
  document.getElementById("game").classList.add("hidden");
  document.getElementById("menu").classList.remove("hidden");
}

function showRobotMenu(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("robotMenu").classList.remove("hidden");
}

function startGameRobot(dif){
  difficulty = dif;
  startGame("robot");
}

function showSettings(){
  document.getElementById("menu").classList.add("hidden");
  document.getElementById("settings").classList.remove("hidden");
}

/* SETTINGS */
function saveSettings(){
  colorX = document.getElementById("colorX").value;
  colorO = document.getElementById("colorO").value;
  soundActive = document.getElementById("soundToggle").checked;
  backToMenu();
}

function applyBackgroundFile(){
  let file = document.getElementById("bgFile").files[0];
  if(file){
    let reader = new FileReader();
    reader.onload = (e)=>{
      document.body.style.backgroundImage = `url('${e.target.result}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
    };
    reader.readAsDataURL(file);
  }
}

function resetBackground(){
  document.body.style.background = defaultBackground;
  document.body.style.backgroundImage = "";
}

/* GAME */
function makeMove(index){
  if(robotLock) return;  
  if(board[index] !== "") return;

  placeSymbol(index, turn);

  if(checkEnd()) return;

  turn = (turn === "X") ? "O" : "X";
  updateTurnLabel();

  if(mode === "robot" && turn === "O"){
    robotLock = true;
    robotMove();
    robotLock = false;
  }
}

function placeSymbol(index, player){
  board[index] = player;
  let cell = document.querySelectorAll(".cell")[index];
  cell.textContent = player;
  cell.style.color = (player === "X") ? colorX : colorO;

  if(soundActive) document.getElementById("clickSound").play();
}

function robotMove(){
  let empty = board.map((v,i)=>v===""?i:null).filter(v=>v!==null);
  let move = empty[Math.floor(Math.random()*empty.length)];
  placeSymbol(move, "O");

  if(checkEnd()) return;

  turn = "X";
  updateTurnLabel();
}

function checkEnd(){
  if(checkWin(turn)){
    if(soundActive) document.getElementById("winSound").play();
    showPopup(`Ha vinto ${turn}!`);
    score[turn]++;
    updateScore();
    return true;
  }

  if(board.every(v => v !== "")){
    if(soundActive) document.getElementById("drawSound").play();
    showPopup("Pareggio!");
    score.Draw++;
    updateScore();
    return true;
  }
  return false;
}

function checkWin(p){
  const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  return wins.some(w => w.every(i => board[i] === p));
}

function updateTurnLabel(){
  document.getElementById("turn").textContent = `Turno: ${turn}`;
}

function updateScore(){
  document.getElementById("scoreX").textContent = score.X;
  document.getElementById("scoreO").textContent = score.O;
  document.getElementById("scoreDraw").textContent = score.Draw;
}

function resetBoard(){
  board = ["","","","","","","","",""];
  document.querySelectorAll(".cell").forEach(c => c.textContent = "");
  firstPlayer = (firstPlayer === "X") ? "O" : "X";
  turn = firstPlayer;
  updateTurnLabel();
}

/* POPUP */
function showPopup(msg){
  document.getElementById("popupText").textContent = msg;
  document.getElementById("popup").classList.remove("hidden");
}

function closePopup(){
  document.getElementById("popup").classList.add("hidden");
  resetBoard();
}
