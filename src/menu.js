class Menu{
    constructor(game){
        this.frame = {
          x: game.width/2,
          y: game.height/2,
          width: 0,
          height: 0,
          color: "rgba(0,25,25,0.8)",
        };
        this.startedUp = false;
        this.moveTimer = 0;
        this.timerReset = 250;
        this.prevInput = input;
        this.textBlurb = {
          text: "Choose which colors to include:",
            color: "white",
            draw: function(ctx){
                let marginTop = game.height*.125;
                ctx.fillStyle = this.color;
                ctx.font = canvas.width/18+"px roboto mono";
                textWrap(ctx,this.text,canvas.width-game.gridSize*2).forEach((line)=>{
                    ctx.fillText(line, game.gridSize, marginTop);
                    marginTop+=game.width/18+5;
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
            [new ColorButton(game.width*0.15,game.height*0.21+game.gridSize, "blue",'blue'),
            new ColorButton(game.width*0.55,game.height*0.21+game.gridSize, "cyan",'cyan')],
            [new ColorButton(game.width*0.15,game.height*0.21+game.gridSize*2, "purple",'purple'),
            new ColorButton(game.width*0.55,game.height*0.21+game.gridSize*2, "black",'black')]
        ];
        this.startButton = {
            width: canvas.width-(game.gridSize*2),
            height: game.gridSize*1.5,
            x: game.gridSize,
            y: game.height*0.75,
            hover: false,
            selected: false,
            draw(){
                ctx.fillStyle = "blue";
                ctx.fillRect(this.x,this.y,this.width,this.height);
                ctx.fillStyle = "white";
                ctx.font = game.gridSize*.75 + "px roboto mono";
                ctx.fillText("Start Game", (game.width/2)-(ctx.measureText("Start Game").width/2), this.y+this.height/2+10);
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
        let maxWidth = canvas.width-game.gridSize*1.2;
        let maxHeight = canvas.height-game.gridSize*1.2;
        if(this.frame.width<=maxWidth-(maxWidth/9)){
            this.frame.width += maxWidth/9;
            this.frame.x -= maxWidth/18;
            out = false;
        }else{
          this.frame.width = maxWidth;
          this.frame.x = (game.width - maxWidth)/2;
        }
        if(this.frame.height<=maxHeight-(maxHeight/9)){
            this.frame.height += maxHeight/9;
            this.frame.y -= maxHeight/18;
            out = false;
        }else{
          this.frame.height = maxHeight;
          this.frame.y = (game.height - maxHeight)/2;
        }
        if(out){
            this.startedUp = true;
            this.buttons[0][0].selected=true;
            this.buttons[0][1].selected=true;
            this.buttons[1][0].selected=true;
            canvas.addEventListener("click", game.menu.onClick);
            window.addEventListener("resize", game.menu.resize);
        }
    }
    resize(){
      game.menu.frame.width = canvas.width-game.gridSize*1.2;
      game.menu.frame.height = canvas.height-game.gridSize*1.2;
      game.menu.frame.x = (game.width - game.menu.frame.width)/2;
      game.menu.frame.y = (game.height - game.menu.frame.height)/2;
      game.menu.startButton.width = canvas.width-(game.gridSize*2);
      game.menu.startButton.height= game.gridSize*1.5;
      game.menu.startButton.x = game.gridSize;
      game.menu.startButton.y = game.height*0.75;

      let coords = [[0.15,0.21],[0.55,0.21],[0.15,0.21]];
      let i,j;
      j=0;
      for(i=0; j<game.menu.buttons.length;j++){
        game.menu.buttons[j].forEach(button=>{
          button.x=[coords[i][0]]*canvas.width;
          button.y=[coords[i][1]]*canvas.height+(game.gridSize*j);
          i++;
        });
      }

      game.menu.buttons
      [new ColorButton(game.width*0.15,game.height*0.21, "red",'red'),
      new ColorButton(game.width*0.55,game.height*0.21, "green",'green')],
      [new ColorButton(game.width*0.15,game.height*0.21+game.gridSize, "blue",'blue')]
    }
    onClick(event){
        game.menu.objects.forEach(group=>{
            group.forEach(button=>{
                if(event.offsetX>=button.x
                &&event.offsetX<=button.x+button.width
                &&event.offsetY>=button.y
                &&event.offsetY<=button.y+button.height){
                    if(button===game.menu.startButton){
                      game.menu.startGame();
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
        if(currentSelection===this.startButton||(this.hoveringOver.row===0&&this.hoveringOver.col===-1)){
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
            window.removeEventListener("resize", game.menu.resize)
            game.block = new Block(game);
            game.scoreKeeper.getBaseMultiplier();
            game.multiplier = colorSheet.length;
            delete game.menu;
            gameState = 'play';
            game.scoreKeeper.update();
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
            this.prevInput = {
                left: input.left,
                right: input.right,
                up: input.up,
                down: input.down}
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
        ctx.font = game.width/25 + "px roboto mono";
        ctx.fillStyle=""
       
    }
}

class ColorButton{
    constructor(x,y,color,text){
        this.x = x;
        this.y = y;
        this.color = color;
        this.associatedImage = new Image();
        this.associatedImage.src = `./assets/${color}Face.png`;
        this.text = text;
        this.font = canvas.width/20 + "px roboto mono";
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
        ctx.strokeRect(this.x,this.y,game.gridSize/2,game.gridSize/2);
        if(this.selected){
            ctx.fillRect(this.x, this.y, game.gridSize/2, game.gridSize/2);
        }
        ctx.font = canvas.width/18 + "px roboto mono";
        ctx.fillStyle = 'white';
        ctx.fillText(this.text, this.x+game.gridSize/2+8, this.y+game.gridSize/2-5);
        if(this.hover){
            ctx.strokeStyle = "gold"
            ctx.lineWidth = 5;
            ctx.strokeRect(this.x,this.y,ctx.measureText(this.text).width+30,this.height);
        }
    }
}