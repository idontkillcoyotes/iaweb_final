
import Phaser from "phaser"
import { Math } from "phaser"
import { SBArrive,SBEvade,SBFlee,SBPursuit,SBSeek } from "../utils/steering"
import * as BoidImage from "../assets/boid.png"
import * as TargetImage from "../assets/target.png"

enum MODES{
    SEEK = 0,
    FLEE = 1,
    ARRIVE = 2,
    PURSUIT = 3,
    EVADE = 4
}

export default class MainScene extends Phaser.Scene {

    private currentMode: MODES = MODES.ARRIVE
    private maxSpeed: number = 450
    private slowDistance: number = 200
    private farDistance: number = 300

    private target!:Phaser.GameObjects.Image
    private boid!:Phaser.Types.Physics.Arcade.ImageWithDynamicBody

    constructor() {
        super("World");
    }

    preload() {
        this.load.setBaseURL("assets")
        this.load.image("boid",BoidImage)
        this.load.image("target",TargetImage)
    }

    create() {

        this.target = this.add.image(0,0,"target")
        this.target.setRandomPosition()
                
        this.boid = this.physics.add.image(this.scale.width/2,this.scale.height/2,"boid")
        this.boid.setVelocity(0,0)
        this.boid.body.setAllowRotation(false)

    }

    update(time, delta) {
        
        if (this.input.activePointer.isDown) {
            this.target.setPosition(this.input.activePointer.x,this.input.activePointer.y)
        }

        let boidPos = this.boid.body.position
        let targetPos = new Math.Vector2(this.target.x - this.target.width/2 ,this.target.y - this.target.height/2)


        var steering!:Math.Vector2

        switch (this.currentMode){
            case MODES.SEEK:{
                steering = SBSeek(boidPos,targetPos,this.boid.body.velocity,this.maxSpeed)
                break
            }
            case MODES.FLEE:{
                steering = SBFlee(boidPos,targetPos,this.boid.body.velocity,this.maxSpeed,this.farDistance)
                break
            }
            case MODES.ARRIVE:{
                steering = SBArrive(boidPos,targetPos,this.boid.body.velocity,this.maxSpeed,this.slowDistance)
                break
            }   
            case MODES.PURSUIT:{
                steering = SBPursuit(boidPos,targetPos,this.boid.body.velocity,Math.Vector2.ZERO,this.maxSpeed)
                break
            }
            case MODES.EVADE:{
                steering = SBEvade(boidPos,targetPos,this.boid.body.velocity,Math.Vector2.ZERO,this.maxSpeed,this.farDistance)
                break
            }
        }
        
        let newVelocity = new Math.Vector2(
            this.boid.body.velocity.x + steering.x,
            this.boid.body.velocity.y + steering.y,
        )
        
        this.boid.setVelocity(newVelocity.x,newVelocity.y)

        if (!this.boid.body.velocity.fuzzyEquals(Math.Vector2.ZERO))
            this.boid.setRotation(this.boid.body.velocity.angle())
        
    }

}