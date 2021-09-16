
import Phaser from "phaser"

import * as BoidImage from "../assets/boid.png"
import * as TargetImage from "../assets/target.png"
import * as ObstacleImage from "../assets/obstacle.png"

import { SteeringMode,Boid } from "./boid"

export default class BaseScene extends Phaser.Scene {

    protected target!:Boid
    protected boids:Boid[] = []
    protected obstacles:Boid[] = []

    public boidGroup!: Phaser.Physics.Arcade.Group    
    public graphics!: Phaser.GameObjects.Graphics

    constructor(config:string) {
        super(config);
    }
    
    preload() {
        this.load.setBaseURL("assets")
        this.load.image("boid",BoidImage)
        this.load.image("target",TargetImage)
        this.load.image("obstacle",ObstacleImage)
    }
    
    create() {
        this.createGraphics();
        this.createTarget();    
        this.createBoids();
        this.createColliders();
    }

    getSceneSize():Phaser.Math.Vector2{
        return new Phaser.Math.Vector2(
            this.scale.width/2,
            this.scale.height/2
        );
    }

    createBoids():void {
        throw new Error("Method not implemented.")
    }

    update(time:number,delta:number){
        this.moveTarget();
        this.updateBoids(time,delta);
    }

    updateBoids(time,delta){
        this.boids.forEach(element => {
            element.update(time,delta)    
        });
    }

    createColliders(){
        if (this.boids.length>0){
            this.boidGroup = this.physics.add.group(this.boids,{
                classType:Boid
            });
            this.physics.add.collider(this.boidGroup,this.boidGroup);
        }
    }

    createTarget(){
        this.target = new Boid(this,0,0,"target")
        this.target.setRandomPosition()
    }


    createGraphics(){
        this.graphics = this.add.graphics({
            lineStyle: {
                width: 1,
                color: 0xffffff,
                alpha: 1
            }
        })
    }

    moveTarget(){
        if (this.input.activePointer.isDown) {
            this.target.setPosition(this.input.activePointer.x,this.input.activePointer.y)
        }
    }

}