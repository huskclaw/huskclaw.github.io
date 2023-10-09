export class Background {
    constructor(){
        this.width = 500;
        this.height = 500;
        this.x = 0;
        this.y = 0;
        this.image = document.getElementById('background');
    }

    draw(context){
        context.drawImage(this.image, this.x, this.y, this.width, this.height)
    }
}