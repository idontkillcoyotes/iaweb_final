import Phaser from "phaser";
import EventDispatcher from "../utils/eventDispatcher";


export default class MainScene extends Phaser.Scene{

    currentScene?: string

    constructor(){
        super({
            key: "MainScene",
            active: true
        })
    }

    create(){
    
        var emitter = EventDispatcher.getInstance()
        emitter.addListener("changeScene",this.handler,this)
    }

    handler(name:string){
        
        if (name == this.currentScene){
            return
        }
        if (this.currentScene){
        
            this.scene.stop(this.currentScene)
        }
        
        this.scene.start(name)
        this.currentScene = name        
    }
}