
import {Math} from "phaser";
import { Boid } from "~/scenes/boid";
import MainScene from "~/scenes/baseScene";
import { Vector } from "matter";



export default class Steering {


    public static Aligment(boid:Boid,includeTarget:boolean=false): Math.Vector2{

        let neighbours = boid.getNeighbours()
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let force = new Math.Vector2(0,0)
        let count = 0
    
        neighbours.forEach(element => {
            if (!includeTarget && !(boid.target === element)){                
                const v = element.velocity
                force.x += v.x
                force.y += v.y
                count++
            }
        });
    
        //force = force.normalize()
    
        return force
    }
    
    public static Wander(boid:Boid,circleDistance:number,circleRadius:number):Math.Vector2{
    
        let circleCenter = boid.getVelocity().normalize()
        circleCenter = circleCenter.scale(circleDistance)
    
        let randomAngle = Math.FloatBetween(-0.5,0.5)
    
        let displacement = new Math.Vector2(0,-1) // Vector up
        displacement = displacement.scale(circleRadius) // Scale to circle radius
    
        displacement = displacement.setAngle(randomAngle)
    
        let wanderForce = circleCenter.add(displacement)
    
        return wanderForce
    
    }
    
    public static CollisionAvoidance(boid:Boid,maxAvoidForce:number,obstacles,debug:boolean=false):Math.Vector2 {
    
        let pos = boid.getPosition();
        let vel = boid.getVelocity();
        let dir = vel.clone().normalize();
        let speed = vel.clone().length();

        const dx = pos.x + ((dir.x*15) + vel.x/5);
        const dy = pos.y + ((dir.y*15) + vel.y/5);

        let line = new Phaser.Geom.Line(pos.x ,pos.y , dx , dy );

        let closest = getClosest(obstacles,line);
        
        var avoidance = new Math.Vector2(0,0);
    
        if (closest != null){
            let closePos = closest.getPosition();
            avoidance = new Math.Vector2(
                dx - closePos.x,
                dy - closePos.y
            )
            avoidance = avoidance.setLength(50+speed/5);
                
        };

        let force = new Phaser.Geom.Line(pos.x, pos.y, pos.x + avoidance.x, pos.y + avoidance.y)

        if (debug){
            (boid.scene as MainScene).graphics.clear();
            (boid.scene as MainScene).graphics.strokeLineShape(line);
            (boid.scene as MainScene).graphics.strokeLineShape(force);
        };
    
    
        return avoidance;
    }
    
    public static FollowLeader (boid:Boid,leader:Boid,distance:number):Math.Vector2 {
        
        let force = new Math.Vector2(0,0);
    
        let lv = leader.getVelocity();
        lv = lv.setLength(distance);
    
        let ahead = leader.getPosition().add(lv);
    
        lv = lv.scale(-1);
        let behind = leader.getPosition().add(lv);
    
        if (isOnLeaderSight(leader,ahead,distance*2,boid.getPosition())){
            force = force.add(this.Evade(boid,leader));
        };
    
        force = force.add(this.Arrive(boid,behind,distance));
    
        force = force.add(this.Separation(boid,boid.getMaxSpeed()/2,false));
    
        if (force.fuzzyEquals(Math.Vector2.ZERO, 0.01)){
            force = new Math.Vector2(0,0)
        }

        return force;
    }
    
   
    public static Cohesion(boid:Boid,includeTarget:boolean=false): Math.Vector2{
    
        let neighbours = boid.getNeighbours()
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let force = new Math.Vector2(0,0)
        let count = 0
    
        neighbours.forEach(element => {
            if (!includeTarget && !(boid.target === element)){                
                force.x += element.x
                force.y += element.y
                count++
            }           
        });
    
        //force = force.normalize()
    
        return force
    }
    
    
    public static Separation(boid:Boid,maxSeparation:number,includeTarget:boolean=false): Math.Vector2{
        let neighbours = boid.getNeighbours()
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let force = new Math.Vector2(0,0)
        let count = 0
    
        neighbours.forEach(element => {
            if (!includeTarget && !(boid.target === element)){           
                force.x += element.x - boid.x
                force.y += element.y - boid.y
                count++
            }
        });
    
        force = force.scale(-1)
        force = force.normalize()
        force = force.scale(maxSeparation)
    
        return force
    }
    
