class Food {
    constructor(){
        this.width = 50;
        this.height = 50;
        this.frameX = 0;
        this.frameY = 0;
        this.delete = false;
        this.angle = 5;
        this.va = Math.random() * 0.1 + 0.1;
    }

    update(deltaTime){
        // movement
        this.x -= this.speedX;
        this.y += this.speedY;
        if (this.game.level > 1){
            this.angle += this.va;
            let widthWave = 3;
            if (this.game.level === 3) { widthWave = 6}
            this.x += Math.sin(this.angle)*Math.random() * widthWave;

            // prevent food going outside border
            if (this.x + this.width > this.game.width) {this.x-10;}
            else if(this.x < 0) {this.x+10;}
        }
        if (this.y >= this.game.height) this.delete = true;
        
    }
    draw(context){
        if (this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}

export class YakisobaFood extends Food {
    constructor(game){
        super();
        this.game = game;
        this.x = Math.random(1) * this.game.width * 0.9;
        this.y = -50;
        this.speedX = 0;
        this.speedY = 0.9;
        this.catch = true;
        this.image = document.getElementById('food_yakisoba');
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}

export class YakisabaFood extends Food {
    constructor(game){
        super();
        this.game = game;
        this.x = Math.random(2) * this.game.width * 0.9;
        this.y = -50;
        this.speedX = 0;
        this.speedY = 1;
        this.catch = false;
        this.image = document.getElementById('food_yakisaba');
    }
    update(deltaTime){
        super.update(deltaTime);
    }
}