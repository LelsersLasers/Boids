class Boid {
    // static idCount = 0;
	constructor(
		pos,
		color
	) {
		this.pos = pos;
		this.vel = Vector.randomUnit().mul(BoidSettings.maxVel);
		this.acc = Vector.zero();

		this.color = color;
        this.history = [];

        this.species = Math.floor(Math.random() * BoidSettings.NUM_SPECIES);
	}

	update(delta) {
        if (!BoidSettings.instantAcc) {
            this.acc = this.acc.limit(BoidSettings.maxAcc);
            this.vel = this.vel.add(this.acc.mul(delta * BoidSettings.accMultiplier));

            this.vel = this.vel.limit(BoidSettings.maxVel);
        } else {
            this.vel = this.vel.add(this.acc);
            this.vel = this.vel.limit(BoidSettings.maxVel);
        }
            
        const move = this.vel.mul(delta);

        const oldPos = this.pos;
        this.pos = this.pos.add(move);

        const oldPosMod = oldPos.mod(Vector.one());
        const newPosMod = this.pos.mod(Vector.one());

        if (oldPosMod.dist(newPosMod) > move.mag() * 2) {
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
        const screenPos = this.pos.mod(Vector.one());

        let seperationSum = Vector.zero();
        let alignmentSum = Vector.zero();
        let cohesionSum = Vector.zero();
        let count = 0;

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const boidScreenPos = this.closestBoidScreenPos(boid);

            const dif = boidScreenPos.sub(screenPos);
            const dist = dif.mag();

            // seperation
            if (dist < BoidSettings.perceptionRadius * BoidSettings.seperationMultiplier) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    seperationSum = seperationSum.add(screenPos.sub(boidScreenPos));
                }
            }

            // only align and cohese with boids of the same species
            if (BoidSettings.species && boid.species != this.species) continue;

            // alignment and cohesion
            if (dist < BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    alignmentSum = alignmentSum.add(boid.vel);
                    cohesionSum = cohesionSum.add(boidScreenPos);

                    count++;
                }
            }
        }

        this.acc = this.acc.add(seperationSum.mul(BoidSettings.separationWeight));
        if (count > 0) {
            alignmentSum = alignmentSum.div(count);
            this.acc = this.acc.add(alignmentSum.mul(BoidSettings.alignmentWeight));

            cohesionSum = cohesionSum.div(count);
            this.acc = this.acc.add(cohesionSum.sub(screenPos).mul(BoidSettings.cohesionWeight));
        }

        this.avoidObstacles(obstacles);

        if (BoidSettings.avoidWalls) {
            this.avoidWalls();
        }
	}

    avoidWalls() {
        const screenPos = this.pos.mod(Vector.one());

        if (screenPos.x < BoidSettings.wallMargin) {
            this.acc.x += (BoidSettings.wallMargin - screenPos.x) * BoidSettings.wallTurnStrength;
        } else if (screenPos.x > 1 - BoidSettings.wallMargin) {
            this.acc.x += (1 - BoidSettings.wallMargin - screenPos.x) * BoidSettings.wallTurnStrength;
        }

        if (screenPos.y < BoidSettings.wallMargin) {
            this.acc.y += (BoidSettings.wallMargin - screenPos.y) * BoidSettings.wallTurnStrength;
        } else if (screenPos.y > 1 - BoidSettings.wallMargin) {
            this.acc.y += (1 - BoidSettings.wallMargin - screenPos.y) * BoidSettings.wallTurnStrength;
        }
    }


    avoidObstacles(obstacles) {
        const screenPos = this.pos.mod(Vector.one());
        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < obstacles.length; i++) {
            const obstacle = obstacles[i];

            const obstacleScreenPos = this.closestBoidScreenPos(obstacle);

            const dif = obstacleScreenPos.sub(screenPos);
            const dist = dif.mag();
            if (dist < obstacle.radius + BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    sum = sum.add(screenPos.sub(obstacleScreenPos));
                    count++;
                }
            }
        }

        this.acc = this.acc.add(sum.mul(BoidSettings.obstacleStrength));
    }

    closestBoidScreenPos(other) {
        // other must have `pos`

        const screenPos = this.pos.mod(Vector.one());
        const otherScreenPos = other.pos.mod(Vector.one());

        const variations = [];
        const changes = [-1, 0, 1];
        for (let i = 0; i < changes.length; i++) {
            const x = changes[i];
            for (let j = 0; j < changes.length; j++) {
                const y = changes[j];
                if (x == 0 && y == 0) continue;
                variations.push(new Vector(x, y));
            }
        }

        let closest = otherScreenPos;
        let closestDist = screenPos.dist(closest);

        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            const variationPos = otherScreenPos.add(variation);

            const dist = screenPos.dist(variationPos);
            if (dist < closestDist) {
                closest = variationPos;
                closestDist = dist;
            }
        }

        // if (closestDist < BoidSettings.perceptionRadius && this.id == 0) {
        //     context.strokeStyle = "red";
        //     context.beginPath();
        //     const drawPos = this.pos.mod(Vector.one()).mul(context.canvas.width);
        //     context.moveTo(drawPos.x, drawPos.y);

        //     const draw2Pos = closest.mod(Vector.one()).mul(context.canvas.width);
        //     context.lineTo(draw2Pos.x, draw2Pos.y);
        //     context.stroke();
        // }

        return closest;
    }

	render(context, drawDebug = false) {
		const drawPos = this.pos.mod(Vector.one()).mul(context.canvas.width);
		const drawRadius = BoidSettings.perceptionRadius * context.canvas.width;

        const speciesColors = [
            "#BF616A",
            "#D08770",
            "#EBCB8B",
            "#A3BE8C",
            "#B48EAD",
        ];
        const color = BoidSettings.species ? speciesColors[this.species] : this.color;

		if (drawDebug) {
			context.strokeStyle = color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);

			const startAngle = this.vel.angle() - BoidSettings.perceptionAngle / 2;
			const endAngle = this.vel.angle() + BoidSettings.perceptionAngle / 2;

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
				startAngle,
				endAngle,
			);
            context.stroke();


			context.strokeStyle = color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);
			const target = drawPos.add(this.vel.normalize().mul(drawRadius * this.vel.mag() / BoidSettings.maxVel));
			context.lineTo(target.x, target.y);
			context.stroke();
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
                    const p = historyPos.mod(Vector.one()).mul(context.canvas.width);
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

        if (BoidSettings.drawMode) {
            // isosceles triangle
            const tail = drawPos.sub(this.vel.normalize().mul(DRAW_RATIO * context.canvas.width));
            const halfTailLen = 2 / Math.tan(Math.PI / 2 - DRAW_ANGLE / 2) * DRAW_RATIO * context.canvas.width;
            const halfTail = this.vel.normalize().mul(halfTailLen).rotate(Math.PI / 2);

            const p1 = drawPos.add(this.vel.normalize().mul(DRAW_RATIO * context.canvas.width));
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
            context.arc(drawPos.x, drawPos.y, DRAW_RATIO * context.canvas.width, 0, 2 * Math.PI);
            context.fill();
        }
	}
}