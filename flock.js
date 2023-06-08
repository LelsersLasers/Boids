class Flock {
	constructor() {
		this.boids = [];

        for (let i = 0; i < BoidSettings.numBoids; i++) {
            this.addBoid();
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

            switch (BoidSettings.debugDrawMode) {
                case 0: boid.render(context, false); break;
                case 1: boid.render(context, i == 0); break;
                case 2: boid.render(context, true); break;
            }
		}
	}

	addBoid() {
        const pos = Vector.randomRect();
        const color = randomColor();
        const boid = new Boid(pos, color);
		this.boids.push(boid);
	}

    updateBoidsCount() {
        if (this.boids.length < BoidSettings.numBoids) {
            for (let i = this.boids.length; i < BoidSettings.numBoids; i++) {
                this.addBoid();
            }
        } else {
            this.boids.length = BoidSettings.numBoids;
        }
    }
}