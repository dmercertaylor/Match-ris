/*** CANVAS GLOBALS ***/
const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");
setCanvasSize();  // Ensures canvas loads to the right size

ctx.clearRect(0,0,canvas.width,canvas.height); // blank canvas
window.onload = function(){
    window.addEventListener("resize", onResize); // keep aspect ratio correct on resize
    requestAnimationFrame(gameLoop);
}

/*** GAME GLOBALS ***/
let colorSheet = [];    // filled in with user selected color values
let lastTime = 0;         // Timestamp at previous frame, used to calculate deltaTime
let gameState = 'start';  // current game state
let saveState = "";       // Previous game state if user pauses the game

let game = new Game(canvas.width,canvas.height);

let storage = window.localStorage;
let highScore = storage.getItem('highScore'); // Store highscore in local storage
highScore = (highScore)?Number(highScore):0;

/*** GAME LOOP ***/
function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

/*** CANVAS SIZE FUNCTIONS ***/
// Set's canvas size based on window height, correct aspect ratio
function setCanvasSize(){
  canvas.height = window.innerHeight*0.85;
  canvas.width = canvas.height*(2/3);
  if(canvas.width>window.innerWidth){
    canvas.width = window.innerWidth;
  }
  if(canvas.width<320){
    canvas.width=320;
  }
  if(canvas.width>640){
    canvas.width=640;
  }
  canvas.height = canvas.width*1.5;
}

// called on window resize, keeps game variables in line with
// canvas size
function onResize(){
  setCanvasSize();
  game.width = canvas.width;
  game.height = canvas.height;
  game.gridSize = game.width/10;
}

// Helper function called elsewhere, wraps text on canvas.
function textWrap(ctx, text, maxWidth){
    let words = text.split(" ");
    let lines = [];
    let currentLine = '';

    words.forEach((word, i)=>{
        let width = ctx.measureText(currentLine + " " + word).width;
        if(width<maxWidth){
            currentLine += (i>0)?" " + word:word;
        } else{
            lines.push(currentLine);
            currentLine = word;
        }
    });
    lines.push(currentLine);
    return lines;
}