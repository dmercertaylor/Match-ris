let gameState = 'play';

class Game{
    constructor(gameWidth, gameHeight){
        this.width = gameWidth;
        this.height = gameHeight;
        this.gridSize = gameWidth/10;
        this.board=[];
        this.lineHeight = this.height/this.gridSize;
        this.score = 0;
        this.scoreAnimationTimer=0;
        this.scoreAnimationTimeLength=200;
        for(let i=0;i<this.height/this.gridSize;i++){
            this.board.push([]);
            for(let z=0;z<this.width/this.gridSize;z++){
                this.board[i].push(-1);
            }
        }
        this.block = new Block(this);
    }
    update(deltaTime){
        if(gameState === 'play'){
            this.clearBlock();
            this.block.update(deltaTime);
            this.drawBlock();
            if(!this.block.falling){
                this.setLineHeight();
                this.block = new Block(this);
                if(this.checkScore()!==false){
                    gameState = 'scoring';
                };
            }
        }
        if(gameState === 'scoring'){
            this.scoreAnimationTimer += deltaTime;
            let multiplier = 0;
            function fall(){
                let doneFalling = true;
                for(let y=game.board.length-2;y>=game.lineHeight;y--){
                    for(let x=0; x<game.board[y].length;x++){
                        if(game.board[y][x]!==-1){
                            if(game.board[y+1][x]===-1){
                                game.board[y+1][x] = game.board[y][x];
                                game.board[y][x] = -1;
                                doneFalling = false;
                            }
                        }
                    }
                }
                if(!doneFalling){
                    fall();
                }if(doneFalling){
                    return true;
                }
            }
            if(this.checkScore()){
                let scoreLine = this.checkScore();
                multiplier += scoreLine.length - 2;
                for(let i=0;i<scoreLine.length;i++){
                    if(scoreLine.direction === 'down'){
                        game.board[scoreLine.y+i][scoreLine.x] = -1;
                    }
                    if(scoreLine.direction === 'right'){
                        game.board[scoreLine.y][scoreLine.x+i] = -1;
                    }
                    this.score += i * multiplier
                }
                fall();
            }
            console.log(this.score);
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
                if(game.board[y][x]!==-1){
                    let matches = findMatch(x,y);
                    if(matches[0]>=3){
                        return {x: x, y: y, direction: 'right', length: matches[0]};
                    }
                    if(matches[1]>=3){
                        return {x: x, y: y, direction: 'down', length: matches[1]};
                    }
                }
            }
        }
        return false;
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
                    ctx.fillStyle = colorSheet[this.board[row][col]];
                    ctx.fillRect(col*this.gridSize,row*this.gridSize,this.gridSize,this.gridSize);
                }
            }
        }
    }
}