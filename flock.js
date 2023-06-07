class Flock {
	constructor() {
		this.boids = [];
	}

	update(delta, obstacles) {
		for (let i = 0; i < this.boids.length; i++) {
			const boid = this.boids[i];
			boid.calculateBehavior(this, obstacles);
		}

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
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

    resetPositions() {
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.pos = Vector.randomRect();
        }
    }
}