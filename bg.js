export class Background {
    constructor(game){
        this.game = game;
        this.width = this.game.width;
        this.height = this.game.height;
        this.x = 0;
        this.y = 0;
        this.image = document.getElementById('background');
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}