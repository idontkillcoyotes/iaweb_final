import EventDispatcher from "../utils/eventDispatcher";
import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class CollisionScene extends BaseScene{

    constructor(){
        super("CollisionScene");
    }

    createBoids():void{
        this.boids = []
        this.obstacles = []
        let size = this.getSceneSize();


        for (let index = 0; index < 10; index++) {
            const rx = Phaser.Math.FloatBetween(0,size.x);
            const ry = Phaser.Math.FloatBetween(0,size.y);
        
            const element = new Boid(this,rx,ry,"obstacle",true);
            this.obstacles.push(element);
        }


        var b = new Boid(this,size.x/2,size.y/2,"boid");
        b.setTarget(this.target);
        b.setMode(SteeringMode.AVOIDCOLLISION);
        b.setObstacles(this.obstacles)
        b.setTint(0x8855ff);
        this.boids.push(b);

        
        this.createColliders()

    }

}