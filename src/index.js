import { Game } from './game.js';
import { Boids } from './boids.js';

const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    height: 600,
    scene:[Boids],
    physics: {
        default: 'arcade'
    },    
}

var game = new Phaser.Game(config);