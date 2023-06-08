const DRAW_RATIO = 0.01;
const DRAW_ANGLE = Math.PI / 4; // 30 degrees

const SPATIAL_GRID_COUNT = 10;
const SPATIAL_GRID_SIZE = 1 / SPATIAL_GRID_COUNT;
const HASH = (pos) => Math.floor(pos.x / SPATIAL_GRID_SIZE) + Math.floor(pos.y / SPATIAL_GRID_SIZE) * SPATIAL_GRID_COUNT;

const VARIATIONS = [];
{ 
    const changes = [-1, 0, 1];
    for (let i = 0; i < changes.length; i++) {
        const x = changes[i];
        for (let j = 0; j < changes.length; j++) {
            const y = changes[j];
            if (x == 0 && y == 0) continue;
            VARIATIONS.push(new Vector(x, y));
        }
    }
}

const SPECIES_COLORS = [
    "#BF616A",
    "#D08770",
    "#EBCB8B",
    "#A3BE8C",
    "#B48EAD",
];

const mouseObstacle = new Obstacle(Vector.zero(), 0.05);

const canvas = document.getElementsByTagName("canvas")[0];
canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pos = new Vector(x / canvas.width, y / canvas.height);
    mouseObstacle.pos = pos;
});

const context = canvas.getContext("2d");

{
    BoidSettings.maxVel = 0.33;
    BoidSettings.maxAcc = 5;
    BoidSettings.accMultiplier = 7.5;
    BoidSettings.instantAcc = false;

    BoidSettings.perceptionRadius = 0.1;
    BoidSettings.perceptionAngle = Math.PI * 1.5;

    BoidSettings.seperationMultiplier = 0.5;

    BoidSettings.separationWeight = 2;
    BoidSettings.alignmentWeight = 1;
    BoidSettings.cohesionWeight = 1;

    BoidSettings.drawMode = true;

    BoidSettings.historyLength = 50; // not related to delta!! (related to framerate)
    BoidSettings.drawHistory = true;

    BoidSettings.obstacleStrength = 0;

    BoidSettings.avoidWalls = false;
    BoidSettings.wallMargin = 0.1;
    BoidSettings.wallTurnStrength = 7.5;

    BoidSettings.numBoids = 100;

    BoidSettings.species = false;
}

let flock = new Flock();


let paused = false;


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
function resetBoids() {
    flock = new Flock();
}

function setupUI() {
    const rangeElements = document.querySelectorAll("input[type=range]");
    for (let i = 0; i < rangeElements.length; i++) {
        const element = rangeElements[i];
        element.addEventListener("input", function (event) {
            let value = parseFloat(event.target.value);
            const name = event.target.name;

            switch (name) {
                case "perceptionRadius": value /= 100; break;
                case "perceptionAngle": value *= Math.PI / 180; break;
            }

            BoidSettings[name] = value;

            if (name == "numBoids") {
                flock.updateBoidsCount();
            }
        });
    }

    const checkboxElements = document.querySelectorAll("input[type=checkbox]");
    for (let i = 0; i < checkboxElements.length; i++) {
        const element = checkboxElements[i];
        element.addEventListener("change", function (event) {
            const value = event.target.checked;
            const name = event.target.name;

            BoidSettings[name] = value;

            switch (name) {
                case "avoidWalls":
                case "drawHistory": {
                    const extraElement = document.getElementById(name + "Extra");
                    if (value) {
                        extraElement.removeAttribute("hidden");
                    } else {
                        extraElement.setAttribute("hidden", "");
                    }
                    break;
                }
                case "instantAcc": {
                    const extraElement = document.getElementById("instantAccExtra");
                    if (value) {
                        extraElement.setAttribute("hidden", "");
                    } else {
                        extraElement.removeAttribute("hidden");
                    }
                    break;
                }
            }
        });
    }

    const radioElements = document.querySelectorAll("input[type=radio]");
    for (let i = 0; i < radioElements.length; i++) {
        const element = radioElements[i];
        element.addEventListener("change", function (event) {
            const value = parseInt(event.target.value);
            if (event.target.checked) {
                BoidSettings.debugDrawMode = value;
            }
        });
    }
}

function rgbToFillStyle(r, g, b) {
    // Range: 0 to 1.0
    let scaledR = Math.floor(r * 255);
    let scaledG = Math.floor(g * 255);
    let scaledB = Math.floor(b * 255);

    return "rgb(" + scaledR + "," + scaledG + "," + scaledB + ")";
}
function randomColor() {
    let r = Math.random() * 0.8 + 0.2;
    let g = Math.random() * 0.8 + 0.2;
    let b = Math.random() * 0.8 + 0.2;

    return rgbToFillStyle(r, g, b);
}
  

function render() {
    context.fillStyle = "#3B4252";
    context.fillRect(0, 0, canvas.width, canvas.height);


    if (!paused) {
        flock.update(delta, [mouseObstacle]);
    }

    flock.render(context);

    if (BoidSettings.obstacleStrength > 0) {
        mouseObstacle.render(context);
    }


    t1 = performance.now();
    delta = (t1 - t0) / 1000;
    t0 = performance.now();


    document.getElementById("fpsText").innerHTML = "FPS: " + Math.round(1 / delta);

    window.requestAnimationFrame(render);
}


var t0 = performance.now();
var t1 = performance.now();
var delta = 1 / 60;

setupUI();

window.requestAnimationFrame(render);
