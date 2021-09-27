
import Phaser from "phaser"

import { Boid } from "./boid"

export default class BaseScene extends Phaser.Scene {

    protected focused: boolean = true

    protected target!:Boid
    protected boids:Boid[] = []
    protected obstacles:Boid[] = []

    public boidGroup!: Phaser.Physics.Arcade.Group    
    public graphics!: Phaser.GameObjects.Graphics

    protected keyname!: string

    protected controls
    protected enableCameraPan: boolean = true

    public params = {
        "alignment":1.0,
        "cohesion":1.0,
        "separation":1.0,
        "seek":1.0
    }

    constructor(name:string) {
        super({
            key: name
        });
        this.keyname = name
    }
    
    preload() {
        this.load.setBaseURL("assets")
        this.load.image("boid","boid.png")
        this.load.image("target","target.png")
        this.load.image("obstacle","obstacle.png")
    }
    
    create() {
        this.createGraphics();
        this.createTarget();    
        this.createBoids();
        
        const cursors = this.input.keyboard.createCursorKeys();        

        const controlConfig = {
            camera: this.cameras.main,
            left: cursors.left,
            right: cursors.right,
            up: cursors.up,
            down: cursors.down,
            zoomOut: this.input.keyboard.addKey('Q'),
            zoomIn: this.input.keyboard.addKey('E'),
            acceleration: 0.2,
            drag: 0.01,
            maxSpeed: 2.0
        };

        this.controls = new Phaser.Cameras.Controls.SmoothedKeyControl(controlConfig);

        this.input.on('gameout',this.unFocus);    
        this.input.on('gameover',this.setFocus);

    }

    update(time:number,delta:number){
        this.moveTarget();
        this.updateBoids(time,delta);
        if (this.enableCameraPan){
            this.controls.update(delta);
        }
    }



    setFocus(){
        this.focused = true
    }
    unFocus(){
        this.focused = false
    }

    getSceneSize():Phaser.Math.Vector2{
        return new Phaser.Math.Vector2(
            this.cameras.main.displayWidth,
            this.cameras.main.displayHeight
        );
    }

    createBoids():void {
        throw new Error("Method not implemented.")
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

            if (this.obstacles.length>0){
                this.physics.add.collider(this.obstacles,this.boidGroup)
            }
        }
    }

    createTarget(){
        this.target = new Boid(this,0,0,"target")
        this.target.setRandomPosition()
        this.target.setTint(0xff33ee)
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
        let cameraSpeed = 4
        let xbegin = 70
        let ybegin = 70        
        let xend = this.scale.width - xbegin
        let yend = this.scale.height - ybegin
              
        let pointerPos = this.input.activePointer.position;

        if (this.focused){
            if (this.enableCameraPan){
                if (pointerPos.x <= xbegin && pointerPos.x >=0) this.cameras.main.scrollX -= cameraSpeed
                if (pointerPos.x >= xend && pointerPos.x<=this.scale.width) this.cameras.main.scrollX += cameraSpeed
                if (pointerPos.y <= ybegin && pointerPos.y >=0) this.cameras.main.scrollY -= cameraSpeed
                if (pointerPos.y >= yend && pointerPos.x<=this.scale.height) this.cameras.main.scrollY += cameraSpeed
            }
            let targetPos = this.cameras.main.getWorldPoint(pointerPos.x,pointerPos.y);
            if (this.input.activePointer.isDown) {
                    this.target.setPosition(targetPos.x,targetPos.y);
            }
        }
        
    }

}
