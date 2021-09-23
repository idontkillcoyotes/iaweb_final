import Phaser from "phaser";
import MainScene from "./scenes/mainScene";
import ArriveScene from "./scenes/arriveScene";
import SeekScene from "./scenes/seekScene";
import FlockingScene from "./scenes/flockingScene";
import LeaderScene from "./scenes/leaderScene";

import EventDispatcher from "./scenes/eventDispatcher";

const width = 1200;
const height = 700;


//@ts-ignore
window.changeScene = function changeScene(newScene,button){
    document.getElementById(newScene)?.setAttribute("class","nav-link active")
    console.log("button pressed ",newScene)
    console.log("About to emit changeScene phaser event")
    console.log(EventDispatcher.getInstance().eventNames())
    EventDispatcher.getInstance().emit("changeScene",newScene)
}

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: width,
    height: height,
    backgroundColor: '#3f3f74',
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            gravity: {
                y: 0
            }
            ,debug: true
        }
    },
    parent: "game-container",
    dom: {
		createContainer: true
	},
    scene: [
        MainScene,ArriveScene,SeekScene
    ],
    scale: {        
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
    }
});

