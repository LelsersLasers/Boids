class Boid {
	constructor(
		pos,
		maxSpeed, maxForce,
		perceptionRadius, perceptionAngle,
		seperationMultiplier,
		separationWeight, alignmentWeight, cohesionWeight,
        drawMode, // true: triangle, false: circle
		color
	) {
		this.pos = pos;
		// this.vel = new Vector(0, 0);
		this.vel = Vector.randomUnit().mul(maxSpeed);
		// this.acc = Vector.zero();

		this.maxSpeed = maxSpeed;
		this.maxForce = maxForce;

		this.perceptionRadius = perceptionRadius;
		this.perceptionAngle = perceptionAngle;

		this.seperationMultiplier = seperationMultiplier;

		this.separationWeight = separationWeight;
		this.alignmentWeight = alignmentWeight;
		this.cohesionWeight = cohesionWeight;

        this.drawMode = drawMode;
		this.color = color;
	}

	update(delta) {
		// this.acc = this.acc.limit(this.maxForce);

		// this.vel = this.vel.add(this.acc.mul(delta));
		this.vel = this.vel.limit(this.maxSpeed);
		
		this.pos = this.pos.add(this.vel.mul(delta));
		
		// this.acc = this.acc.mul(0);

		this.pos.wrap(Vector.one());
	}

	calculateBehavior(flock) {
		this.seperation(flock);
		this.alignment(flock);
		this.cohesion(flock);
	}

	seperation(flock) {
		// let sum = Vector.zero();
		// let count = 0;

		// for (let i = 0; i < flock.boids.length; i++) {
		// 	const boid = flock.boids[i];
		// 	if (boid == this) {
		// 		continue;
		// 	}

		// 	const dif = this.pos.sub(boid.pos);
		// 	const dist = dif.mag();

		// 	if (dist < this.perceptionRadius * this.seperationMultiplier) {

		// 		const angle = Math.abs(this.vel.angleBetween(dif)) * 2;

		// 		if (angle < this.perceptionAngle) {
		// 		// inversely proportional to distance
		// 			sum = sum.add(dif.normalize().div(dist));
		// 			count++;
		// 		}
		// 	}
		// }

		// if (count > 0) {
		// 	sum = sum.div(count);
		// 	sum = sum.normalize().mul(this.maxSpeed);
		// 	let steer = sum.sub(this.vel);
		// 	steer = steer.limit(this.maxForce);
		// 	this.applyForce(steer.mul(this.separationWeight));
		// }

        let sum = Vector.zero();

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const dif = boid.pos.sub(this.pos);
            const dist = dif.mag();
            if (dist < this.perceptionRadius * this.seperationMultiplier) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < this.perceptionAngle) {
                    sum = sum.add(this.pos.sub(boid.pos));
                }
            }
        }

        this.vel = this.vel.add(sum.mul(this.separationWeight));
	}
	alignment(flock) {
		// let sum = Vector.zero();
		// let count = 0;

		// for (let i = 0; i < flock.boids.length; i++) {
		// 	const boid = flock.boids[i];
		// 	if (boid == this) {
		// 		continue;
		// 	}

		// 	const dif = boid.pos.sub(this.pos);
		// 	const dist = dif.mag();

		// 	if (dist < this.perceptionRadius) {
		// 		const angle = Math.abs(this.vel.angleBetween(dif)) * 2;

		// 		if (angle < this.perceptionAngle) {
		// 			sum = sum.add(boid.vel);
		// 			count++;
		// 		}
		// 	}
		// }
		// if (count > 0) {
		// 	sum = sum.div(count);
		// 	sum = sum.normalize().mul(this.maxSpeed);
		// 	let steer = sum.sub(this.vel);
		// 	steer = steer.limit(this.maxForce);
		// 	this.applyForce(steer.mul(this.alignmentWeight));
		// }

        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const dif = boid.pos.sub(this.pos);
            const dist = dif.mag();
            if (dist < this.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < this.perceptionAngle) {
                    sum = sum.add(boid.vel);
                    count++;
                }
            }
        }

        if (count > 0) {
            sum = sum.div(count);
            this.vel = this.vel.add(sum.mul(this.alignmentWeight));
        }
	}
	
	cohesion(flock) {
		// let sum = new Vector(0, 0);
		// let count = 0;

		// for (let i = 0; i < flock.boids.length; i++) {
		// 	const boid = flock.boids[i];
		// 	if (boid == this) {
		// 		continue;
		// 	}

		// 	const dif = boid.pos.sub(this.pos);
		// 	const dist = dif.mag();

		// 	if (dist < this.perceptionRadius) {

		// 		const angle = Math.abs(this.vel.angleBetween(dif)) * 2;

		// 		if (angle < this.perceptionAngle) {
		// 			sum = sum.add(boid.pos);
		// 			count++;
		// 		}
		// 	}
		// }

		// if (count > 0) {
		// 	sum = sum.div(count);
		// 	let steer = this.seek(sum);
		// 	steer = steer.limit(this.maxForce);
		// 	this.applyForce(steer.mul(this.cohesionWeight));
		// }

        let sum = Vector.zero();
        let count = 0;

        for (let i = 0; i < flock.boids.length; i++) {
            const boid = flock.boids[i];
            if (boid == this) continue;

            const dif = boid.pos.sub(this.pos);
            const dist = dif.mag();
            if (dist < this.perceptionRadius) {
                const angle = Math.abs(this.vel.angleBetween(dif)) * 2;
                if (angle < this.perceptionAngle) {
                    sum = sum.add(boid.pos);
                    count++;
                }
            }
        }

        if (count > 0) {
            sum = sum.div(count);
            this.vel = this.vel.add(sum.mul(this.cohesionWeight));
        }
	}

	// seek(target) {
	// 	const desiredDif = target.sub(this.pos);
	// 	const desiredVel = desiredDif.normalize().mul(this.maxSpeed);
	// 	const steer = desiredVel.sub(this.vel);
	// 	return steer;
	// }

	// applyForce(force) {
	// 	this.acc = this.acc.add(force);
	// }

	render(context, drawDebug = false) {
		const drawPos = this.pos.mul(context.canvas.width);
		const drawRadius = this.perceptionRadius * context.canvas.width;

		if (drawDebug) {
			context.strokeStyle = this.color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);

			const startAngle = this.vel.angle() - this.perceptionAngle / 2;
			const endAngle = this.vel.angle() + this.perceptionAngle / 2;

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


			context.strokeStyle = this.color;
			context.beginPath();
			context.moveTo(drawPos.x, drawPos.y);
			const target = drawPos.add(this.vel.normalize().mul(drawRadius * this.vel.mag() / this.maxSpeed));
			context.lineTo(target.x, target.y);
			context.stroke();
		}

        if (this.drawMode) {
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