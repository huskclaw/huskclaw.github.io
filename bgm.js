export class BGM {
    constructor(game){
        this.game = game;
        this.bgm = [
            document.getElementById('play'),
            document.getElementById('win'),
            document.getElementById('gameover'),
            document.getElementById('story'),
            document.getElementById('help'),
        ];
        this.current = null;
    }

    playBGM() {
        const newBGMState = this.game.bgmState;

        if (this.current == newBGMState) {
            // BGM is already playing, no need to change.
            return;
        }

        if (this.current != null) {
            // If there is a current BGM, stop it.
            this.stopBGM();
        }

        if (newBGMState != null) {
            // Start playing the new BGM.
            this.bgm[newBGMState].currentTime = 0;
            this.bgm[newBGMState].play();
            this.current = newBGMState;
        }
        else
            this.current = newBGMState;
    }

    stopBGM() {
        if (this.current != null && !this.bgm[this.current].paused) {
            this.bgm[this.current].pause();
        }
    }
}
