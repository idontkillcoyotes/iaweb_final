import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";


export default class ArriveScene extends BaseScene{

    constructor(){
        super("ArriveScene");
    }

    createBoids():void{
        this.boids = []
        let size = new Phaser.Math.Vector2(
            this.scale.width/2,
            this.scale.height/2
        );

        var b = new Boid(this,size.x,size.y,"boid");
        b.setTarget(this.target);
        b.setMode(SteeringMode.ARRIVE);
        this.boids.push(b);

    }

}