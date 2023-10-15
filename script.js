import {Player} from './player.js';
import { InputHandler } from './input.js';
import { YakisobaFood, YakisabaFood } from './food.js';
import { HUD } from './hud.js';
import { Background } from './bg.js';
import { BGM } from './bgm.js';


window.addEventListener('load', function(){
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1080;

    class Game {
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.foods = [];
            this.foodTimer = 0;
            this.foodInterval = 3000;
            this.foodAmount = 25;
            this.debug = false;
            this.lives = 3;
            this.score = 0;
            this.gameOver = false;
            this.level = 1;
            this.droprate = 0.5;
            this.collisions = [];
            this.floatingMessages = [];
            this.fontColor = 'black'
            this.HUD = new HUD(this);
            this.background = new Background(this);
            this.bgm = new BGM(this);
        }
        update(deltaTime){
            this.player.update(this.input.keys, deltaTime);
            // handle food spawn
            if (this.foodTimer > this.foodInterval){
                this.foodTimer = 0;
                // randomize drop, lower = less yakisoba
                if (Math.random() < this.droprate){
                    this.addFood(true); // yakisoba
                    this.foodAmount--;
                } else{
                    this.addFood(false); // yakisaba
                }
            } else{
                this.foodTimer += deltaTime;
            }
            
            this.foods.forEach(food => {
                food.update(deltaTime);
                // remove outborder food
                if (food.delete) this.foods.splice(this.foods.indexOf(food), 1);
            })
            // increase difficulty
            if (this.score === 4)  {
                this.level = 2;
                this.foodInterval = 2000;
                this.droprate = 0.4;
            }
            else if (this.score === 8)  {
                this.level = 3;
                this.foodInterval = 1000;
                this.droprate = 0.25;
            }
            else if (this.score === 15) this.gameOver = true;

            if (this.gameOver) {
                this.bgm.stopbgm();
                this.bgm.playbgm(2);
            }

        }
        draw(context){
            this.background.draw(context);
            this.player.draw(context);
            this.foods.forEach(food => {
                food.draw(context);
            });
            this.HUD.draw(context);
            if (!this.gameOver) this.bgm.playbgm(1);
        }
        addFood(context){
            if(context){
                this.foods.push(new YakisobaFood(this));
            } else{
                this.foods.push(new YakisabaFood(this));
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);
    console.log(game);

    let time_step = 1000 / 60,
    deltaTime = 0,
    lastFrame_ms = 0, // last time the loop was run
    max_FPS = 60; // max fps

    function animate(timestamp){
        if (timestamp < lastFrame_ms + (1000 / max_FPS)) {
            requestAnimationFrame(animate);
            return;
        }
        deltaTime += timestamp - lastFrame_ms;
        lastFrame_ms = timestamp;

        while (deltaTime >= time_step) {
            game.update(time_step);
            deltaTime -= time_step;
        }
        
        ctx.clearRect(0,0, canvas.width, canvas.height);
        game.draw(ctx);
        if (!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});

