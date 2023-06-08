class Boid {
	constructor() {
		this.pos = Vector.randomRect();
		this.vel = Vector.randomUnit().mulTo(BoidSettings.maxVel);
		this.acc = Vector.zero();

		this.color = randomColor();
        this.history = [];

        this.species = Math.floor(Math.random() * BoidSettings.NUM_SPECIES);
	}

	update(delta) {
        if (!BoidSettings.instantAcc) {
            this.acc.limitTo(BoidSettings.maxAcc);
            this.vel.addTo(this.acc.mul(delta * BoidSettings.accMultiplier));

            this.vel.limitTo(BoidSettings.maxVel);
        } else {
            this.vel.addTo(this.acc);
            this.vel.limitTo(BoidSettings.maxVel);
        }
            
        const move = this.vel.mul(delta);

        const oldPos = this.pos.clone();
        this.pos.addTo(move);

        this.pos.modTo(Vector.ONE);

        if (oldPos.dist(this.pos) > move.mag() * 2) {
            // We wrapped around
            this.history.push(false);
        } else {
            // We didn't wrap around
            this.history.push(oldPos);
        }
        this.history = this.history.slice(-BoidSettings.historyLength);

        
        if (BoidSettings.instantAcc) {
            this.acc = Vector.zero();
        }
	}

	calculateBehavior(flock, obstacles) {
        let seperationSum = Vector.zero();
        let alignmentSum = Vector.zero();
        let cohesionSum = Vector.zero();
        let count = 0;

        const boids = flock.getBoidsInRadius(this.pos, BoidSettings.perceptionRadius);
        for (let i = 0; i < boids.length; i++) {
            const boid = boids[i];
            if (boid == this) continue;

            const boidScreenPos = this.closestBoidScreenPos(boid);

            const dif = boidScreenPos.sub(this.pos);
            const dist = dif.mag();

            // seperation
            // Don't consider perception angle for seperation
            if (dist < BoidSettings.perceptionRadius * BoidSettings.seperationMultiplier) {
                seperationSum.addTo(dif);
            }

            // only align and cohese with boids of the same species
            if (BoidSettings.species && boid.species != this.species) continue;

            // alignment and cohesion
            if (dist < BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    alignmentSum.addTo(boid.vel);
                    cohesionSum.addTo(dif);

                    count++;
                }
            }
        }

        seperationSum.mulTo(-BoidSettings.separationWeight);
        this.acc.addTo(seperationSum);

        if (count > 0) {
            alignmentSum.mulTo(BoidSettings.alignmentWeight / count);
            this.acc.addTo(alignmentSum);

            cohesionSum.mulTo(BoidSettings.cohesionWeight / count);
            this.acc.addTo(cohesionSum);
        }

        this.avoidObstacles(obstacles);

        if (BoidSettings.avoidWalls) {
            this.avoidWalls();
        }
	}

    avoidWalls() {
        if (this.pos.x < BoidSettings.wallMargin) {
            this.acc.x += (BoidSettings.wallMargin - this.pos.x) * BoidSettings.wallTurnStrength;
        } else if (this.pos.x > 1 - BoidSettings.wallMargin) {
            this.acc.x += (1 - BoidSettings.wallMargin - this.pos.x) * BoidSettings.wallTurnStrength;
        }

        if (this.pos.y < BoidSettings.wallMargin) {
            this.acc.y += (BoidSettings.wallMargin - this.pos.y) * BoidSettings.wallTurnStrength;
        } else if (this.pos.y > 1 - BoidSettings.wallMargin) {
            this.acc.y += (1 - BoidSettings.wallMargin - this.pos.y) * BoidSettings.wallTurnStrength;
        }
    }


    avoidObstacles(obstacles) {
        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];

            const obstacleScreenPos = this.closestBoidScreenPos(obstacle);

            const dif = obstacleScreenPos.sub(this.pos);
            const dist = dif.mag();
            if (dist < obstacle.radius + BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    sum.addTo(dif);
                    count++;
                }
            }
        }

        sum.mulTo(-BoidSettings.obstacleStrength);
        this.acc.addTo(sum);
    }

    closestBoidScreenPos(other) {
        // other must have `pos`

        let closest = other.pos;
        let closestDist = this.pos.dist(closest);

        for (let i = 0; i < VARIATIONS.length; i++) {
            const variation = VARIATIONS[i];
            const variationPos = other.pos.add(variation);

            const dist = this.pos.dist(variationPos);
            if (dist < closestDist) {
                closest = variationPos;
                closestDist = dist;
            }
        }

        // if (closestDist < BoidSettings.perceptionRadius) {
        //     context.strokeStyle = "red";
        //     context.beginPath();
        //     const drawPos = this.pos.mul(context.canvas.width);
        //     context.moveTo(drawPos.x, drawPos.y);

        //     const draw2Pos = closest.mul(context.canvas.width);
        //     context.lineTo(draw2Pos.x, draw2Pos.y);
        //     context.stroke();
        // }

        return closest;
    }

	render(context, drawDebug = false) {
		const drawPos = this.pos.mul(context.canvas.width);
		const drawRadius = BoidSettings.perceptionRadius * context.canvas.width;

        const color = BoidSettings.species ? SPECIES_COLORS[this.species] : this.color;

		if (drawDebug) {
			context.strokeStyle = color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);

            const angle = this.vel.angle();
            const halfPerceptionAngle = BoidSettings.perceptionAngle / 2;

			const startAngle = angle - halfPerceptionAngle;
            const endAngle = angle + halfPerceptionAngle;

			context.lineTo(
				drawPos.x + Math.cos(startAngle) * drawRadius,
				drawPos.y + Math.sin(startAngle) * drawRadius
			);

			context.arc(
				drawPos.x, drawPos.y,
				drawRadius,
				startAngle,
				endAngle,
			);
			context.lineTo(drawPos.x, drawPos.y);
			context.stroke();

            context.beginPath();
            context.arc(
				drawPos.x, drawPos.y,
				drawRadius * BoidSettings.seperationMultiplier,
				0,
				Math.PI * 2,
			);
            context.stroke();


			context.strokeStyle = color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);

			const target = drawPos.add(this.vel.normalize().mulTo(drawRadius * this.vel.mag() / BoidSettings.maxVel));

			context.lineTo(target.x, target.y);
			context.stroke();

            const x = Math.floor(this.pos.x / SPATIAL_GRID_SIZE);
            const y = Math.floor(this.pos.y / SPATIAL_GRID_SIZE);
            const w = context.canvas.width * SPATIAL_GRID_SIZE;
            const gridDrawPos = new Vector(x, y).mulTo(w);

            context.strokeStyle = color;
            context.strokeRect(gridDrawPos.x, gridDrawPos.y, w, w);
		}

        if (BoidSettings.drawHistory) {
            context.strokeStyle = color;
            context.beginPath();


            context.moveTo(drawPos.x, drawPos.y);
            let shouldMove = false;
            
            for (let i = this.history.length - 1; i >= 0; i--) {
                const historyPos = this.history[i];
                if (historyPos == false) {
                    context.stroke();
                    context.beginPath();
                    shouldMove = true;
                } else {
                    const p = historyPos.mul(context.canvas.width);
                    if (shouldMove) {
                        context.moveTo(p.x, p.y);
                        shouldMove = false;
                    } else {
                        context.lineTo(p.x, p.y);
                    }
                }
            }

            context.stroke();
        }

        const l = DRAW_RATIO * context.canvas.width;

        if (BoidSettings.drawMode) {
            // isosceles triangle
            const tail = drawPos.sub(this.vel.normalize().mulTo(l));
            const halfTailLen = 2 / Math.tan(Math.PI / 2 - DRAW_ANGLE / 2) * l;
            const halfTail = this.vel.normalize().mulTo(halfTailLen).rotateTo(Math.PI / 2);

            const p1 = drawPos.add(this.vel.normalize().mulTo(l));
            const p2 = tail.add(halfTail);
            const p3 = tail.sub(halfTail);

            context.fillStyle = color;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.lineTo(p3.x, p3.y);
            context.lineTo(p1.x, p1.y);
            context.fill();
        } else {
            // circle
            context.fillStyle = color;
            context.beginPath();
            context.arc(drawPos.x, drawPos.y, l, 0, 2 * Math.PI);
            context.fill();
        }
	}
}