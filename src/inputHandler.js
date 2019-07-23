var input = {
    left: false,
    right: false,
    up: false,
    down: false,
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
                game.block.rotateLeft();
            default:
                break;
        }
    },
    keyPress: function(keycode){
        switch(keycode){
            case "KeyZ":
            case "KeyW":
                game.block.rotateLeft();
                break;
            case "KeyX":
                game.block.rotateRight();
                break;
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