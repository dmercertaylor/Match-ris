let canvas = document.getElementById("gameScreen");
let ctx = canvas.getContext("2d");

const GAME_WIDTH = canvas.width;
const GAME_HEIGHT = canvas.height;
const colorSheet = ["red","blue","green"];

let lastTime = 0;
let game = new Game(GAME_WIDTH,GAME_HEIGHT);

ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

function gameLoop(timestamp){
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    ctx.clearRect(0,0,GAME_WIDTH,GAME_HEIGHT);

    game.update(deltaTime);
    game.draw(ctx);
    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);