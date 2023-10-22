export class Help {
    constructor(game) {
        this.game = game;
        this.fontSize = 40;
        this.fontFamily = 'VT323';
        this.imgButton = document.getElementById('button');        
        this.imgBubble = document.getElementById('buletin');
        this.buttonRect = [
            { id: 'menu', x: 420, y: 850, width: 240, height: 80 }
        ];
    }
    draw(context) {

        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(40, 40, 40)';
        
        context.drawImage(this.imgBubble, 65, 65, 950, 950);

        this.buttonRect.forEach(button => {
            context.drawImage(this.imgButton, button.x, button.y, button.width, button.height);
        });

        context.fillText('Gameplay Tutorial', 540, 280);
        
        context.textAlign = 'left';
        context.fillText('o> Move character with Right or Left arrow key', 170, 380);
        context.fillText('o> Catch Yakisoba and avoid Yakisaba', 170, 420);
        context.fillText('o> 1 Yakisoba = +1 Points', 170, 460);
        context.fillText('o> 1 Yakisaba = -1 Lives', 170, 500);
        context.fillText('o> Goal: Catch 15 Yakisoba', 170, 540);

        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        context.fillText('Menu', 540, 895);
        // context.fillText('Playsdfsdf', 540, 500);
        // context.fillText('Helpsdfsdf', 540, 600);
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
                    this.game.menuState = 0;
                }
            });
            input.length = 0;
        }
    }
}