const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

var colorSheet = [];
let gridOpacity = 0.2;

//Add opacity values when using
let gridColorSheet=["rgba(0,255,255,","rgba(100,255,125,","rgba(200,255,50,","rgba(255,255,0,","rgba(255,100,100,","rgba(255,50,200,","rgba(150,0,255,","rgba(50,150,255,"];
let gridColorIndex=0;
let faceInvert = 0;
let saveState = "";
let lastTime = 0;
let gameState = 'start';
setCanvasSize();
let game = new Game(canvas.width,canvas.height);
let storage = window.localStorage;
let highScore = storage.getItem('highScore');
highScore = (highScore)?Number(highScore):0;

ctx.clearRect(0,0,canvas.width,canvas.height);
window.onload = function(){
    window.addEventListener("resize", onResize);
    requestAnimationFrame(gameLoop);
}
function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

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

function onResize(){
  setCanvasSize();
  game.width = canvas.width;
  game.height = canvas.height;
  game.gridSize = game.width/10;
}

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