const DRAW_RATIO = 0.01;
const DRAW_ANGLE = Math.PI / 4; // 30 degrees

const todo = () => console.error("TODO");

const canvas = document.getElementsByTagName("canvas")[0];
// canvas.addEventListener("mousemove", function (event) {
//     const rect = canvas.getBoundingClientRect();

//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
// });

const context = canvas.getContext("2d");

{
    BoidSettings.maxSpeed = 0.5;

    BoidSettings.perceptionRadius = 0.1;
    BoidSettings.perceptionAngle = Math.PI * 2;

    BoidSettings.seperationMultiplier = 0.75;

    BoidSettings.separationWeight = 1;
    BoidSettings.alignmentWeight = 1;
    BoidSettings.cohesionWeight = 1;

    BoidSettings.drawMode = true;

    BoidSettings.historyLength = 5;
    BoidSettings.drawHistory = false;
}

const flock = new Flock();
{
    // const colors = [
    //     "#BF616A",
    //     "#D08770",
    //     "#EBCB8B",
    //     "#A3BE8C",
    //     "#B48EAD",
    // ];

    for (let i = 0; i < 50; i++) {
        const pos = Vector.randomRect();
        const color = randomColor();
        // const color = colors[Math.floor(Math.random() * colors.length)];
        const boid = new Boid(pos, color);
        flock.addBoid(boid);
    }
}


let paused = false;

function apply() {
    
    todo();
}


function resize() {
    if (canvas) {
        let maxWidth = (window.innerWidth - 34) * (2 / 3);
        let maxHeight = window.innerHeight - 34;

        let width = Math.min(maxWidth, maxHeight);
        let height = Math.min(maxHeight, maxWidth);

        canvas.width = width;
        canvas.height = height;
    }
}

function togglePause() {
    paused = !paused;
    let text = paused ? "Resume" : "Pause";
    document.getElementById("pauseButton").innerHTML = text;
}

function rgbToFillStyle(r, g, b) {
    // Range: 0 to 1.0
    let scaledR = Math.floor(r * 255);
    let scaledG = Math.floor(g * 255);
    let scaledB = Math.floor(b * 255);

    return "rgb(" + scaledR + "," + scaledG + "," + scaledB + ")";
}
function randomColor() {
    let r = Math.random();
    let g = Math.random();
    let b = Math.random();

    return rgbToFillStyle(r, g, b);
}
  

function render() {
    context.fillStyle = "#3B4252";
    context.fillRect(0, 0, canvas.width, canvas.height);



    if (!paused) {
        flock.update(delta);
    }

    flock.render(context);

    t1 = performance.now();
    delta = (t1 - t0) / 1000;
    t0 = performance.now();

    // const fps = Math.floor(1 / delta);


    window.requestAnimationFrame(render);
}


var t0 = performance.now();
var t1 = performance.now();
var delta = 1 / 60;

window.requestAnimationFrame(render);
