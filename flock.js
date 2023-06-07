class Flock {
	constructor() {
		this.boids = [];

        // const colors = [
        //     "#BF616A",
        //     "#D08770",
        //     "#EBCB8B",
        //     "#A3BE8C",
        //     "#B48EAD",
        // ];
    
        for (let i = 0; i < BoidSettings.numBoids; i++) {
            const pos = Vector.randomRect();
            const color = randomColor();
            // const color = colors[Math.floor(Math.random() * colors.length)];
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

    resetPositions() {
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.pos = Vector.randomRect();
        }
    }
}