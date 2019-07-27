class Menu{
    constructor(game){
        this.frame = {x: game.width/2, y: game.height/2, width: 0, height: 0, color: "rgba(0,25,25,0.69)"};
        this.startedUp = false;
        this.moveTimer =0;
        this.timerReset = 250;
        this.prevInput = input;
        this.textBlurb = {text: "Choose which colors to include:",
            color: "white",
            font: "20px roboto mono",
            draw: function(ctx){
                let marginTop = game.height*.125;
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                textWrap(ctx,this.text,game.width-game.gridSize*2).forEach((line)=>{
                    ctx.fillText(line, game.gridSize, marginTop);
                    marginTop+=28;
                });
            }
        }
        this.difficultyLabel = {
            text: "Starting speed:",
            color: "white",
            font: "20px roboto mono",
            draw: function(ctx){
                let marginTop = game.height*.5;
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                textWrap(ctx,this.text,game.width-game.gridSize*2).forEach((line)=>{
                    ctx.fillText(line, game.gridSize, marginTop);
                    marginTop+=28;
            });
        }
    }
        this.buttons = [
            [new ColorButton(game.width*0.15,game.height*0.21, "red",'red'),
            new ColorButton(game.width*0.55,game.height*0.21, "green",'green')],
            [new ColorButton(game.width*0.15,game.height*0.21+40, "blue",'blue'),
            new ColorButton(game.width*0.55,game.height*0.21+40, "cyan",'cyan')],
            [new ColorButton(game.width*0.15,game.height*0.21+80, "purple",'purple'),
            new ColorButton(game.width*0.55,game.height*0.21+80, "black",'black')],
        ];
        this.startButton = {
            width: game.width-(game.gridSize*2),
            height: 64,
            x: game.gridSize,
            y: game.height*0.75,
            hover: false,
            selected: false,
            draw(){
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x,this.y,this.width,this.height);
                ctx.fillStyle = "white";
                ctx.font = "32px roboto mono";
                ctx.fillText("Start Game", this.x+32, this.y+this.height/2+10);
                if(this.hover){
                    ctx.strokeStyle="gold";
                    ctx.lineWidth=5;
                    ctx.strokeRect(this.x,this.y,this.width,this.height);
                }
            }
        }
        this.objects=[...this.buttons, [this.startButton]];
        this.objects[0].hover = true;
        this.hoveringOver = {row: 0, col: -1};
    }
    startUp(){
        let out = true;
        let maxWidth = game.gridSize*(game.board[0].length-1.5);
        let maxHeight = game.gridSize*(game.board.length-1.5);
        if(this.frame.width<maxWidth){
            this.frame.width += maxWidth/8;
            this.frame.x -= maxWidth/16;
            out = false;
        }
        if(this.frame.height<maxHeight){
            this.frame.height += maxHeight/8;
            this.frame.y -= maxHeight/16;
            out = false;
        }
        if(out){
            this.startedUp = true;
            this.buttons[0][0].selected=true;
            this.buttons[0][1].selected=true;
            this.buttons[1][0].selected=true;
            canvas.addEventListener("click", game.menu.onClick);
        }
    }
    onClick(event){
        game.menu.objects.forEach(group=>{
            group.forEach(button=>{
                if(event.offsetX>=button.x
                &&event.offsetX<=button.x+button.width
                &&event.offsetY>=button.y
                &&event.offsetY<=button.y+button.height){
                    console.log(button);
                    if(button===game.menu.startButton){
                        console.log('test');
                        game.menu.startGame();
                        return;
                    }else{
                    button.selected = !button.selected;
                    }
                    return;
                }
            });
        });
    }
    enter(){
        let currentSelection = this.objects[this.hoveringOver.row][this.hoveringOver.col];
        if(currentSelection===this.startButton){
            this.startGame();
            return;
        }else{
        currentSelection.selected = !currentSelection.selected;
        }
    }
    startGame(){
        colorSheet = [];
            this.buttons.forEach((group)=>{
                group.forEach((button)=>{
                    if(button.selected){
                        colorSheet.push(button.color);
                    }
                });
            });
        if(colorSheet.length>=3){
            canvas.removeEventListener("click", game.menu.onClick);
            game.block = new Block(game);
            game.multiplier = colorSheet.length-2+((colorSheet.length-2)*0.5);
            delete game.menu;
            gameState = 'play';
        }else{
            alert("Please select at least 2 colors");
        }
    }
    update(deltaTime){
        if(!this.startedUp){
            this.startUp();
        }else{
            let currentSelection = this.objects[this.hoveringOver.row][this.hoveringOver.col];
            function checkCol(hoveringOver,objects){
                if(hoveringOver.col>=objects[hoveringOver.row].length){
                    hoveringOver.col = 0;
                }else if(hoveringOver.col<0){
                    hoveringOver.col = objects[hoveringOver.row].length-1;
                }
            }
            if(input.right&&!this.prevInput.right){
                this.hoveringOver.col+=1;
                checkCol(this.hoveringOver,this.objects);
            }else if(input.left&&!this.prevInput.left){
                this.hoveringOver.col -= 1;
                checkCol(this.hoveringOver,this.objects);
            }else if(input.down&&!this.prevInput.down){
                this.hoveringOver.row +=1;
                if(this.hoveringOver.row>=this.objects.length){
                    this.hoveringOver.row = 0;
                }
                checkCol(this.hoveringOver,this.objects);
            }else if(input.up&&!this.prevInput.up){
                this.hoveringOver.row -= 1;
                if(this.hoveringOver.row<0){
                    this.hoveringOver.row=this.objects.length-1;
                }
                checkCol(this.hoveringOver, this.objects);
            }
            if(this.hoveringOver.col>=0){
                try{
                currentSelection.hover = false;
                }catch{
                    this.hoveringOver.row=0;
                    this.hoveringOver.col=0;
                }finally{
                this.objects[this.hoveringOver.row][this.hoveringOver.col].hover = true;
                }
            }
                this.prevInput = {left: input.left, right: input.right, up: input.up, down: input.down}
        }
    }
    draw(ctx){
        ctx.fillStyle=this.frame.color;
        ctx.fillRect(this.frame.x,this.frame.y,this.frame.width,this.frame.height);
        if(this.startedUp){
            this.textBlurb.draw(ctx);
            //this.difficultyLabel.draw(ctx);
            this.objects.forEach((group)=>{
                group.forEach((button)=>{
                    button.draw(ctx);
                });
            });
        }
    }
}

class DifficultyButton{
    constructor(x, y, value){
        this.x = x;
        this.y = y;
        this.value = value;
        this.hover = false;
        this.selected = false;
    }
    draw(ctx){
        ctx.font = "20px roboto mono";
        ctx.fillStyle=""
       
    }
}

class ColorButton{
    constructor(x,y,color,text){
        this.x = x;
        this.y = y;
        this.color = color;
        this.text = text;
        this.font = "20px roboto mono";
        this.selected = false;
        this.hover = false;
        ctx.font = this.font;
        this.width = ctx.measureText(this.text).width+30;
        this.height = 28;
    }
    draw(ctx){
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        ctx.lineWidth = 3;
        ctx.strokeRect(this.x+4,this.y+4,20,20);
        if(this.selected){
            ctx.fillRect(this.x+4, this.y+4, 20, 20);
        }
        ctx.font = this.font;
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x+28, this.y+20);
        if(this.hover){
            ctx.strokeStyle = "gold"
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x,this.y,this.width,this.height);
        }
    }
}