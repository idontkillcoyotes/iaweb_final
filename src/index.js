import Phaser from "phaser";
import ArriveScene from "./scenes/arriveScene";
import SeekScene from "./scenes/seekScene";
import FlockingScene from "./scenes/flockingScene";
import LeaderScene from "./scenes/leaderScene";


const width = 1200;
const height = 700;

const game = new Phaser.Game({
    type: Phaser.AUTO,
    width: width,
    height: height,
    render: {
        pixelArt: true
    },
    physics: {
        default: "arcade",
        arcade: {
            enableSleeping: true,
            gravity: {
                y: 0
            }
            //,debug: true
        }
    },
    parent: "game-container",
    scene: [
        FlockingScene
    ],
    scale: {
        
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});