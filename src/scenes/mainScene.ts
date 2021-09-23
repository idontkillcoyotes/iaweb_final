import Phaser from "phaser";
import EventDispatcher from "./eventDispatcher";


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
        console.log("MainScene create")
        console.log(emitter)
    }

    handler(name:string){
        console.log("SCENES ON MANAGER: ",this.scene.manager.getScenes(false).length)
        if (name == this.currentScene){
            return
        }
        if (this.currentScene){
            console.log("removing current scene ",this.currentScene)
            this.scene.stop(this.currentScene)
        }
        console.log("launching new scene ",name)
        this.scene.start(name)
        this.currentScene = name        
    }
}