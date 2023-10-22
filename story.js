export class Story {
    constructor(game) {
        this.game = game;
        this.fontSize = 40;
        this.fontFamily = 'VT323';
        this.imgButton = document.getElementById('button');        
        this.imgBubble = document.getElementById('bubble');
        this.buttonRect = [
            { id: 'menu', x: 720, y: 650, width: 240, height: 80 }
        ];
    }
    draw(context) {

        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.textAlign = 'justify';
        context.fillStyle = 'rgb(40, 40, 40)';

        this.buttonRect.forEach(button => {
            context.drawImage(this.imgButton, button.x, button.y, button.width, button.height);
        });
        context.drawImage(this.imgBubble, 40, 40, 1000, 700);

        const longText = `Once upon a day, Mio asked her dear friend Yuuko to pick up some scrumptious yakisoba. But, in a side-splitting twist of fate, Yuuko returned with a basket brimming with yakisaba, causing Mio to flip her noodle. She promptly demanded that Yuuko stay away until she procured the longed-for yakisoba,             leaving Yuuko in a bewildered pickle.                                         
        
        Out of nowhere, a truly unremarkable explosion occurred, With a sudden twist, it started raining food - two kinds to be exact: the coveted yakisoba and the despised yakisaba. With her pulse racing, Yuuko raced to snatch up as much yakisoba as humanly possible, gracefully avoiding the rain of yakisaba, turning the whole situation into a sidesplitting food chase.`;

        // Split the long text into lines to fit the canvas width
        const maxWidth = 850; // Set the maximum width for each line
        const lineHeight = 33; // Set the line height
        const x = 540
        let y = 110; // Initial vertical position


        const words = longText.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + ' ';
            const testWidth = context.measureText(testLine).width;
            if (testWidth > maxWidth && n > 0) {
                context.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        context.fillText(line, x, y);

        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        context.fillText('Menu', 840, 695);
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