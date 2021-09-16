import BaseScene from "./baseScene";
import { Boid, SteeringMode } from "./boid";

export default class SeekScene extends BaseScene{

    constructor(){
        super("SeekScene");
    }

    createBoids():void{

        let size = this.getSceneSize();
        var b = new Boid(this,size.x,size.y,"boid");
        b.setTarget(this.target);
        b.setMode(SteeringMode.SEEK);
        this.boids.push(b);

    }

}