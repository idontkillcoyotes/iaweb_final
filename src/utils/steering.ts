
import { Math } from "phaser";
import { Boid } from "~/scenes/boid";
import BaseScene from "~/scenes/baseScene";
import MainScene from "~/scenes/mainScene";
import { select_multiple_value } from "svelte/internal";


export default class Steering {

    public static Seek(boid:Boid,target:Math.Vector2): Math.Vector2 {
        let desiredVelocity = new Math.Vector2(
                target.x - boid.x,
                target.y - boid.y
        )
        
        let maxSpeed = boid.getMaxSpeed()
        let velocity = boid.getVelocity()
    
        desiredVelocity = desiredVelocity.normalize()
        desiredVelocity = desiredVelocity.setLength(maxSpeed)
        desiredVelocity = desiredVelocity.limit(maxSpeed);
       
        let steering = new Math.Vector2(
            desiredVelocity.x - velocity.x,
            desiredVelocity.y - velocity.y
        )
            
        return steering
    }

    public static Arrive(boid:Boid,target:Math.Vector2,radius:number): Math.Vector2 {
        let desiredVelocity = new Math.Vector2(
                target.x - boid.x,
                target.y - boid.y
        )
            
        let distance= desiredVelocity.length()
        let velocity = boid.getVelocity()
        let maxSpeed = boid.getMaxSpeed()
            
        desiredVelocity = desiredVelocity.normalize()
        desiredVelocity = desiredVelocity.setLength(maxSpeed)
        desiredVelocity = desiredVelocity.limit(maxSpeed);
    
        if (distance < radius){        
            desiredVelocity = desiredVelocity.scale(distance/radius);
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
            desiredVelocity = desiredVelocity.limit(maxSpeed);
        }
        else{
            let dist = Math.Clamp(1000/(distance - farDistance),0,maxSpeed)
            desiredVelocity = desiredVelocity.normalize()
            desiredVelocity = desiredVelocity.setLength(dist)
            //desiredVelocity = desiredVelocity.limit(maxSpeed);
        }    
       
        let steering = new Math.Vector2(
            desiredVelocity.x - velocity.x,
            desiredVelocity.y - velocity.y
        )        
        return steering
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

    public static Wander(boid:Boid,circleDistance:number,circleRadius:number):Math.Vector2{
    
        let circleCenter = boid.getVelocity().normalize()
        circleCenter = circleCenter.scale(circleDistance)
    
        let randomAngle = Math.FloatBetween(-2,2)
    
        let displacement = new Math.Vector2(0,-1) // Vector up
        displacement = displacement.setLength(circleRadius) // Scale to circle radius
    
        displacement = displacement.setAngle(randomAngle)
    
        let wanderForce = circleCenter.add(displacement)

        wanderForce = wanderForce.normalize()
        wanderForce = wanderForce.setLength(boid.getMaxSpeed())
        

        let velocity = boid.getVelocity()
        let steering = new Math.Vector2(
            wanderForce.x - velocity.x,
            wanderForce.y - velocity.y
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

    public static AligmentForce(boid:Boid): Math.Vector2{

        let neighbours = boid.getNeighbours()
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let force = new Math.Vector2(0,0)
        let count = 0
    
        for (let i=0; i < neighbours.length; i++){
            const element: Boid = neighbours[i].gameObject as Boid
            force.add(element.getVelocity())
            count++
        }

        if (count > 1){
            force.x = force.x / count;
            force.y = force.y / count;
        }            

        //force = force.normalize()

        return force
    }
    
    public static CohesionForce(boid:Boid): Math.Vector2{
    
        let neighbours = boid.getNeighbours()
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let massCenter = new Math.Vector2(0,0)
        let count = 0
    
        for (let i=0; i < neighbours.length; i++){
            const element: Boid = neighbours[i].gameObject as Boid
            massCenter.add(element.getPosition());
            count++;
        }
    
        if (count > 1){
            massCenter.x = massCenter.x / count;
            massCenter.y = massCenter.y / count;
        }

        let boidPos = boid.getPosition()

        let direction = new Math.Vector2(
            massCenter.x - boidPos.x,
            massCenter.y - boidPos.y
        )
    
        //direction = direction.normalize()

        return direction
    }

    public static SeparationForce(boid:Boid,includeTarget:boolean=true): Math.Vector2{
        let neighbours = boid.getNeighbours(100)
    
        if (neighbours.length == 0){
            return new Math.Vector2(0,0)
        }
    
        let force = new Math.Vector2(0,0)
        let count = 0
    
        let boidPos = boid.getPosition()
        for (let i=0; i < neighbours.length; i++){
            const element: Boid = neighbours[i].gameObject as Boid
            if (!includeTarget && (boid.target != null) && (boid.target === element)){
                continue
            }
            let elementPos = element.getPosition();
            force.x += elementPos.x - boidPos.x;
            force.y += elementPos.y - boidPos.y;
            count++;
        }

        if (count>1){
            force.x = force.x / count;
            force.y = force.y / count;
        }

        force = force.scale(-1)
        //force = force.normalize()

        return force
    }
    
    public static CollisionAvoidance(boid:Boid,maxSeeAhead:number,maxAvoidForce:number,obstacles:Boid[],debug:boolean=false):Math.Vector2 {
    
        let position = boid.getPosition()
        let direction = boid.getVelocity().normalize()
        
        let speed = boid.getVelocity().length()
        let speedNormalized = speed / boid.getMaxSpeed()

        let seeAheadScaled = maxSeeAhead * speedNormalized

        let ahead = new Math.Vector2(
            position.x + direction.x * seeAheadScaled,
            position.y + direction.y * seeAheadScaled
        )
        let ahead2 = new Math.Vector2(
            position.x + direction.x * seeAheadScaled * 0.5,
            position.y + direction.y * seeAheadScaled * 0.5
        )
        let ahead3 = new Math.Vector2(
            position.x + direction.x * seeAheadScaled * 0.25,
            position.y + direction.y * seeAheadScaled * 0.25
        )
        let ahead4 = new Math.Vector2(
            position.x + direction.x * seeAheadScaled * 0.75,
            position.y + direction.y * seeAheadScaled * 0.75
        )

        let closest = findMostThreateningObstacle(boid,obstacles,ahead,ahead2,ahead3,ahead4)
        
        var avoidance = new Math.Vector2(0,0);
    
        if (closest != null){
            let closePos = closest.getPosition();
            avoidance = new Math.Vector2(
                ahead.x - closePos.x,
                ahead.y - closePos.y
            )
            avoidance = avoidance.normalize()
            avoidance = avoidance.setLength(maxAvoidForce)
        };

        let arrive = this.Arrive(boid,boid.target.getPosition(),boid.getSlowDistance())
        
        let steering = arrive.add(avoidance).limit(boid.getMaxSpeed())


        if (debug){
            let graphics = (boid.scene as BaseScene).graphics

            graphics.clear()
            graphics.lineBetween(
                position.x,position.y,ahead.x,ahead.y
            )

        }

        return steering
    }

    public static FollowLeader (boid:Boid,leader:Boid,distance:number) {
  
        let lv = leader.getVelocity();
        lv = lv.setLength(distance);
    
        let ahead = leader.getPosition().add(lv);
    
        lv = lv.scale(-1);
        let behind = leader.getPosition().add(lv);
        
        let arrive = this.Arrive(boid,behind,distance)
        
        let evade = new Math.Vector2(0,0)
        if (isOnLeaderSight(leader,ahead,distance,boid.getPosition())){
            evade = this.Evade(boid,leader)
        };

        let separation = this.SeparationForce(boid,false)

        let steering = new Math.Vector2(
            separation.x + arrive.x + evade.x,
            separation.y + arrive.y + evade.y
        )

        let distToBehind = boid.getPosition().distance(behind)
        if ( distToBehind<=boid.width*3 ){            
            steering = steering.normalize()
        }

        // add arrive steering force
        let newVel = boid.getVelocity().add(steering).limit(boid.getMaxSpeed())
        boid.setVelocity(newVel.x,newVel.y)

    }

    public static Flocking(boid: Boid,alignFactor:number=1.0,cohesionFactor:number=1.0,separationFactor:number=1.0,seekFactor:number=1.0){

        let targetPos = boid.target.getPosition()
        let boidPos = boid.target.getPosition()
        let velocity = boid.getVelocity()

        let alignment = this.AligmentForce(boid)
        let cohesion = this.CohesionForce(boid)
        let separation = this.SeparationForce(boid)

        let desired_velocity = new Math.Vector2(
            targetPos.x - boidPos.x,
            targetPos.y - boidPos.y
        )
                
        let force = new Math.Vector2(
            alignment.x*alignFactor + cohesion.x*cohesionFactor + separation.x*separationFactor,
            alignment.y*alignFactor + cohesion.y*cohesionFactor + separation.y*separationFactor,
        )

        force = force.limit(boid.getMaxSpeed());

        let newVel = boid.getVelocity().add(force).limit(boid.getMaxSpeed())
        boid.setVelocity(newVel.x,newVel.y)

        let seek = this.Seek(boid,boid.target.getPosition()).normalize().scale(seekFactor)
        newVel = boid.getVelocity().add(seek).limit(boid.getMaxSpeed())

        boid.setVelocity(newVel.x,newVel.y)
    }
}

function isOnLeaderSight(leader:Boid, leaderAhead:Math.Vector2, leaderSight:number, position: Math.Vector2) :boolean {
    
    let distanceToAhead = position.distance(leaderAhead)
    let distanceToLeader = position.distance(leader.getPosition())

    return distanceToAhead <= leaderSight || distanceToLeader <= leaderSight
}


function findMostThreateningObstacle(boid:Boid,obstacles:Boid[],ahead:Math.Vector2,ahead2:Math.Vector2,ahead3:Math.Vector2,ahead4:Math.Vector2):Boid {
	var mostThreatening:Boid | null = null;

	for (let i = 0; i < obstacles.length; i++) {
		const obstacle : Boid = obstacles[i];
		
        const collision : boolean = lineIntersectsCircle(ahead, ahead2, ahead3, ahead4, obstacle);

        const boidPos = boid.getPosition()
        const obsPos = obstacle.getPosition()

        //@ts-ignore
		if (collision){
            let distToCurrent = boidPos.distance(obsPos)
            if (mostThreatening == null){
                mostThreatening = obstacle
            }
            else{
                //@ts-ignore
                let distToMost = boidPos.distance(mostThreatening.getPosition())
                if (distToCurrent < distToMost){
                    mostThreatening = obstacle
                }
            }
		}

	}
    //@ts-ignore
	return mostThreatening;
}

function lineIntersectsCircle(ahead:Math.Vector2 , ahead2:Math.Vector2, ahead3:Math.Vector2, ahead4:Math.Vector2, obstacle:Boid):boolean {
    let center = obstacle.getPosition()
    let radius = obstacle.getRadius()+5

    let collision1 = center.distance(ahead)<=radius
    let collision2 = center.distance(ahead2)<=radius
    let collision3 = center.distance(ahead3)<=radius
    let collision4 = center.distance(ahead4)<=radius

	return (collision1 || collision2 || collision3 || collision4)
}