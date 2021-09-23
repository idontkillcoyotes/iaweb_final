import Phaser from "phaser";
import Steering from "../utils/steering";

export enum SteeringMode{
    IDLE = 0,
    SEEK = 1,
    FLEE = 2,
    ARRIVE = 3,
    PURSUIT = 4,
    EVADE = 5,
    FOLLOWLEADER = 6,
    FLOCK = 7,
    AVOIDCOLLISION = 8
}

export class Boid extends Phaser.Physics.Arcade.Image{

    private currentMode: SteeringMode = SteeringMode.IDLE
    private maxSpeed: number = 400
    private slowDistance: number = 100
    private farDistance: number = 400
    private sightRadius: number = 6000

    public target!: Boid
    public obstacles!: Boid[]

    constructor(scene: Phaser.Scene,x:number,y:number,tex:string){
        super(scene,x,y,tex)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        if (tex == "boid") this.setScale(0.8)

        this.setOrigin(0.5)
        
        this.enableBody(true,x,y,true,true)

        this.setVelocity(0,0)

        this.setCircle(this.width/2)
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

    getNeighbours(){
        return this.scene.physics.overlapCirc(this.x,this.y,this.sightRadius,true,false)
    }    

    update(time:number,delta:number){

        if (this.currentMode == SteeringMode.IDLE) return


        var steering: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0,0)

        switch (this.currentMode){
            case SteeringMode.SEEK:{
                steering = Steering.Seek(this,this.target.getPosition())
                break
            }
            case SteeringMode.FLEE:{
                steering = Steering.Flee(this,this.target.getPosition())
                break
            }
            case SteeringMode.ARRIVE:{
                steering = Steering.Arrive(this,this.target.getPosition(),this.slowDistance)
                break
            }   
            case SteeringMode.PURSUIT:{
                steering = Steering.Pursuit(this,this.target)
                break
            }
            case SteeringMode.EVADE:{
                steering = Steering.Evade(this,this.target)
                break
            }
            case SteeringMode.FLOCK:{

                let mouse = new Phaser.Math.Vector2(
                    this.scene.input.activePointer.x,
                    this.scene.input.activePointer.y
                )
                
                steering = Steering.Seek(this,mouse)

                steering = steering.add(Steering.Flocking(this,1.0,1.0,1.5,this.maxSpeed))

                steering = steering.normalize()
                break
            }
            case SteeringMode.FOLLOWLEADER:{

                if (this.target.getVelocity().fuzzyEquals(Phaser.Math.Vector2.ZERO))
                    steering = Phaser.Math.Vector2.ZERO;
                else
                    steering = Steering.FollowLeader(this,this.target,60);
                break
            }
            case SteeringMode.AVOIDCOLLISION:{

                steering = Steering.Arrive(this,this.target.getPosition(),this.slowDistance)

                steering = steering.add(Steering.CollisionAvoidance(this,this.maxSpeed/2,this.obstacles,true))

                break
            }
            
            default:{
                steering = Phaser.Math.Vector2.ZERO                
            }                   
  
        }

        
        let newVelocity = this.getVelocity().add(steering);
            
        this.setVelocity(newVelocity.x,newVelocity.y)

        if (!this.body.velocity.fuzzyEquals(Phaser.Math.Vector2.ZERO,0.01)){
            this.setRotation(this.body.velocity.angle());       
        }

    }
}