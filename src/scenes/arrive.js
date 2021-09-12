import Phaser from "phaser";
import BoidPNG from "../assets/boid.png";
import TargetPNG from "../assets/target.png";
import { Math } from "phaser";

export default class Arrive extends Phaser.Scene {
    constructor() {
        super("Arrive");
    }

    preload() {

        this.load.image("boid",BoidPNG);
        this.load.image("target",TargetPNG);
    }

    create() {

        this.slowRadius = 200;
        this.maxSpeed = 500;
        
        this.velocity = Math.Vector2.ZERO;

        this.target = this.add.image(0,0,"target");
        this.target.setRandomPosition();

        
        this.boid = this.physics.add.image(0,0,"boid");
        this.boid.setMass(2);
        this.boid.setCircle(9);
        this.boid.setVelocity(0,0);
        this.boid.body.setAllowRotation(false);

    }

    update(time, delta) {
        
        if (this.input.activePointer.isDown) {
            let x = this.input.activePointer.x;
            let y = this.input.activePointer.y;
            this.target.setPosition(x,y);
        }
        
        let targetPos = new Math.Vector2(this.target.x,this.target.y);
        let boidPos = new Math.Vector2(this.boid.x,this.boid.y);

        if (boidPos.distance(targetPos) >= 0.01){
            let steering = this.calculateSteering();
            
            let newVelocity = new Math.Vector2(
                this.boid.body.velocity.x + steering.x,
                this.boid.body.velocity.y + steering.y,
            );
            this.boid.setVelocity(newVelocity.x,newVelocity.y);
            this.boid.setRotation(this.boid.body.velocity.angle());
        }

    }

    calculateSteering(){
        let targetPosition = new Math.Vector2(this.target.x,this.target.y);
                
        let currentPosition = new Math.Vector2(this.boid.x,this.boid.y);
                
        let desiredVelocity = new Math.Vector2(
            targetPosition.x - currentPosition.x,
            targetPosition.y - currentPosition.y
        );
        
        let distance = desiredVelocity.length();
                        
        if (distance < this.slowRadius){
            desiredVelocity = desiredVelocity.normalize()
            desiredVelocity = desiredVelocity.setLength(this.maxSpeed);
            desiredVelocity = desiredVelocity.scale(distance/this.slowRadius);
        }
        else {
            desiredVelocity = desiredVelocity.normalize();
            desiredVelocity = desiredVelocity.setLength(this.maxSpeed);
        }
        
        let currentVelocity = this.boid.body.velocity;
        let steering = new Math.Vector2(
            desiredVelocity.x - currentVelocity.x,
            desiredVelocity.y - currentVelocity.y
        );
        
        return steering;
    }

}

/*
desiredVelocity = targetPosition - position;
float distance = desiredVelocity.magnitude;
if (distance < SlowingDistance)
    desiredVelocity = Normalize(desiredVelocity) * MaxVelocity * (distance / SlowingDistance);
else
    desiredVelocity = Normalize(desiredVelocity) * MaxVelocity;
Vector3 steering = desiredVelocity - currentVelocity;
return steering; 
*/
