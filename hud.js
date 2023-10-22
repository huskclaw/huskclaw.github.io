export class HUD {
    constructor(game){
        this.game = game;
        this.fontSize = 50;
        this.fontFamily = 'VT323';
    }
    draw(context){
        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        context.fillText('Scores: '+this.game.score+'/15', 20, 50);
        context.fillText('Lvl: '+this.game.level, 20, 100);
        context.fillText('Lives: '+this.game.lives, 900, 50);
    }
}