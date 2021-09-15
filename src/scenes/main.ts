
import Phaser from "phaser"
import { Math } from "phaser"
import { SBArrive,SBEvade,SBFlee,SBPursuit,SBSeek } from "../utils/steering"
import * as BoidImage from "../assets/boid.png"
import * as TargetImage from "../assets/target.png"

import { SteeringMode,Boid } from "./boid"

export default class MainScene extends Phaser.Scene {

    private target!:Boid
    private boids:Boid[] = []

    constructor() {
        super("World");
    }

    preload() {
        this.load.setBaseURL("assets")
        this.load.image("boid",BoidImage)
        this.load.image("target",TargetImage)
    }

    create() {

        this.target = new Boid(this,0,0,"target")
        this.target.setRandomPosition()
                
        for (let index = 0; index < 35; index++) {
            const b = new Boid(
                this,
                Phaser.Math.Between(200,400),
                Phaser.Math.Between(200,400),
                "boid"
            )
            this.boids.push(b)
            b.setMode(SteeringMode.FLOCK)
            b.setTarget(this.target)

            if (index>0){
                b.setTarget(this.boids[index-1])
            }
            
        }
      

        var group = this.physics.add.group(this.boids,{
            classType:Boid,
            enable: true
        })

        this.physics.add.collider(group,group)

    }

    update(time, delta) {
        
        if (this.input.activePointer.isDown) {
            this.target.setPosition(this.input.activePointer.x,this.input.activePointer.y)
        }

        this.boids.forEach(element => {
            element.update(time,delta)    
        });
        
        
    }

}