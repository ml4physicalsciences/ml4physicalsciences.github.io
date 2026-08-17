const ROTATION_SPEED = 0.0000;
const PARTICLE_SPEED_MIN = 1;
const PARTICLE_SPEED_MAX = 2.5;
const CONNECTION_DISTANCE = 140;
const COLLISION_DISTANCE = 30;

let particles = [];
const numParticles = 35;
let collisionParticles = [];

const colors = [
    [255, 200, 200, 75],
    [200, 255, 200, 75],
    [200, 200, 255, 75]
];

function setup() {
    let sketchHolder = document.getElementById('sketch-holder');
    let canvas = createCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight, WEBGL);
    canvas.parent('sketch-holder');
    
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(random(1) > 0.5));
    }
}

function draw() {
    background(10, 30);
    orbitControl();

    rotateY(frameCount * ROTATION_SPEED);
    
    // Draw connections between particles
    stroke(200, 200, 255, 50);
    strokeWeight(0.8);
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let d = p5.Vector.dist(particles[i].pos, particles[j].pos);
            if (d < CONNECTION_DISTANCE) {
                line(particles[i].pos.x, particles[i].pos.y, particles[i].pos.z,
                     particles[j].pos.x, particles[j].pos.y, particles[j].pos.z);
            }
        }
    }
    
    // Update and display particles, check for collisions
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
        
        for (let j = i + 1; j < particles.length; j++) {
            if (particles[i].checkCollision(particles[j])) {
                let collisionPoint = p5.Vector.add(particles[i].pos, particles[j].pos).div(2);
                createCollisionParticles(collisionPoint);
                
                // Collision response
                let normal = p5.Vector.sub(particles[j].pos, particles[i].pos).normalize();
                let relativeVelocity = p5.Vector.sub(particles[i].vel, particles[j].vel);
                let separatingVelocity = p5.Vector.dot(relativeVelocity, normal);
                let impulse = 2 * separatingVelocity / (particles[i].mass + particles[j].mass);
                
                particles[i].vel.sub(p5.Vector.mult(normal, impulse * particles[j].mass));
                particles[j].vel.add(p5.Vector.mult(normal, impulse * particles[i].mass));
                
                // Slightly separate particles to prevent sticking
                let separation = normal.copy().mult(0.5);
                particles[i].pos.sub(separation);
                particles[j].pos.add(separation);
            }
        }
    }
    
    // Update and display collision particles
    for (let i = collisionParticles.length - 1; i >= 0; i--) {
        collisionParticles[i].update();
        collisionParticles[i].display();
        if (collisionParticles[i].isDead()) {
            collisionParticles.splice(i, 1);
        }
    }
}

class Particle {
    constructor(isLeft) {
        this.mass = 1;
        this.reset(isLeft);
        this.color = random(colors);
    }
    
    reset(isLeft = random(1) > 0.5) {
        this.pos = createVector(isLeft ? -width/2 : width/2, random(-height/2, height/2), random(-100, 100));
        this.vel = createVector(
            isLeft ? random(PARTICLE_SPEED_MIN, PARTICLE_SPEED_MAX) : random(-PARTICLE_SPEED_MAX, -PARTICLE_SPEED_MIN), 
            random(-0.5, 0.5), 
            random(-0.5, 0.5)
        );
        this.size = random(4, 7);
        this.isLeft = isLeft;
    }
    
    update() {
        this.pos.add(this.vel);
        
        if (this.pos.x > width/2 || this.pos.x < -width/2 || 
            this.pos.y > height/2 || this.pos.y < -height/2 || 
            this.pos.z > 100 || this.pos.z < -100) {
            this.reset(this.isLeft);
        }
    }
    
    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        noStroke();
        fill(this.color);
        sphere(this.size);
        pop();
    }
    
    checkCollision(other) {
        let d = p5.Vector.dist(this.pos, other.pos);
        return d < COLLISION_DISTANCE;
    }
}

class CollisionParticle {
    constructor(pos) {
        this.pos = pos.copy();
        this.vel = p5.Vector.random3D().mult(random(1, 3));
        this.size = random(1, 3);
        this.life = 60;
        this.color = random(colors);
    }
    
    update() {
        this.pos.add(this.vel);
        this.life--;
        this.vel.mult(0.95);
    }
    
    display() {
        push();
        translate(this.pos.x, this.pos.y, this.pos.z);
        noStroke();
        fill(this.color[0], this.color[1], this.color[2], map(this.life, 60, 0, this.color[3], 0));
        sphere(this.size);
        pop();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

function createCollisionParticles(pos) {
    for (let i = 0; i < 10; i++) {  // Increased number of particles for more visible effect
        collisionParticles.push(new CollisionParticle(pos));
    }
}

function windowResized() {
    let sketchHolder = document.getElementById('sketch-holder');
    resizeCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
}