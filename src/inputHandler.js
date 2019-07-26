var input = {
    left: false,
    right: false,
    up: false,
    down: false,
    enter: false,
    rotateLeft: false,
    rotateRight: false,
    lastPressed: undefined,
    keyDown: function(keycode){
        switch(keycode){
            case "ArrowRight":
            case "KeyD":
                input.right=true;
                input.lastPressed='right';
                break;
            case "ArrowLeft":
            case "KeyA":
                input.left=true;
                input.lastPressed='left';
                break;
            case "ArrowDown":
            case "KeyS":
                input.down = true;
                break;
            case "ArrowUp":
            case "KeyW":
                if(gameState==='start'){
                    input.up=true;
                }
                break;
            default:
                break;
        }
    },
    keyUp: function(keycode){
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
                    game.block.rotateLeft();
                }else if(gameState==='start'){
                    input.up=false;
                }
                break;
            default:
                break;
        }
    },
    keyPress: function(keycode){
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
                }
            default:
                break;
        }
    }
}

document.addEventListener("keydown", event=>{
    input.keyDown(event.code);
});
document.addEventListener("keyup", event=>{
    input.keyUp(event.code);
});
document.addEventListener("keypress", event=>{
    input.keyPress(event.code);
});