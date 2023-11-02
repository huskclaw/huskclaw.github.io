export class GameOver {
    constructor(game) {
        this.game = game;
        this.fontSize = 40;
        this.fontFamily = 'VT323';
        this.imgButton = document.getElementById('button');    
        this.buttonRect = [
            { id: 'menu', x: 220, y: 850, width: 240, height: 80 },
            { id: 'play', x: 620, y: 850, width: 240, height: 80 },
            { id: 'submit', x: 480, y: 620, width: 120, height: 40 }
        ];
        this.donePostScore = false;
        this.username = null;
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
        this.donePostScore = false;
    }
    draw(context) { 
        context.textAlign = 'center';
        context.font = 100 + 'px ' + this.fontFamily;
        context.fillStyle = 'black';
        let gameOverText;

        if (this.game.score == this.game.winScore){
            gameOverText = `Yay yakisoba :D`
        } else if (this.game.lives == 0) {
            gameOverText = `I SAID YAKISOBA!!`
        }
        context.fillText(`${gameOverText}`, this.game.width*0.5, this.game.height*0.5);

        context.font = this.fontSize + 'px ' + this.fontFamily;
        context.fillText(`Your Score: ${this.game.score*100}`, this.game.width*0.5, this.game.height*0.5+50);

        this.buttonRect.forEach(button => {
            context.drawImage(this.imgButton, button.x, button.y, button.width, button.height);
        });

        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        context.fillText('Menu', 340, 895);
        context.fillText('Restart', 740, 895);

        context.font = 25+'px '+this.fontFamily;
        context.fillText('Submit', 540, 645);
    }
    async send_score(){
        try{
            const nama = this.username;
            const score = '1500';
            const response = await axios.post('https://ets-pemrograman-web-f.cyclic.app/scores/score', {
                nama,
                score
            });

            if (response.data.status == 'success') {
                this.donePostScore = true;
                alert("Succeed!");
            }
            else alert("Error while submitting score!");
            
        } catch (error){
            console.log(error)
            alert('Error while submitting score!')
        }
        
    }
    update(input) {
        if(input.length > 1){
            const x = input[0];
            const y = input[1];
            this.buttonRect.forEach(button => {
                if (x >= button.x &&
                    x <= button.x + button.width &&
                    y >= button.y &&
                    y <= button.y + button.height
                ) {
                    if(button.id == "submit"){
                        if(this.username == null){
                            alert("you must login first!");
                        }
                        else if(this.donePostScore == true){
                            alert("You already submit your score!");
                        }
                        else if(this.game.score >= this.game.winScore){
                            if(confirm("You may only submit your score once. Continue?")){
                                this.send_score();
                            } 
                        } else{
                            alert("You may only submit your score if you win!");
                        }
                    }
                    else{
                        this.restart();
                        if(button.id == "menu"){
                            this.game.menuState = 0;
                        }
                        else if(button.id == "play"){
                            this.game.menuState = 1;
                        }
                    }
                }
            });
            input.length = 0;
        }
    }
}