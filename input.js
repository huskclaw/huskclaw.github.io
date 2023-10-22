export class InputHandler {
    constructor(game){
        this.game = game;
        this.keys = [];
        this.clicks = [];    
        this.keylist = ['ArrowLeft', 'ArrowRight', 'a', 'd'];
    
        window.addEventListener('keydown', e=> {
            if(this.keylist.includes(e.key) && this.keys.indexOf(e.key) === -1){
                this.keys.push(e.key);
            } else if (e.key === 't') this.game.debug = !this.game.debug;
            else if (e.key === 'm') {
                if(this.game.bgm.bgm.muted==false) {
                    this.game.bgm.bgm.muted = true;
                }
                else {
                    this.game.bgm.bgm.muted = false;
                }
            }
        })
        window.addEventListener('keyup', e=> {
            if (this.keylist.includes(e.key)){
                this.keys.splice(this.keys.indexOf(e.key), 1);
            }
        })
        window.addEventListener('click', e=> {
            const canvas = document.getElementById('canvas1');
            const rect = canvas.getBoundingClientRect(); // Get the canvas's position on the page
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            const tmouseX = 1080/rect.width*mouseX;
            const tmouseY = 1080/rect.width*mouseY;
            
            this.clicks.push(tmouseX);
            this.clicks.push(tmouseY);
        })
    }
}