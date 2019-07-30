fibonacci = [0,1,2,3,5,8,13];
class Scorekeeper{
    constructor(){
        this.baseMultiplier = fibonacci[(colorSheet.length-1)]*2.5;
        this.multiplier = this.baseMultiplier;
        this.score = 0;
        this.scoreInstance = 0;
        this.scoreEvents = [];
        this.popups = [];
    }
    update(deltaTime){
        this.popups = this.popups.filter((popup)=>{
            return (popup.opacity>0);
        });
        this.popups.forEach(popup=>{
            popup.update(deltaTime);
        });
    }
    draw(ctx){
        this.popups.forEach(popup=>{popup.draw(ctx)});
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
            this.popups.push(new ScorePop(score,thisScore));
            //console.log(`base: ${this.baseMultiplier}\nlength: ${score.length}\nmultiscore: ${multiScoreBonus}]\nscoreLength: ${scoreLengthBonus}\nturns: ${multiTurnBonus}\nthis score: ${thisScore}`);
        });
    }
    endTurn(){
        this.scoreInstance = Math.round(this.scoreInstance);
        this.score+=this.scoreInstance;
        this.scoreInstance = 0;
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
        this.text = "+"+score;
        this.opacity = 1;
    }
    update(deltaTime){
        this.opacity -= deltaTime/2000;
        this.y -= deltaTime/75;
    }
    draw(ctx){
        ctx.font = "18px roboto mono";
        ctx.fillStyle = "rgba(255,255,255,"+this.opacity+")";
        ctx.fillText(this.text,this.x,this.y);
    }
}