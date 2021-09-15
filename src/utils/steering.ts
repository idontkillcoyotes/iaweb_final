
import {Math} from "phaser";
import { Boid } from "~/scenes/boid";


export function SBAligment(boid:Boid,neighbours): Math.Vector2{

    if (neighbours.length == 0){
        return new Math.Vector2(0,0)
    }

    let force = new Math.Vector2(0,0)
    let count = 0

    neighbours.forEach(element => {
        let v = element.velocity
        force.x += v.x
        force.y += v.y
        count++
    });

    force = force.normalize()

    return force
}


export function SBCohesion(boid:Boid,neighbours): Math.Vector2{

    if (neighbours.length == 0){
        return new Math.Vector2(0,0)
    }

    let force = new Math.Vector2(0,0)
    let count = 0

    neighbours.forEach(element => {
        force.x += element.x
        force.y += element.y
        count++
    });

    force = force.normalize()

    return force
}


export function SBSeparation(boid:Boid,neighbours,maxSeparation:number): Math.Vector2{

    if (neighbours.length == 0){
        return new Math.Vector2(0,0)
    }

    let force = new Math.Vector2(0,0)
    let count = 0

    neighbours.forEach(element => {
        force.x += element.x - boid.x
        force.y += element.y - boid.y
        count++
    });

    force = force.scale(-1)
    force = force.normalize()
    force = force.scale(maxSeparation)

    return force
}

export function SBSeek(boid:Boid,target:Math.Vector2): Math.Vector2 {
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

export function SBArrive(boid:Boid,target:Math.Vector2): Math.Vector2 {
    let desiredVelocity = new Math.Vector2(
            target.x - boid.x,
            target.y - boid.y
    )
        
    let distance= desiredVelocity.length()
    let velocity = boid.getVelocity()
    let maxSpeed = boid.getMaxSpeed()
    let slowRadius = boid.getSlowDistance()
        
    desiredVelocity = desiredVelocity.normalize().setLength(maxSpeed);

    if (distance < slowRadius){        
        desiredVelocity = desiredVelocity.scale(distance/slowRadius);
    }
    
    let steering = new Math.Vector2(
        desiredVelocity.x - velocity.x,
        desiredVelocity.y - velocity.y
    )
        
    return steering
}

export function SBFlee(boid:Boid,target:Math.Vector2): Math.Vector2 {
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

export function SBPursuit(boid:Boid,target:Boid): Math.Vector2 {

    let targetPos = target.getPosition()
    let targetVel = target.getVelocity()

    let distance = boid.getPosition().distance(targetPos)
    let t = distance / target.getMaxSpeed()

    let futurePosition = targetPos.add(targetVel.scale(t))

    return SBArrive(boid,futurePosition)
}

export function SBEvade(boid:Boid,target:Boid): Math.Vector2 {

    let targetPos = target.getPosition()
    let targetVel = target.getVelocity()

    let distance = boid.getPosition().distance(targetPos)
    
    let maxSpeed = boid.getMaxSpeed()
    let velocity = boid.getVelocity()
    let t = distance / maxSpeed

    let futurePosition = targetPos.add(targetVel.scale(t))

    return SBFlee(boid,futurePosition)
}
