class Game{
    constructor(gameWidth, gameHeight){
        gameState = 'start';
        this.width = gameWidth;
        this.height = gameHeight;
        this.gridSize = gameWidth/10;
        this.board=[];
        this.markedForDeletion = [];
        this.lineHeight = this.height/this.gridSize;
        this.score = 0;
        this.fallTime = 900;
        this.levelTicker = 15;
        this.scoreAnimationTimer=0;
        this.scoreAnimationTimeLength=150;
        this.doneFalling = true;
        this.doneScoring = false;
        for(let i=0;i<this.height/this.gridSize;i++){
            this.board.push([]);
            for(let z=0;z<this.width/this.gridSize;z++){
                this.board[i].push(-1);
            }
        }
        this.menu = new Menu(this);
        this.scoreKeeper = new Scorekeeper(this);
        this.block;
    }
    update(deltaTime){
        if(gameState === 'start'){
            this.menu.update(deltaTime);
            this.menu.draw(ctx);
        }
        else if(gameState === 'play'){
            this.clearBlock();
            this.block.update(deltaTime);
            this.drawBlock();
            this.scoreKeeper.update(deltaTime);
            if(!this.block.falling){
                this.setLineHeight();
                this.checkLoss();
                if(gameState==='loss'){
                    game = new Game(GAME_WIDTH,GAME_HEIGHT);
                    return;
                }
                this.levelTicker--;
                if(this.levelTicker<=0){
                    this.fallTime = this.fallTime * 0.81;
                    this.levelTicker = 15;
                }
                this.block = new Block(this);
                if(this.checkScore()!==false){
                    gameState = 'scoring';
                };
            }
        }
        else if(gameState === 'scoring'){
            this.scoreAnimationTimer += deltaTime;
            function fall(){
                game.doneFalling = true;
                for(let y=game.board.length-2;y>=game.lineHeight;y--){
                    for(let x=0; x<game.board[y].length;x++){
                        if(game.board[y][x]!==-1){
                            if(game.board[y+1][x]===-1){
                                game.board[y+1][x] = game.board[y][x];
                                game.board[y][x] = -1;
                                game.doneFalling = false;
                            }
                        }
                    }
                }
                if(!game.doneFalling){
                    return false;
                }if(game.doneFalling){
                    return true;
                }
            }
            if(this.scoreAnimationTimer>=this.scoreAnimationTimeLength){
                this.scoreAnimationTimer = 0;
                if(this.checkScore()&&!this.doneScoring){
                    let lines = this.checkScore();
                    game.scoreKeeper.addScore(lines);
                    for(let z=0;z<lines.length;z++){
                        let scoreLine = lines[z];
                        for(let i=0;i<scoreLine.length;i++){
                            if(scoreLine.direction === 'down'){
                                game.board[scoreLine.y+i][scoreLine.x] = -2;
                                game.markedForDeletion.push({x: scoreLine.x, y: scoreLine.y+i});
                            }
                            if(scoreLine.direction === 'right'){
                                game.board[scoreLine.y][scoreLine.x+i] = -2;
                                game.markedForDeletion.push({x: scoreLine.x+i, y: scoreLine.y});
                            }
                        }
                    }
                }else{
                    this.doneScoring = true;
                }
                if(this.doneScoring){
                    for(let i=0; i<this.markedForDeletion.length;i++){
                        let object = this.markedForDeletion[i];
                        game.board[object.y][object.x] = -1;
                    }
                    this.markedForDeletion = [];
                    fall();
                    if(this.doneFalling){
                        if(this.checkScore()){
                            this.doneFalling = true;
                            this.doneScoring = false;
                        }else{
                        gameState = 'play';
                        game.scoreKeeper.endTurn();
                        this.doneFalling = true;
                        this.doneScoring = false;
                        this.setLineHeight();
                        }
                    }
                }
            }
            this.scoreKeeper.update(deltaTime);
        }
    }
    clearBlock(){
        this.block.bricks.forEach(function(brick){
            game.board[brick.coord.y][brick.coord.x] = -1;
        });
    }
    drawBlock(){
        this.block.bricks.forEach(function(brick){
            game.board[brick.coord.y][brick.coord.x] = brick.color;
        });
    }
    checkScore(){
        let output = [];
        function findMatch(x,y){
            let rightChain = 1;
            let downChain = 1;
            function matchRight(x,y){
                if(game.board[y][x]===game.board[y][x+1]){
                    rightChain += 1;
                    matchRight(x+1,y);
                }else{
                    return rightChain;
                }
            }
            function matchDown(x,y){
                if(game.board.length>(y+1)&&game.board[y][x]===game.board[y+1][x]){
                    downChain += 1;
                    matchDown(x,y+1);
                }else{
                    return downChain;
                }
            }
            matchRight(x,y);
            matchDown(x,y);
            return [rightChain, downChain];
        }
        for(let y=game.lineHeight;y<game.board.length;y++){
            for(let x=0;x<game.board[y].length;x++){
                if(game.board[y][x]>-1){
                    let matches = findMatch(x,y);
                    if(matches[0]>=3){
                        output.push({x: x, y: y, direction: 'right', length: matches[0]});
                    }
                    if(matches[1]>=3){
                        output.push({x: x, y: y, direction: 'down', length: matches[1]});
                    }
                }
            }
        }
        if(output.length>0){
            output = output.filter((line,index)=>{
                if(index === 0){
                    return true;
                }else{
                    let testLine = output[index-1];
                    if((testLine.length===line.length+1&&
                        testLine.direction===line.direction)&&(
                        (testLine.x===line.x-1&&testLine.y===line.y)||
                        (testLine.y===line.y-1&&testLine.x===line.x
                        ))){
                            return false;
                        }else{
                            return true;
                        }
                }
            });
            return output;
        }else{
            return false;
        }
    }
    checkLoss(){
        if(this.lineHeight===0){
            if(this.scoreKeeper.score>highScore){
                highScore = this.scoreKeeper.score;
                storage.setItem('highScore', String(highScore));
                return true;
            }
            gameState = "loss";
            alert("Your score: "+this.scoreKeeper.score+"\nHigh score: "+highScore);
        }
    }
    setLineHeight(){
        for(let y=0;y<this.board.length;y++){
            let breakout=false;
            for(let x=0;x<this.board[y].length;x++){
                if(this.board[y][x]!==-1){
                    this.lineHeight = y;
                    breakout = true;
                    break;
                }
            }
            if(breakout){
                break;
            }
        }
    }
    draw(ctx){
        for(let row=0;row<this.board.length;row++){
            for(let col=0;col<this.board[row].length;col++){
                if(this.board[row][col]!==-1){
                    if(this.board[row][col]===-2){
                        ctx.fillStyle = "gold";
                    } else{
                    ctx.fillStyle = colorSheet[this.board[row][col]];
                    }
                    ctx.fillRect(col*this.gridSize,row*this.gridSize,this.gridSize,this.gridSize);
                }
            }
        }
        this.scoreKeeper.draw(ctx);
        if(gameState==='pause'){
            ctx.fillStyle = "rgba(25,0,10,0.2)";
            ctx.fillRect(0,0,game.width,game.height);
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.font = "bold 24px roboto mono";
            ctx.fillText("Paused",this.width/2-ctx.measureText("Paused").width/2, this.height/2);
        }
    }
}