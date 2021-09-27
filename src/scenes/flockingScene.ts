import EventDispatcher from "../utils/eventDispatcher";
import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class FlockingScene extends BaseScene{

    private amount:number;


    constructor(pAmount:number=100){
        super("FlockingScene");
        this.amount = pAmount
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();

        this.params.alignment = 1.0
        this.params.cohesion = 1.0
        this.params.separation = 3.0
        this.params.seek = 1.0


        for (let index = 0; index < this.amount; index++) {
            const rx = Phaser.Math.FloatBetween(0,size.x);
            const ry = Phaser.Math.FloatBetween(0,size.y);
        
            const element = new Boid(this,rx,ry,"boid");

            const random = Phaser.Math.RandomXY(Phaser.Math.Vector2.ZERO,element.getMaxSpeed()/4)
            element.setVelocity(random.x,random.y)

            element.setMode(SteeringMode.FLOCK);

            element.setTarget(this.target);
            
            this.boids.push(element);
        }

        EventDispatcher.getInstance().on('setParameters', (data) =>{
            console.log("Setting flocking parameters with: ")
            this.params.alignment = data.aligment
            this.params.cohesion = data.cohesion
            this.params.separation = data.separation
            this.params.seek = data.seek
        } )

        this.cameras.main.setZoom(0.4);
    }
}