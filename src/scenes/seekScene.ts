import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class SeekScene extends BaseScene{

    constructor(){
        super("SeekScene");
    }

    createBoids():void{
        this.boids = []
        let size = this.getSceneSize();
        var b = new Boid(this,size.x/2,size.y/2,"boid");
        b.setTarget(this.target);
        b.setMode(SteeringMode.SEEK);
        this.boids.push(b);

    }

}