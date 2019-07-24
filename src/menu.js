class Menu{
    constructor(game){
        this.frame = {x: game.width/2, y: game.height/2, width: 0, height: 0, color: "rgba(0,25,25,0.69)"};
        this.startedUp = false;
        this.hoveringOver = 0;
        this.moveTimer =0;
        this.timerReset = 250;
        this.prevInput = input;
        this.textBlurb = {text: "Choose which colors to include:",
            color: "white",
            font: "20px roboto mono",
            draw: function(ctx){
                let marginTop = game.height*.15;
                ctx.fillStyle = this.color;
                ctx.font = this.font;
                textWrap(ctx,this.text,game.width-game.gridSize*2).forEach((line)=>{
                    ctx.fillText(line, game.gridSize, marginTop);
                    marginTop+=28;
                });
            }
        }
        this.buttons = [
            new ColorButton(game.width*0.15,game.height*0.25, "red",'red'),
            new ColorButton(game.width*0.55,game.height*0.25, "green",'green'),
            new ColorButton(game.width*0.15,game.height*0.25+40, "blue",'blue'),
            new ColorButton(game.width*0.55,game.height*0.25+40, "cyan",'cyan'),
            new ColorButton(game.width*0.15,game.height*0.25+80, "purple",'purple'),
            new ColorButton(game.width*0.55,game.height*0.25+80, "black",'black'),
        ];
        this.startButton = {
            width: game.width-game.gridSize*2,
            height: 64,
            x: game.gridSize,
            y: game.height*0.67,
            hover: false,
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
        this.objects=[...this.buttons, this.startButton];
        this.objects[0].hover = true;
    }
    startUp(){
        let out = true;
        let maxWidth = game.gridSize*(game.board[0].length-1.5);
        let maxHeight = game.gridSize*(game.board.length-1.5);
        if(this.frame.width<maxWidth){
            this.frame.width += maxWidth/8;
            this.frame.x -= maxWidth/16;
            console.log(this.frame.width + ' '+maxWidth);
            out = false;
        }
        if(this.frame.height<maxHeight){
            this.frame.height += maxHeight/8;
            this.frame.y -= maxHeight/16;
            out = false;
        }
        if(out){
            this.startedUp = true;
            for(let i=0;i<3;i++){
                this.buttons[i].selected=true;
            }
        }
    }
    enter(){
        if(this.objects[this.hoveringOver]===this.startButton){
            colorSheet = [];
            this.buttons.forEach((button)=>{
                if(button.selected){
                    colorSheet.push(button.color);
                }
            });
            if(colorSheet.length>=3){
                game.block = new Block(game);
                game.multiplier = colorSheet.length/3
                gameState = 'play';
            }else{
                alert("Please select at least 2 colors");
            }
            return;
        }
        this.objects[this.hoveringOver].selected = !this.objects[this.hoveringOver].selected;
    }
    update(deltaTime){
        if(!this.startedUp){
            this.startUp();
        }else{
            if(input.right&&!this.prevInput.right){
                this.objects[this.hoveringOver].hover=false;
                this.hoveringOver = (this.hoveringOver+1===this.objects.length)?this.hoveringOver:this.hoveringOver+1;
                this.objects[this.hoveringOver].hover=true;
            }else if(input.left&&!this.prevInput.left){
                this.objects[this.hoveringOver].hover=false;
                this.hoveringOver = (this.hoveringOver-1<0)?this.hoveringOver:this.hoveringOver-1;
                this.objects[this.hoveringOver].hover=true;
            }else if(input.up&&!this.prevInput.up){
                this.objects[this.hoveringOver].hover=false;
                this.hoveringOver = (this.hoveringOver-2<0)?0:this.hoveringOver-2;
                this.objects[this.hoveringOver].hover=true;
            }else if(input.down&&!this.prevInput.down){
                this.objects[this.hoveringOver].hover=false;
                this.hoveringOver = (this.hoveringOver+2>=this.objects.length)?this.objects.length-1:this.hoveringOver+2;
                this.objects[this.hoveringOver].hover=true;
            }
        this.prevInput = {left: input.left, right: input.right, up: input.up, down: input.down}
        }
    }
    draw(ctx){
        ctx.fillStyle=this.frame.color;
        ctx.fillRect(this.frame.x,this.frame.y,this.frame.width,this.frame.height);
        if(this.startedUp){
            this.textBlurb.draw(ctx);
            this.objects.forEach((button)=>{
                button.draw(ctx);
            });
        }
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
    }
    update(){

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
            ctx.strokeRect(this.x,this.y,ctx.measureText(this.text).width+30, 28)
        }
    }
}