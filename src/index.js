//import { Phaser } from './phaser/phaser.min.js';
import { Test } from './test.js';
import { Boids } from './boids.js';


const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene:[Test],
    physics: {
        default: 'arcade'
    },    
}

var game = new Phaser.Game(config);