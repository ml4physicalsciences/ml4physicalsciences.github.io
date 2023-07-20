let points = [];
let numPoints = 1000;

function setup() {
    let canvas = createCanvas(windowWidth, windowHeight, WEBGL);
    canvas.parent('sketch-holder');

    // Create points on a sphere using the Golden Spiral
    let indices = [...Array(numPoints).keys()];
    let inc = PI * (3 - sqrt(5)); // Golden angle
    for (let i of indices) {
        let y = 200 * (1 - (i / (numPoints - 1)) * 2); // y goes from -200 to 200
        let radius = sqrt(200 * 200 - y * y); // Radius at y

        let phi = i * inc;

        let x = cos(phi) * radius;
        let z = sin(phi) * radius;

        points[i] = createVector(x, y, z);
    }
}

function draw() {
    background(0);

    translate(0, 0, 0);
    rotateX(frameCount * 0.01);
    rotateY(frameCount * 0.01);

    // Calculate displacement based on scroll position
    let scrollPos = window.scrollY / windowHeight;
    let displacement = map(scrollPos, 0, 2, 0, 200);

    blendMode(ADD);

    // Display points
    stroke(255, 128);  // Added alpha value
    strokeWeight(2);
    noFill();
    for (let i = 0; i < points.length; i++) {
        // Morph the sphere into a box-like shape
        let x = constrain(points[i].x + random(-displacement, displacement), -width / 2, width / 2);
        let y = constrain(points[i].y + random(-displacement, displacement), -height / 2, height / 2);
        let z = constrain(points[i].z + random(-displacement, displacement), -width / 2, width / 2);
        point(x, y, z);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}