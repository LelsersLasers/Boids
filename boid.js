class Boid {
	constructor(pos, maxSpeed, maxForce, perceptionRadius, perceptionAngle, color) {
		this.pos = pos;
		this.vel = new Vector(0, 0);
		this.acc = new Vector(0, 0);

		this.maxSpeed = maxSpeed;
		this.maxForce = maxForce;

		this.perceptionRadius = perceptionRadius;
		this.perceptionAngle = perceptionAngle;

		this.color = color;
	}

	update(delta) {
		this.acc = this.acc.limit(this.maxForce);

		this.vel = this.vel.add(this.acc.mul(delta));
		this.vel = this.vel.limit(this.maxSpeed);
		
		this.pos = this.pos.add(this.vel.mul(delta));
		
		// this.acc = this.acc.mul(0);
	}

	seek(target) {
		const desiredDif = target.sub(this.pos);
		const desiredVel = desiredDif.normalize().mul(this.maxSpeed);
		const steer = desiredVel.sub(this.vel);
		this.applyForce(steer);
	}

	applyForce(force) {
		this.acc = this.acc.add(force);
	}

	render(context) {
		context.fillStyle = this.color;
		context.beginPath();
		context.arc(this.pos.x, this.pos.y, 5, 0, 2 * Math.PI);
		context.fill();
	}
}