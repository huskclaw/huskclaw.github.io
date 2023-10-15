export class Player{
    constructor(game){
        this.game = game;
        this.width = 200;
        this.height = 200;
        this.x = this.game.width/2-this.width/2;
        this.y = this.game.height - this.height;
        this.x_HP_area = 25;
        this.x_W_HP_area = this.width-50;
        this.y_HP_area = 10;
        this.y_W_HP_area = this.height-130;
        this.image = document.getElementById('player');
        this.speed = 0;
        this.maxSpeed = 8;
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
        if (this.game.debug) context.strokeRect(this.x+this.x_HP_area , this.y+this.y_HP_area, this.x_W_HP_area, this.y_W_HP_area);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    checkCollision(){
        this.game.foods.forEach(food => {
            if (
                food.x < this.x + this.x_W_HP_area + 20 && // right
                food.x + food.width > this.x + this.x_HP_area && // left
                food.y < this.y + this.y_W_HP_area && // bottom
                food.y + food.height > this.y+this.y_HP_area // up
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