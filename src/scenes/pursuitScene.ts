import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class PursuitScene extends BaseScene{

    constructor(){
        super("PursuitScene");
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();
        var b = new Boid(this,size.x/2,size.y/2,"boid");
        b.setTarget(this.target);
        b.setMode(SteeringMode.ARRIVE);
        this.boids.push(b);

        const rx = Phaser.Math.FloatBetween(0,size.x);
        const ry = Phaser.Math.FloatBetween(0,size.y);
        var p = new Boid(this,rx,ry,"boid");
        p.setTarget(b);

        p.setMode(SteeringMode.PURSUIT);
        const random = Phaser.Math.RandomXY(Phaser.Math.Vector2.ZERO,p.getMaxSpeed()/4)
        p.setVelocity(random.x,random.y)
        p.setMaxSpeed(300)

        p.setTint(0x44ea9f)
        this.boids.push(p);        
    }

}