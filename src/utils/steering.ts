
import {Math} from "phaser";


export function SBSeek(position:Math.Vector2,target:Math.Vector2,velocity:Math.Vector2,maxSpeed:number): Math.Vector2 {
    let desiredVelocity = new Math.Vector2(
            target.x - position.x,
            target.y - position.y
    );
        
    let distance = desiredVelocity.length();
        
    desiredVelocity = desiredVelocity.normalize()
    desiredVelocity = desiredVelocity.setLength(maxSpeed);
   
    let steering = new Math.Vector2(
        desiredVelocity.x - velocity.x,
        desiredVelocity.y - velocity.y
    );
        
    return steering;
}

export function SBArrive(position:Math.Vector2,target:Math.Vector2,velocity:Math.Vector2,maxSpeed:number,slowRadius:number): Math.Vector2 {
    let desiredVelocity = new Math.Vector2(
            target.x - position.x,
            target.y - position.y
    );
        
    let distance = desiredVelocity.length();
        
    desiredVelocity = desiredVelocity.normalize()
    desiredVelocity = desiredVelocity.setLength(maxSpeed);

    if (distance < slowRadius){        
        desiredVelocity = desiredVelocity.scale(distance/slowRadius);
    }
    
    let steering = new Math.Vector2(
        desiredVelocity.x - velocity.x,
        desiredVelocity.y - velocity.y
    );
        
    return steering;
}

export function SBFlee(position:Math.Vector2,target:Math.Vector2,velocity:Math.Vector2,maxSpeed:number,farDistance:number): Math.Vector2 {
    let desiredVelocity = new Math.Vector2(
            position.x - target.x,
            position.y - target.y
    )
        
    let distance = desiredVelocity.length()
    
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

export function SBPursuit(position:Math.Vector2,target:Math.Vector2,velocity:Math.Vector2,targetVel:Math.Vector2,maxSpeed:number): Math.Vector2 {

    let distance = position.distance(target)
    
    let t = distance / maxSpeed

    let futurePosition = target.add(targetVel.scale(t))

    return SBSeek(position,futurePosition,velocity,maxSpeed)
}

export function SBEvade(position:Math.Vector2,target:Math.Vector2,velocity:Math.Vector2,targetVel:Math.Vector2,maxSpeed:number,farDistance:number): Math.Vector2 {

    let distance = position.distance(target)
    
    let t = distance / maxSpeed

    let futurePosition = target.add(targetVel.scale(t))

    return SBFlee(position,futurePosition,velocity,maxSpeed,farDistance)
}
