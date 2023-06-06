class Flock {
	constructor() {
		this.boids = [];
	}

	update(delta) {
		for (let i = 0; i < this.boids.length; i++) {
			const boid = this.boids[i];
			boid.calculateBehavior(this);
			boid.update(delta);
		}
	}

	render(context) {
		for (let i = 0; i < this.boids.length; i++) {
			const boid = this.boids[i];
			boid.render(context, i == 0);
		}
	}

	addBoid(b) {
		this.boids.push(b);
	}
}