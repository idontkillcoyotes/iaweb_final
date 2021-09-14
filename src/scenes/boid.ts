import Phaser from "phaser";
import { SBSeek,SBArrive,SBEvade,SBFlee,SBPursuit } from "../utils/steering";

export enum SteeringMode{
    IDLE = 0,
    SEEK = 1,
    FLEE = 2,
    ARRIVE = 3,
    PURSUIT = 4,
    EVADE = 5
}

export class Boid extends Phaser.Physics.Arcade.Image{

    private currentMode: SteeringMode = SteeringMode.IDLE
    private maxSpeed: number = 450
    private slowDistance: number = 200
    private farDistance: number = 300

    private target!: Boid;

    constructor(scene: Phaser.Scene,x:number,y:number,tex:string){
        super(scene,x,y,tex)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.enableBody(true,x,y,true,true)

        this.setVelocity(0,0)
    }

    /*
    * Returns the velocity of this boid's body
    */
    getVelocity():Phaser.Math.Vector2{
        return this.body.velocity
    }

    /*
    * Returns this boid's position
    */
    getPosition():Phaser.Math.Vector2{
        return new Phaser.Math.Vector2(this.x,this.y)
    }

    getMaxSpeed():number{
        return this.maxSpeed
    }

    getSlowDistance():number{
        return this.slowDistance
    }

    getFarDistance():number{
        return this.farDistance
    }

    getMode():SteeringMode{
        return this.currentMode
    }

    setMode(mode:SteeringMode){
        this.currentMode = mode
    }

    setMaxSpeed(value:number){
        this.maxSpeed = value
    }

    setSlowDistance(value:number){
        this.slowDistance=value
    }

    setFarDistance(value:number){
        this.farDistance=value
    }

    setTarget(t:Boid){
        this.target=t
    }

    update(time:number,delta:number){
        if (this.target){

            var steering!:Phaser.Math.Vector2

            switch (this.currentMode){
                case SteeringMode.SEEK:{
                    steering = SBSeek(this,this.target)
                    break
                }
                case SteeringMode.FLEE:{
                    steering = SBFlee(this,this.target)
                    break
                }
                case SteeringMode.ARRIVE:{
                    steering = SBArrive(this,this.target)
                    break
                }   
                case SteeringMode.PURSUIT:{
                    steering = SBPursuit(this,this.target)
                    break
                }
                case SteeringMode.EVADE:{
                    steering = SBEvade(this,this.target)
                    break
                }
                default:{
                    steering = Phaser.Math.Vector2.ZERO                
                }
            }
            
            let newVelocity = this.body.velocity.add(steering)
            
            this.setVelocity(newVelocity.x,newVelocity.y)

            if (!this.body.velocity.fuzzyEquals(Phaser.Math.Vector2.ZERO))
                this.setRotation(this.body.velocity.angle())
            
        }

    }

}