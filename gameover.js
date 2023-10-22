export class GameOver {
    constructor(game) {
        this.game = game;
        this.fontSize = 40;
        this.fontFamily = 'VT323';
        this.imgButton = document.getElementById('button');    
        this.buttonRect = [
            { id: 'menu', x: 220, y: 850, width: 240, height: 80 },
            { id: 'play', x: 620, y: 850, width: 240, height: 80 }
        ];
    }
    restart(){
        this.game.lives = 3;
        this.game.score = 0;
        this.game.gameOver = false;
        this.game.level = 1;
        this.game.droprate = 0.5;
        this.game.foodInterval = 3000;
        this.game.foods = [];
        this.game.player.x = this.game.width/2-this.game.player.width/2;
    }
    draw(context) { 
        // context.fillText('Gameplay Tutorial', 540, 280);
        context.textAlign = 'center';
        context.font = 100 + 'px ' + this.fontFamily;
        context.fillStyle = 'black';

        if (this.game.score == 15){
            context.fillText("Yay yakisoba :D", this.game.width*0.5, this.game.height*0.5);
        } else{
            context.fillText('I SAID YAKISOBA!!', this.game.width*0.5, this.game.height*0.5);
        }

        this.buttonRect.forEach(button => {
            context.drawImage(this.imgButton, button.x, button.y, button.width, button.height);
        });

        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        context.fillText('Menu', 340, 895);
        context.fillText('Restart', 740, 895);
    }
    update(input) {
        if(input.length!= 0){
            const x = input[0];
            const y = input[1];
            this.buttonRect.forEach(button => {
                if (x >= button.x &&
                    x <= button.x + button.width &&
                    y >= button.y &&
                    y <= button.y + button.height
                ) {
                    this.restart();
                    if(button.id == "menu"){
                        this.game.menuState = 0;
                    }
                    else if(button.id == "play"){
                        this.game.menuState = 1;
                    }
                }
            });
            input.length = 0;
        }
    }
}