    public static Seek(boid:Boid,target:Math.Vector2): Math.Vector2 {
        let desiredVelocity = new Math.Vector2(
                target.x - boid.x,
                target.y - boid.y
        )
        
        let maxSpeed = boid.getMaxSpeed()
        let velocity = boid.getVelocity()
    
        desiredVelocity = desiredVelocity.normalize().setLength(maxSpeed);
       
        let steering = new Math.Vector2(
            desiredVelocity.x - velocity.x,
            desiredVelocity.y - velocity.y
        )
            
        return steering
    }
    
    public static Flocking(boid: Boid,maxSeparation:number,alignFactor:number=1.0,cohesionFactor:number=1.0,separationFactor:number=1.0): Math.Vector2{

        

        let alignment = this.Aligment(boid).scale(alignFactor)
        let cohesion = this.Cohesion(boid).scale(cohesionFactor)
        let separation = this.Separation(boid,maxSeparation).scale(separationFactor)

        let force = new Math.Vector2(
            alignment.x + cohesion.x + separation.x,
            alignment.y + cohesion.y + separation.y,
        )

        //force = force.normalize()

        return force
    }

    public static Arrive(boid:Boid,target:Math.Vector2,radius:number): Math.Vector2 {
        let desiredVelocity = new Math.Vector2(
                target.x - boid.x,
                target.y - boid.y
        )
            
        let distance= desiredVelocity.length()
        let velocity = boid.getVelocity()
        let maxSpeed = boid.getMaxSpeed()
        let slowRadius = boid.getSlowDistance()
            
        desiredVelocity = desiredVelocity.normalize().setLength(maxSpeed);
    
        if (distance < radius){        
            desiredVelocity = desiredVelocity.scale(distance/slowRadius);
        }
        
        let steering = new Math.Vector2(
            desiredVelocity.x - velocity.x,
            desiredVelocity.y - velocity.y
        )
            
        return steering
    }
    
    public static Flee(boid:Boid,target:Math.Vector2): Math.Vector2 {
        let desiredVelocity = new Math.Vector2(
            boid.x - target.x,
            boid.y - target.y
        )
            
        let distance = desiredVelocity.length()
        let farDistance = boid.getFarDistance()
        let velocity = boid.getVelocity()
        let maxSpeed = boid.getMaxSpeed()
            
        if (distance < farDistance){        
            desiredVelocity = desiredVelocity.normalize()
            desiredVelocity = desiredVelocity.setLength(maxSpeed)
        }
        else{
            desiredVelocity = new Math.Vector2(0,0)
        }    
       
        let steering = new Math.Vector2(
            desiredVelocity.x - velocity.x,
            desiredVelocity.y - velocity.y
        )        
        return steering
    }
    
    public static Pursuit(boid:Boid,target:Boid): Math.Vector2 {
    
        let targetPos = target.getPosition()
        let targetVel = target.getVelocity()
    
        let distance = boid.getPosition().distance(targetPos)
        let t = distance / target.getMaxSpeed()
    
        let futurePosition = targetPos.add(targetVel.scale(t))
    
        return this.Arrive(boid,futurePosition,boid.getSlowDistance())
    }
    
    public static Evade(boid:Boid,target:Boid): Math.Vector2 {
    
        let targetPos = target.getPosition()
        let targetVel = target.getVelocity()
    
        let distance = boid.getPosition().distance(targetPos)
        
        let maxSpeed = boid.getMaxSpeed()
        let t = distance / maxSpeed
    
        let futurePosition = targetPos.add(targetVel.scale(t))
    
        return this.Flee(boid,futurePosition)
    }
    


}

function isOnLeaderSight(leader:Boid, leaderAhead:Math.Vector2, leaderSight:number, position: Math.Vector2) :boolean {
    
    let distanceToAhead = position.distance(leaderAhead)
    let distanceToLeader = position.distance(leader.getPosition())

    return distanceToAhead <= leaderSight || distanceToLeader <= leaderSight
}

function getClosest(objects,sightLine:Phaser.Geom.Line): Boid {
    
    var closest!: Boid
    
    objects.forEach(element => {
        const circle: Phaser.Geom.Circle = new Phaser.Geom.Circle(element.x,element.y,element.getRadius())
        const collision: boolean = Phaser.Geom.Intersects.LineToCircle(sightLine,circle)
        const boidPosition = sightLine.getPointA()
         
        const distanceToCurrent = boidPosition.distance(element.getPosition())

        if (collision && (closest == null || distanceToCurrent < boidPosition.distance(closest.getPosition()))){
            closest = element
    
        }      

    });

    return closest
}
