fibonacci = [0,1,2,3,5,8,13];
class Scorekeeper{
    constructor(game){
        this.baseMultiplier = fibonacci[(colorSheet.length-1)]*2.5;
        this.multiplier = this.baseMultiplier;
        this.score = 0;
        this.scoreEvents = [];
        this.popups = [];
        this.scoreText = "";
        this.scoreBoard = {
            x: game.gridSize/3,
            y: game.gridSize-2,
            text: "",
            update: function(deltaTime, score){
                if(gameState==='play'||gameState==='scoring'){
                    this.text = `Score: ${game.scoreKeeper.score}`;
                }else{
                    this.text = "";
                }
            },
            draw: function(ctx){
                ctx.font = `bold ${game.gridSize/2}px roboto mono`;
                ctx.fillStyle = "black";
                ctx.fillText(this.text, game.gridSize/3,game.gridSize-2);
            }
        }
    }
    update(deltaTime){
        this.popups = this.popups.filter((popup)=>{
            popup.update(deltaTime);
            return (popup.opacity>0);
        });
        this.scoreBoard.update();
    }
    draw(ctx){
        this.popups.forEach(popup=>{popup.draw(ctx)});
        ctx.fillStyle = "white";
        ctx.font = "16px roboto mono";
        ctx.fillText(this.scoreText, 4, game.gridSize);
        this.scoreBoard.draw(ctx);
    }
    getBaseMultiplier(){
        this.baseMultiplier = fibonacci[(colorSheet.length-1)]*2.5;
        return this.baseMultiplier;
    }
    addScore(scoreEvent){
        this.scoreEvents.push(scoreEvent);
        let multiTurnBonus = (this.scoreEvents.length>=fibonacci.length)?fibonacci[fibonacci.length-1]:fibonacci[this.scoreEvents.length-1];
        multiTurnBonus = multiTurnBonus/2.5
        ;
        let multiScoreBonus = (scoreEvent.length-1)/2.5;
        scoreEvent.forEach(score=>{
            let scoreLengthBonus = (score.length-3>=fibonacci.length)?fibonacci[fibonacci.length-1]:fibonacci[score.length-3];
            scoreLengthBonus = scoreLengthBonus*0.25;
            let thisScore = this.baseMultiplier*score.length*(multiScoreBonus+scoreLengthBonus+multiTurnBonus+1);
            thisScore = Math.round(thisScore);
            this.popups.push(new ScorePop(score,thisScore));
            this.score+=thisScore;
            //console.log(`base: ${this.baseMultiplier}\nlength: ${score.length}\nmultiscore: ${multiScoreBonus}]\nscoreLength: ${scoreLengthBonus}\nturns: ${multiTurnBonus}\nthis score: ${thisScore}`);
        });
    }
    endTurn(){
        this.scoreEvents = [];
    }
    scoreReset(){

    }
}

class ScorePop{
    constructor(scoreEvent,score){
        this.x = scoreEvent.x*game.gridSize;
        this.y = scoreEvent.y*game.gridSize;
        if(scoreEvent.direction==="right"){
            this.x+=game.gridSize*scoreEvent.length/2;
        }else{
            this.y+=game.gridSize*scoreEvent.length/2;
        }
        this.font = (game.gridSize/2.5+(game.gridSize/12*score/12))+"px roboto mono";
        this.text = "+"+score;
        this.opacity = 1;
    }
    update(deltaTime){
        this.opacity -= deltaTime/2000;
        this.y -= deltaTime/75;
    }
    draw(ctx){
        ctx.font = this.font;
        ctx.fillStyle = "rgba(255,255,255,"+this.opacity+")";
        ctx.fillText(this.text,this.x,this.y);
    }
}