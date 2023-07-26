let points = [];
let numPoints = 600;

async function setup() {
    let sketchHolder = document.getElementById('sketch-holder');

    let canvas = createCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight, WEBGL);
    canvas.parent('sketch-holder');

    // Fetch the coordinates from the server
    let response = await fetch('assets/js/galaxy_coordinates.txt');
    let text = await response.text();
    let lines = text.split('\n');

    // Scale factor for the coordinates
    let scale = 300;

    // Parse each line and create a vector for each galaxy
    for (let i = 0; i < lines.length; i++) {
        let [x, y, z] = lines[i].split(' ').map(Number);
        points[i] = createVector(x * scale, y * scale, z * scale);
    }
    // rest of your setup code...
}
function draw() {
    // background(0);
    clear();
    translate(0, -25, 0);
    rotateX(frameCount * 0.0005);
    rotateY(frameCount * 0.0005);

    // Calculate displacement based on scroll position
    let scrollPos = window.scrollY / windowHeight;
    let displacement = map(scrollPos, 0, 2, 0, 50);

    blendMode(ADD);

    // Display points
    stroke(255, 128);  // Added alpha value
    strokeWeight(3.0);
    noFill();
    for (let i = 0; i < points.length; i++) {
        // // Morph the sphere into a box-like shape
        // let x = constrain(points[i].x + random(-displacement, displacement), -width / 2, width / 2);
        // let y = constrain(points[i].y + random(-displacement, displacement), -height / 2, height / 2);
        // let z = constrain(points[i].z + random(-displacement, displacement), -width / 2, width / 2);
        // Morph the sphere without constraint
        let x = points[i].x + random(-displacement, displacement);
        let y = points[i].y + random(-displacement, displacement);
        let z = points[i].z + random(-displacement, displacement);
        point(x, y, z);
    }
}

function windowResized() {
    let sketchHolder = document.getElementById('sketch-holder');
    resizeCanvas(sketchHolder.offsetWidth, sketchHolder.offsetHeight);
}