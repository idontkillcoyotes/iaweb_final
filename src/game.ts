// main phaser
import Phaser from "phaser";

// scenes
import MainScene from "./scenes/mainScene";
import ArriveScene from "./scenes/arriveScene";
import SeekScene from "./scenes/seekScene";
import FlockingScene from "./scenes/flockingScene";
import LeaderScene from "./scenes/leaderScene";

export function createGame(parent,w,h,color,debuging) { 
    console.log("CREATING GAME");
    return new Phaser.Game({
        type: Phaser.AUTO,
        width: w,
        height: h,
        backgroundColor: color,
        render: {
            pixelArt: true
        },
        physics: {
            default: "arcade",
            arcade: {
                gravity: {
                    y: 0
                },
                debug: debuging
            }
        },
        parent: parent,
        scene: [
            MainScene,ArriveScene,SeekScene,LeaderScene,FlockingScene
        ],
        scale: {        
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        }
    });
} 