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

        const leader = new Boid(this,0,0,"boid");
        leader.setMode(SteeringMode.ARRIVE);
        leader.setTarget(this.target);
        leader.setTintFill(0x5500ff);

        this.boids.push(leader);

        for (let index = 0; index < this.amount; index++) {
            const rx = Phaser.Math.FloatBetween(100,size.x-100);
            const ry = Phaser.Math.FloatBetween(100,size.y-100);
        
            const element = new Boid(this,rx,ry,"boid");
            element.setMode(SteeringMode.FOLLOWLEADER);
            element.setTarget(leader);            
            this.boids.push(element);
        }

        
        

    }

}