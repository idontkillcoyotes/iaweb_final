import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class FlockingScene extends BaseScene{

    private amount : number = 50;

    constructor(pAmount:number){
        super("FlockingScene");
        this.amount = pAmount
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();
        for (let index = 0; index < this.amount; index++) {
            const rx = Phaser.Math.FloatBetween(100,size.x-100);
            const ry = Phaser.Math.FloatBetween(100,size.y-100);
        
            const element = new Boid(this,rx,ry,"boid");
            element.setMode(SteeringMode.FLOCK);
            element.setTarget(this.target);
            
            this.boids.push(element);
        }

        
        

    }

}