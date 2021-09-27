import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class WanderScene extends BaseScene{

    constructor(){
        super("WanderScene");
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();

        for (let index = 0; index < 10; index++) {
            const rx = Phaser.Math.FloatBetween(0,size.x);
            const ry = Phaser.Math.FloatBetween(0,size.y);
        
            const element = new Boid(this,rx,ry,"boid");
            
            element.setMaxSpeed(100)

            const random = Phaser.Math.RandomXY(Phaser.Math.Vector2.ZERO,element.getMaxSpeed()/4)
            element.setVelocity(random.x,random.y)

            element.setMode(SteeringMode.WANDER);            

            this.boids.push(element);
        }

        this.cameras.main.setZoom(0.5)
    }

}