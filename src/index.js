import Phaser from "phaser";
import MainScene from "./scenes/main";


const width = 1280;
const height = 720;

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
            //debug: true
        }
    },
    parent: "game-container",
    scene: [
        MainScene
    ],
    scale: {
        
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
});