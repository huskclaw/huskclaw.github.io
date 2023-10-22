export class Menu {
    constructor(game){
        this.game = game;
        this.fontSize = 50;
        this.fontFamily = 'VT323';
        this.image = document.getElementById('button');
        this.buttonRect = [
            { id: 'story', x: 420, y: 300, width: 240, height: 80},
            { id: 'play', x: 420, y: 450, width: 240, height: 80},
            { id: 'help', x: 420, y: 600, width: 240, height: 80}
        ];
    }
    draw(context){
        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        this.buttonRect.forEach(button => {
            context.drawImage(this.image, button.x, button.y, button.width, button.height);
        });

        context.fillText('Story', 540, 350);
        context.fillText('Play', 540, 500);
        context.fillText('Help', 540, 650);
    }
    update(input){
        if(input.length!= 0){
            const x = input[0];
            const y = input[1];
            this.buttonRect.forEach(button => {
                if (
                    x >= button.x &&
                    x <= button.x + button.width &&
                    y >= button.y &&
                    y <= button.y + button.height
                ) {
                    // Handle the click for the clicked button
                    // For example, you can call a function or trigger an event.
                    // console.log('Clicked ' + button.id);
                    if(button.id == "story"){
                        this.game.menuState = 2;
                    }
                    else if(button.id == "play"){
                        this.game.menuState = 1;
                    }
                    else if(button.id == "help"){
                        this.game.menuState = 3;
                    }
                }
            });
            input.length = 0;
        }
    }
}