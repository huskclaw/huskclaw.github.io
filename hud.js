export class HUD {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'VT323';
    }
    draw(context){
        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        context.fillText('Scores: '+this.game.score+'/15', 20, 40);
        context.fillText('Lvl: '+this.game.level, 20, 80);
        context.fillText('Lives: '+this.game.lives, 380, 40);
        
        if (this.game.gameOver){
            context.textAlign = 'center';
            context.font = 50 + 'px ' + this.fontFamily;
            if (this.game.score === 15){
                context.fillText("Yay, time to eat :D", this.game.width*0.5, this.game.height*0.5);
            } else{
                context.textAlign = 'center';
                context.font = 50 + 'px ' + this.fontFamily;
                context.fillText('I SAID YAKISOBA!!', this.game.width*0.5, this.game.height*0.5);
            }
        }
    }
}