class Block{
    constructor(game){
        this.bricks = [];
        this.coord = {x: Math.floor(game.board[0].length/2-1), y: 0};
        this.falling = true;
        this.stopFall = false;
        this.upPressed = false;
        this.timer = 0;
        this.timerReset = game.fallTime;
        this.moveTimer = (this.timerReset>200)?200:this.timerReset;
        this.isBlocked = {left: false, right: false, up: false, down: false}
        this.positions = {
            box: [[[0,0],[1,0],[1,1],[0,1]],[[1,0],[1,1],[0,1],[0,0]],[[1,1],[0,1],[0,0],[1,0]],[[0,1],[0,0],[1,0],[1,1]]],
            line: [[[-1,0],[0,0],[1,0],[2,0]],[[0,-1],[0,0],[0,1],[0,2]],[[2,0],[1,0],[0,0],[-1,0]],[[0,2],[0,1],[0,0],[0,-1]]],
            j: [[[0,0],[1,0],[2,0],[2,1]],[[1,0],[1,1],[1,2],[0,2]],[[2,1],[1,1],[0,1],[0,0]],[[0,2],[0,1],[0,0],[1,0]]],
            l: [[[0,1],[1,1],[2,1],[2,0]],[[0,0],[0,1],[0,2],[1,2]],[[2,0],[1,0],[0,0],[0,1]],[[1,2],[1,1],[1,0],[0,0]]],
            t: [[[0,0],[1,0],[1,1],[2,0]],[[1,0],[1,1],[0,1],[1,2]],[[2,1],[1,1],[1,0],[0,1]],[[0,2],[0,1],[1,1],[0,0]]],
            s: [[[0,1],[1,1],[1,0],[2,0]],[[0,0],[0,1],[1,1],[1,2]],[[2,0],[1,0],[1,1],[0,1]],[[1,2],[1,1],[0,1],[0,0]]],
            z: [[[0,0],[1,0],[1,1],[2,1]],[[1,0],[1,1],[0,1],[0,2]],[[2,1],[1,1],[1,0],[0,0]],[[0,2],[0,1],[1,1],[1,0]]]
        }
        this.shape = this.setShape();
    }
    setShape(){
        let shapeVal = Math.floor(Math.random()*7);
        let shape = '';
        switch(shapeVal){
            case 0:
                shape = 'box';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.box,i));
                }
                break;
            case 1:
                shape = 'line';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this, this.positions.line, i));
                }
                break;
            case 2:
                shape = 'j';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.j,i));
                }
                break;
            case 3:
                shape = 'l';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.l,i));
                }
                break;
            case 4:
                shape = 't';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.t,i));
                }
                break;
            case 5:
                shape = 's';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.s,i));
                }
                break;
            case 6:
                shape = 'z';
                for(let i=0;i<4;i++){
                    this.bricks.push(new Brick(this,this.positions.z,i));
                }
                break;
        }
        return shape;
    }

    update(deltaTime){
        this.timer += deltaTime;
        this.timerReset = game.fallTime;
        this.moveTimer -= deltaTime;
        this.updateBricks();
        if(this.moveTimer < 0){
            this.moveTimer = 0;
        }
        if(input.left&&!this.isBlocked.left){
            if(input.lastPressed !== 'left'||this.moveTimer <= 0){
            this.coord.x -= 1;
            this.moveTimer = 150;
            }
        }else if(input.right&&!this.isBlocked.right){
            if(input.lastPressed !== 'right'||this.moveTimer <= 0){
            this.coord.x += 1;
            this.moveTimer = 150;
            }
        }else if(input.up&&!this.upPressed){  
            this.upPressed  = true;
        }else if(input.down&&this.timerReset>75){
            this.timerReset = 75;
        }

        if(this.timer > this.timerReset){
            if(this.falling && !this.stopFall){
                this.coord.y += 1;
                if(this.checkFall()){
                    this.stopFall = true;
                }
            }
            if(this.stopFall&&this.checkFall()){
                this.falling = false;
            }else{
                this.stopFall = false;
            }
            this.timer = 0;
        }
        this.isBlocked.left = false;
        this.isBlocked.right = false;
        this.isBlocked.down=false;
    }
    updateBricks(){
        this.bricks.forEach(function(brick){
            brick.update();
        });
    }
    checkFall(){
        for(let i=0;i<this.bricks.length;i++){
            if(this.bricks[i].checkBelow()===true){
                return true;
            }
        }
        return false;
    }
    
    rotateLeft(){
        if(!this.tryRotateLeft()){
            if(!this.isBlocked.left){
                game.clearBlock();
                this.coord.x--;
                if(this.tryRotateLeft()){
                    return true;
                }else{
                    game.clearBlock();
                    this.coord.x++;
                    this.updateBricks();
                }
            }else{
            return false;
            }
        }
    }

    rotateRight(){
        if(!this.tryRotateRight()){
            if(!this.isBlocked.left){
                game.clearBlock();
                this.coord.x--;
                if(this.tryRotateRight()){
                    return true;
                }else{
                    game.clearBlock();
                    this.coord.x++;
                    this.updateBricks();
                }
            }else{
            return false;
            }
        }
    }

    tryRotateLeft(){
        let stop = false;
        game.clearBlock();
        this.bricks.forEach((brick)=>{
            if(!brick.checkRotateLeftLegal()){
                stop = true;
            }
        });
        if(!stop){
            this.bricks.forEach((brick)=>{
                brick.rotateLeft();
            });
            return true;
        }else{
            return false;
        }
    }
    
    tryRotateRight(){
        let stop = false;
        game.clearBlock();
        this.bricks.forEach((brick)=>{
            if(!brick.checkRotateRightLegal()){
                stop = true;
            }
        });
        if(!stop){
            this.bricks.forEach((brick)=>{
                brick.rotateRight();
            });
            return true;
        }else{
            return false;
        }
    }
}