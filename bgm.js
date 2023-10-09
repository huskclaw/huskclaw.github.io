export class BGM {
    constructor(){
        this.bgm = document.getElementById('bgm');
        this.endbgm = document.getElementById('endbgm');
    }
    playbgm(context){
        if (context===1) this.bgm.play();
        else if (context===2) this.endbgm.play();
    }
    stopbgm(){
        this.bgm.pause();
    }
}