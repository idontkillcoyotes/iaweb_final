import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class LeaderScene extends BaseScene{

    private amount : number = 20;

    constructor(amount:number){
        super("LeaderScene");
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();

        const leader = new Boid(this,size.x/2,size.y/2,"boid");
        leader.setMode(SteeringMode.ARRIVE);
        leader.setTarget(this.target);
        leader.setTint(0x8855ff);

        this.boids.push(leader);

        leader.setImmovable(true)
        
        for (let index = 0; index < this.amount; index++) {
            const rx = Phaser.Math.FloatBetween(0,size.x);
            const ry = Phaser.Math.FloatBetween(0,size.y);
        
            const element = new Boid(this,rx,ry,"boid");

            const random = Phaser.Math.RandomXY(Phaser.Math.Vector2.ZERO,element.getMaxSpeed()/4)
            element.setVelocity(random.x,random.y)

            element.setMode(SteeringMode.FOLLOWLEADER);
            element.setTarget(leader);            
            this.boids.push(element);
        }


        this.createColliders();
    }

}