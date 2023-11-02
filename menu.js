async function getUserName(token) {
    try {
        const response = await axios.get(`https://ets-pemrograman-web-f.cyclic.app/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        return response.data.data.nama;
    } catch (error) {
        console.log(error);
    }
}

export class Menu {
    constructor(game){
        this.game = game;
        this.fontSize = 50;
        this.fontFamily = 'VT323';
        this.image = document.getElementById('button');
        this.buttonRect = [
            { id: 'story', x: 420, y: 150, width: 240, height: 80},
            { id: 'play', x: 420, y: 300, width: 240, height: 80},
            { id: 'help', x: 420, y: 450, width: 240, height: 80},
            { id: 'highscore', x: 420, y: 600, width: 240, height: 80},
            { id: 'login', x: 950, y: 10, width: 120, height: 40}
        ];
        this.MenuGetUserName();
    }
    async MenuGetUserName() {
        const token = localStorage.getItem('accessToken')
        if(token!='null') {
            this.userName = await getUserName(token);
            localStorage.setItem('username', this.userName);
            this.game.fgameover.username = this.userName;
        } else {
            this.userName = 'Hooman'
            localStorage.setItem('username', null);
        }

    }
    async draw(context){
        context.font = this.fontSize+'px '+this.fontFamily;
        context.textAlign = 'center';
        context.fillStyle = 'rgb(84, 84, 84)';

        this.buttonRect.forEach(button => {
            context.drawImage(this.image, button.x, button.y, button.width, button.height);
        });

        context.fillText('Story', 540, 200);
        context.fillText('Play', 540, 350);
        context.fillText('Help', 540, 500);
        context.fillText('High Score', 540, 650);
        
        context.fillStyle = 'rgb(29, 37, 46)';
        if(this.userName==undefined) this.userName = "Hooman";
        context.fillText(`Welcome, ${this.userName}!`, 540, 80);

        context.font = 25+'px '+this.fontFamily;
        context.fillText('Log Out', 1010, 35);
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
                    if(button.id == "story"){
                        this.game.menuState = 2;
                    }
                    else if(button.id == "play"){
                        this.game.menuState = 1;
                    }
                    else if(button.id == "help"){
                        this.game.menuState = 3;
                    }
                    else if(button.id == "highscore"){
                        window.open('highscore.html', '_blank');
                    }
                    else if(button.id == "login"){
                        window.location.href = "index.html";
                    }
                }
            });
            input.length = 0;
        }
    }
}