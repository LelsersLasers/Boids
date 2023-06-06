const DRAW_RATIO = 0.01;

const todo = () => console.error("TODO");

const canvas = document.getElementsByTagName("canvas")[0];
// canvas.addEventListener("mousemove", function (event) {
//     const rect = canvas.getBoundingClientRect();

//     const x = event.clientX - rect.left;
//     const y = event.clientY - rect.top;
// });

const context = canvas.getContext("2d");



const flock = new Flock();
{


    for (let i = 0; i < 100; i++) {
        const pos = Vector.randomRect();
        const color = randomColor();
        const boid = new Boid(pos, 1, 0.75, 0.1, Math.PI * 2, 0.75, 1, 1, 1, color);
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


    flock.update(delta);
    flock.render(context);

    // boid1.seek(boid2.pos);

    // boid1.update(delta);
    // boid2.update(delta);

    // boid1.render(context);
    // boid2.render(context);


    // if (!paused) {
    // }

    t1 = performance.now();
    delta = (t1 - t0) / 1000;
    t0 = performance.now();


    window.requestAnimationFrame(render);
}


var t0 = performance.now();
var t1 = performance.now();
var delta = 1 / 60;

window.requestAnimationFrame(render);
