import { Player } from './player.js';
import { InputHandler } from './input.js';
import { YakisobaFood, YakisabaFood } from './food.js';
import { HUD } from './hud.js';
import { Background } from './bg.js';
import { BGM } from './bgm.js';
import { Menu } from './menu.js';
import { Story } from './story.js';
import { Help } from './help.js';
import { GameOver } from './gameover.js';

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
            this.debug = false;
            this.lives = 3;
            this.score = 0;
            this.gameOver = false;
            this.level = 1;
            this.droprate = 0.5;
            this.collisions = [];
            this.fontColor = 'black'
            this.HUD = new HUD(this);
            this.background = new Background(this);
            this.bgm = new BGM(this);
            this.menuState = 0; // 0 = menu, 1 = play, 2 = story, 3 = help
            this.menu = new Menu(this);
            this.story = new Story(this);
            this.help = new Help(this);
            this.fgameover = new GameOver(this);
            this.bgmState = null; // 0=play, 1=win, 2=gameover, 3=story, 4=help
        }
        update(deltaTime){
            if(this.menuState == 0){
                this.bgmState = null;
                this.bgm.playBGM();
                this.menu.update(this.input.clicks, deltaTime);
            }
            else if(this.menuState == 1){
                if(!this.gameOver){
                    this.bgmState = 0;
                    this.bgm.playBGM();
                    
                    this.player.update(this.input.keys, deltaTime);
                
                    // handle food spawn
                    if (this.foodTimer > this.foodInterval){
                        this.foodTimer = 0;
                        // randomize drop, lower = less yakisoba
                        if (Math.random() < this.droprate){
                            this.addFood(true); // yakisoba
                        } else{
                            this.addFood(false); // yakisaba
                        }
                    } else{
                        this.foodTimer += deltaTime;
                    }
                    
                    this.foods.forEach(food => {
                        food.update(deltaTime);
                        // despawn food
                        if (food.delete) this.foods.splice(this.foods.indexOf(food), 1);
                    })
                    // increase difficulty
                    if (this.score == 4)  {
                        this.level = 2;
                        this.foodInterval = 2000;
                        this.droprate = 0.4;
                    }
                    else if (this.score == 8)  {
                        this.level = 3;
                        this.foodInterval = 1000;
                        this.droprate = 0.25;
                    }
                    if (this.score == 15 || this.lives == 0) this.gameOver = true;
                }
                else{
                    // this.bgm.stopBGM();
                    // this.bgm.playBGM(2);
                    if(this.lives==0) this.bgmState = 2;
                    else this.bgmState = 1;
                    
                    this.bgm.playBGM();

                    this.fgameover.update(this.input.clicks, deltaTime);
                }
            }
            else if(this.menuState == 2){
                this.bgmState = 3;
                this.bgm.playBGM();
                this.story.update(this.input.clicks, deltaTime);
            }
            else if(this.menuState == 3){
                this.bgmState = 4;
                this.bgm.playBGM();
                this.help.update(this.input.clicks, deltaTime)
            }

        }
        draw(){
            if(this.menuState == 0){ // menu
                this.background.draw(ctx);
                this.menu.draw(ctx);
            }
            else if(this.menuState == 1){ // play
                // if(!this.gameOver)  {
                this.background.draw(ctx);
                this.player.draw(ctx);
                this.foods.forEach(food => {
                    food.draw(ctx);
                });
                this.HUD.draw(ctx);
            
                if (this.gameOver) 
                    this.fgameover.draw(ctx);
            }
            else if(this.menuState == 2){ // story
                this.background.draw(ctx);
                this.story.draw(ctx);
            }
            else if(this.menuState == 3){ // help
                this.background.draw(ctx);
                this.help.draw(ctx);
            }

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
        game.draw();
        // if (!game.gameOver) requestAnimationFrame(animate);
        requestAnimationFrame(animate);
    }
    animate(0);
});
