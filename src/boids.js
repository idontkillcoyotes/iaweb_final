export class Boids extends Phaser.Scene {

    constructor() {
        super({ key: 'boids' });
    }

    preload(){
        this.load.setBaseURL('/assets');
        this.load.image("boid", "boid.png");
        this.load.image("target", "target.png");
    }

    create(){
        var target = this.add.sprite(this.width / 2, this.height / 2, "target");
        var boidsAmount = 5;
        var boids = []

        for(var i = 0; i < boidsAmount; i++){
            //var randomPoint = new Phaser.Math.Vector2(Phaser.Math.RND.between(0, 800 - 1), Phaser.Math.RND.between(0, 600 - 1));
            boids[i] = this.physics.add.image(0, 0, "boid");
            boids[i].setRandomPosition
            boids[i].setVelocity(Phaser.Math.RND.between(50,150),Phaser.Math.RND.between(50,150))
            
            //boids[i].speed = Phaser.Math.RND.between(50, 150);            
            //boids[i].force = Phaser.Math.RND.between(5, 25);

            //this.physics.enable(boids[i], Phaser.Physics.ARCADE);
            boids[i].body.allowRotation = false
        }
    }

    update(){
        for(var i = 0; i < this.boidsAmount; i++){
            // direction vector is the straight direction from the boid to the target
            var direction = new Phaser.Math.Vector2(target.x, target.y);
            // now we subtract the current boid position
            direction.subtract(boids[i].x, boids[i].y);
            // then we normalize it. A normalized vector has its length is 1, but it retains the same direction
            direction.normalize();
            // time to set magnitude (length) to boid speed
            direction.setMagnitude(boids[i].speed);
            // now we subtract the current boid velocity
            direction.subtract(boids[i].body.velocity.x, boids[i].body.velocity.y);
            // normalizing again
            direction.normalize();
            // finally we set the magnitude to boid force, which should be WAY lower than its velocity
            direction.setMagnitude(boids[i].force); 
            // Now we add boid direction to current boid velocity
            boids[i].body.velocity.add(direction.x, direction.y);
            // we normalize the velocity
            boids[i].body.velocity.normalize();
            // we set the magnitue to boid speed
            boids[i].body.velocity.setMagnitude(boids[i].speed);
            boids[i].angle = 180 + Phaser.Math.radToDeg(Phaser.Math.Vector2.angle(boids[i].position, new Phaser.Math.Vector2(boids[i].x + boids[i].body.velocity.x, boids[i].y + boids[i].body.velocity.y)));
            if(boids[i].position.distance(this.target.position) < 2){
                 target.x = Phaser.Math.RND.between(10, this.width - 10);
                 target.y = Phaser.Math.RND.between(10, this.height - 10);
            }
       }          
    }
}