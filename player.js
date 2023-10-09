export class Player{
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 100;
        this.x = 100;
        this.y = this.game.height - this.height;
        this.image = document.getElementById('player');
        this.speed = 0;
        this.maxSpeed = 4;
    }
    update(input){
        this.checkCollision();
        this.x += this.speed;
        // move
        if(input.includes('ArrowRight') && this.x + this.width -10 <= this.game.width) this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft') && this.x + 10 >= 0) this.speed = -this.maxSpeed;
        else this.speed = 0;
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    checkCollision(){
        this.game.foods.forEach(food => {
            if (
                food.x < this.x + this.width - 10 && 
                food.x + food.width > this.x + 10 &&
                food.y < this.y + this.height * 0.3 &&
                food.y + food.height > this.y+this.height*0.1
            ){
                food.delete = true;
                if (food.catch) {
                    this.game.score++;
                } else{
                    this.game.lives--;
                    if (this.game.lives<=0) this.game.gameOver = true;
                }
            }
        });
    }
}