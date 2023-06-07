class Boid {
    // static idCount = 0;
	constructor(
		pos,
		color
	) {
		this.pos = pos;
		this.vel = Vector.randomUnit().mul(BoidSettings.maxSpeed);
		this.acc = Vector.zero();

		this.color = color;
        this.history = [];

        // this.id = Boid.idCount++;
	}

	update(delta) {
        this.acc = this.acc.limit(BoidSettings.maxForce);
		this.vel = this.vel.add(this.acc.mul(delta * BoidSettings.accMultiplier));

        this.vel = this.vel.limit(BoidSettings.maxSpeed);
		
        this.history.push(this.pos);
        this.history = this.history.slice(-Math.round(BoidSettings.historyLength * delta));
		this.pos = this.pos.add(this.vel.mul(delta));
		
		// this.acc = this.acc.mul(0);
	}

	calculateBehavior(flock, obstacles) {
		this.seperation(flock);
		this.alignment(flock);
		this.cohesion(flock);

        this.avoidObstacles(obstacles);
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

	seperation(flock) {
        const screenPos = this.pos.mod(Vector.one());
        let sum = Vector.zero();

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const boidScreenPos = this.closestBoidScreenPos(boid);


            const dif = boidScreenPos.sub(screenPos);
            const dist = dif.mag();
            if (dist < BoidSettings.perceptionRadius * BoidSettings.seperationMultiplier) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    sum = sum.add(screenPos.sub(boidScreenPos));
                }
            }
        }

        this.acc = this.acc.add(sum.mul(BoidSettings.separationWeight));
	}
	alignment(flock) {
        const screenPos = this.pos.mod(Vector.one());
        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const boidScreenPos = this.closestBoidScreenPos(boid);

            const dif = boidScreenPos.sub(screenPos);
            const dist = dif.mag();
            if (dist < BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    sum = sum.add(boid.vel);
                    count++;
                }
            }
        }

        if (count > 0) {
            sum = sum.div(count);
            this.acc = this.acc.add(sum.mul(BoidSettings.alignmentWeight));
        }
	}
	
	cohesion(flock) {
        const screenPos = this.pos.mod(Vector.one());
        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const boidScreenPos = this.closestBoidScreenPos(boid);

            const dif = boidScreenPos.sub(screenPos);
            const dist = dif.mag();
            if (dist < BoidSettings.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < BoidSettings.perceptionAngle) {
                    sum = sum.add(boidScreenPos);
                    count++;
                }
            }
        }

        if (count > 0) {
            sum = sum.div(count);
            this.acc = this.acc.add(sum.sub(screenPos).mul(BoidSettings.cohesionWeight));
        }
	}

	render(context, drawDebug = false) {
		const drawPos = this.pos.mod(Vector.one()).mul(context.canvas.width);
		const drawRadius = BoidSettings.perceptionRadius * context.canvas.width;

		if (drawDebug) {
			context.strokeStyle = this.color;
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


			context.strokeStyle = this.color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);
			const target = drawPos.add(this.vel.normalize().mul(drawRadius * this.vel.mag() / BoidSettings.maxSpeed));
			context.lineTo(target.x, target.y);
			context.stroke();
		}

        if (BoidSettings.drawHistory) {
            context.strokeStyle = this.color;
            context.beginPath();
            context.moveTo(drawPos.x, drawPos.y);
            for (let i = 0; i < this.history.length; i++) {
                const p = this.history[i].mod(Vector.one()).mul(context.canvas.width);
                context.lineTo(p.x, p.y);
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

            context.fillStyle = this.color;
            context.beginPath();
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.lineTo(p3.x, p3.y);
            context.lineTo(p1.x, p1.y);
            context.fill();
        } else {
            // circle
            context.fillStyle = this.color;
            context.beginPath();
            context.arc(drawPos.x, drawPos.y, DRAW_RATIO * context.canvas.width, 0, 2 * Math.PI);
            context.fill();
        }
	}
}