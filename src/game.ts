// main phaser
import Phaser from "phaser";

// scenes
import MainScene from "./scenes/mainScene";
import ArriveScene from "./scenes/arriveScene";
import SeekScene from "./scenes/seekScene";
import FlockingScene from "./scenes/flockingScene";
import LeaderScene from "./scenes/leaderScene";
import PursuitScene from "./scenes/pursuitScene";
import FleeScene from "./scenes/fleeScene";
import EvadeScene from "./scenes/evadeScene";
import WanderScene from "./scenes/wanderScene";
import CollisionScene from "./scenes/collisionScene";

export function createGame(parent,w,h,color,debuging) { 
    //console.log("CREATING GAME");
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
            MainScene,ArriveScene,SeekScene,
            LeaderScene,FlockingScene,PursuitScene,
            FleeScene,EvadeScene,WanderScene,CollisionScene
        ],
        scale: {        
            mode: Phaser.Scale.RESIZE,
            autoCenter: Phaser.Scale.CENTER_HORIZONTALLY
        }
    });
} 