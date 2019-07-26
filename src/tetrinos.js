const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
var colorSheet = [];

let lastTime = 0;
let gameState = 'start';
let game = new Game(GAME_WIDTH,GAME_HEIGHT);
let storage = window.localStorage;
let highScore = storage.getItem('highScore');
highScore = (highScore)?Number(highScore):0;

ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);
window.onload = function(){
    requestAnimationFrame(gameLoop);
}
function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
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