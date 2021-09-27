import Phaser from "phaser";
import Steering from "../utils/steering";
import BaseScene from "./baseScene";

export enum SteeringMode{
    IDLE = 0,
    SEEK = 1,
    FLEE = 2,
    ARRIVE = 3,
    PURSUIT = 4,
    EVADE = 5,
    WANDER = 6,
    FOLLOWLEADER = 7,
    FLOCK = 8,
    AVOIDCOLLISION = 9
}

export class Boid extends Phaser.Physics.Arcade.Image{

    private currentMode: SteeringMode = SteeringMode.IDLE
    private maxSpeed: number = 400
    private slowDistance: number = 100
    private farDistance: number = 300
    private sightRadius: number = 1500

    public target!: Boid
    public obstacles!: Boid[]

    private timer: number = 0

    constructor(scene: Phaser.Scene,x:number,y:number,tex:string,isStatic:boolean=false){
        super(scene,x,y,tex)
        scene.add.existing(this)
        scene.physics.add.existing(this,isStatic)

        if (tex == "boid") this.setScale(0.8)

        this.setOrigin(0.5)
        this.enableBody(false,x,y,true,true)
        this.setCircle(this.width/2)

        if (!isStatic) this.setVelocity(0,0)

    }

    getScene(){
        return this.scene
    }

    setObstacles(obs){
        this.obstacles = obs
    }

    getRadius(){
        return this.body.radius
    }

    /*
    * Returns the velocity of this boid's body
    */
    getVelocity():Phaser.Math.Vector2{

        if (this.body.velocity.fuzzyEquals(Phaser.Math.Vector2.ZERO,0.01)){
            return new Phaser.Math.Vector2(0,0);
        }
        else{
            return this.body.velocity.clone();
        }
    }

    /*
    * Returns this boid's position
    */
    getPosition():Phaser.Math.Vector2{
        return new Phaser.Math.Vector2(
            this.body.x + this.body.radius,
            this.body.y + this.body.radius
        );
    }

    getMaxSpeed():number{
        return this.maxSpeed;
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

    getNeighbours(radius:number=this.sightRadius){
        return this.scene.physics.overlapCirc(this.x,this.y,radius,true,false)
    }    

    update(time:number,delta:number){

        if (this.currentMode == SteeringMode.IDLE) return

        //TODO: fixear los estados que no son compuestos para sumarle la velocidad

        var steering: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0)

        switch (this.currentMode){
            case SteeringMode.SEEK:{
                steering = Steering.Seek(this,this.target.getPosition())
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)
                break
            }
            case SteeringMode.FLEE:{
                steering = Steering.Flee(this,this.target.getPosition())
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)
                break
            }
            case SteeringMode.ARRIVE:{
                steering = Steering.Arrive(this,this.target.getPosition(),this.slowDistance)
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)                
                break
            }   
            case SteeringMode.PURSUIT:{
                steering = Steering.Pursuit(this,this.target)
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)
                break
            }
            case SteeringMode.EVADE:{                
                steering = Steering.Evade(this,this.target)
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)
                break
            }
            case SteeringMode.WANDER:{
                this.timer += delta
                if (this.timer>=500){
                    steering = Steering.Wander(this,400,300)
                    this.timer = 0
                }
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)       
                break
            }
            case SteeringMode.AVOIDCOLLISION:{                
                steering = Steering.CollisionAvoidance(this,180,this.maxSpeed*0.8,this.obstacles)
                let newVel = this.getVelocity().add(steering).limit(this.getMaxSpeed())
                this.setVelocity(newVel.x,newVel.y)
                break
            }
            case SteeringMode.FOLLOWLEADER:{
                Steering.FollowLeader(this,this.target,this.width*3);                
                break
            }
            case SteeringMode.FLOCK:{                
                
                let values = (this.scene as BaseScene).params

                Steering.Flocking(this,values.alignment,values.cohesion,values.separation,values.seek)

                break
            }
            
            default:{
                steering = Phaser.Math.Vector2.ZERO                
            }                   
  
        }

        if (!this.body.velocity.fuzzyEquals(Phaser.Math.Vector2.ZERO,0.1)){
            this.setRotation(this.body.velocity.angle());       
        }
        else{
            this.setRotation(0)
        }

    }
}