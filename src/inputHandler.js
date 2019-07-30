var input = {
    left: false,
    right: false,
    up: false,
    down: false,
    enter: false,
    rotateLeft: false,
    rotateRight: false,
    upPressed: false,
    lastPressed: undefined,
    keyDown: function(e){
        keycode = e.code;
        switch(keycode){
            case "ArrowRight":
            case "KeyD":
                input.right=true;
                input.lastPressed='right';
                e.preventDefault();
                break;
            case "ArrowLeft":
            case "KeyA":
                input.left=true;
                input.lastPressed='left';
                e.preventDefault();
                break;
            case "ArrowDown":
            case "KeyS":
                input.down = true;
                e.preventDefault();
                break;
            case "KeyW":
                if(gameState==='start'){
                    input.up=true;
                }
                break;
            case "ArrowUp":
                if(gameState === 'play'&&!this.upPressed){
                    game.block.rotateLeft();
                    this.upPressed = true;
                }
                    input.up=true;
                    e.preventDefault();
                break;
            default:
                break;
        }
    },
    keyUp: function(e){
        keycode = e.code;
        switch(keycode){
            case "ArrowRight":
            case "KeyD":
                input.right=false;
                input.lastPressed='left';
                break;
            case "ArrowLeft":
            case "KeyA":
                input.left=false;
                input.lastPressed='right';
                break;
            case "ArrowDown":
            case "KeyS":
                input.down = false;
                break;
            case "ArrowUp":
                if(gameState === 'play'){
                    this.upPressed = false;
                }else if(gameState==='start'){
                    input.up=false;
                }
                break;
            default:
                break;
        }
    },
    keyPress: function(e){
        keycode = e.code;
        switch(keycode){
            case "KeyZ":
            case "KeyW":
            case "Comma":
                if(gameState==='play'){
                    game.block.rotateLeft();
                }
                break;
            case "KeyX":
            case "Period":
                if(gameState==='play'){
                    game.block.rotateRight();
                }
                break;
            case "Enter":
            case "Space":
                if(gameState==='start'){
                    game.menu.enter();
                    e.preventDefault();
                    break;
                }
            case "Escape":
                if(gameState==="play"||gameState==="scoring"){
                    saveState = gameState;
                    gameState = "pause";
                }else if(gameState==="pause"){
                    gameState = saveState;
                }
                e.preventDefault();
                break;
            default:
                break;
        }
    }
}


document.addEventListener("keypress", input.keyPress);
document.addEventListener("keydown", input.keyDown);
document.addEventListener("keyup", input.keyUp);