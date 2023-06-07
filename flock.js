class Flock {
	constructor() {
		this.boids = [];

        for (let i = 0; i < BoidSettings.numBoids; i++) {
            const pos = Vector.randomRect();
            const color = randomColor();
            const boid = new Boid(pos, color);
            this.addBoid(boid);
        }
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
}