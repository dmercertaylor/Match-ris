class Brick{
    constructor(block, positions, index){
        this.position = [];
        for(let i=0;i<positions.length;i++){
            this.position.push(positions[i][index]);
        }
        this.positionIndex = 0;
        this.relativeCoord = {x: this.position[0][0], y: this.position[0][1]}
        this.coord = {x: this.relativeCoord.x + block.coord.x, y: this.relativeCoord.y + block.coord.y};
        this.color = Math.floor(Math.random()*colorSheet.length);
        this.border = {left: false, right: false, up: false, down: false};
        this.updateBorders();

    }
    update(){
        this.coord = {x: this.relativeCoord.x + game.block.coord.x, y: this.relativeCoord.y + game.block.coord.y};
        if(this.coord.x<=0||game.board[this.coord.y][this.coord.x-1]!==-1){
            game.block.isBlocked.left = true;
        }
        if(this.coord.x+1>=game.board[this.coord.y].length||game.board[this.coord.y][this.coord.x+1]!==-1){
            game.block.isBlocked.right = true;
        }
    }
    updateBorders(){
        if(this.relativeCoord.x === 0){
            this.border.left = true;
        }
    }
    checkBelow(){
        if(this.coord.y+1>=game.board.length||game.board[this.coord.y+1][this.coord.x]!==-1){
            return true;
        }else{
            return false;
        }
    }
    checkRotateRightLegal(){
        let testIndex = (this.positionIndex+1>=this.position.length)?0:this.positionIndex+1;
        game.clearBlock();
        let testCoords = {x: this.position[testIndex][0]+game.block.coord.x, y: this.position[testIndex][1]+game.block.coord.y}
        if(testCoords.y<0||testCoords.y>=game.board.length||testCoords.x>=game.board[testCoords.y].length||game.board[testCoords.y][testCoords.x]!==-1){
            game.drawBlock();
            return false;
        }
        game.drawBlock();
        return true;
    }
    checkRotateLeftLegal(){
        let testIndex = (this.positionIndex-1<0)?this.position.length-1:this.positionIndex-1;
        game.clearBlock();
        let testCoords = {x: this.position[testIndex][0]+game.block.coord.x, y: this.position[testIndex][1]+game.block.coord.y}
        if(testCoords.y<0||testCoords.y>=game.board.length||testCoords.x>=game.board[testCoords.y].length||game.board[testCoords.y][testCoords.x]!==-1){
            game.drawBlock();
            return false;
        }
        game.drawBlock();
        return true;
    }
    rotateRight(){
        this.positionIndex = (this.positionIndex+1>=this.position.length)?0:this.positionIndex+1;
        this.relativeCoord = {x: this.position[this.positionIndex][0], y: this.position[this.positionIndex][1]}
    }
    rotateLeft(){
        this.positionIndex = (this.positionIndex-1<0)?this.position.length-1:this.positionIndex-1;
        this.relativeCoord = {x: this.position[this.positionIndex][0], y: this.position[this.positionIndex][1]}
    }
}