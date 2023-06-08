class Flock {
	constructor() {
		this.boids = [];

        for (let i = 0; i < BoidSettings.numBoids; i++) {
            this.addBoid();
        }

        this.boidsSpatial = [];
        this.boidsSpatial.length = SPATIAL_GRID_COUNT * SPATIAL_GRID_COUNT;

        for (let i = 0; i < this.boidsSpatial.length; i++) {
            this.boidsSpatial[i] = [];
        }

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            this.addBoidToSpatial(boid);
        }
    }
    
    resetSpatial() {
        for (let i = 0; i < this.boidsSpatial.length; i++) {
            this.boidsSpatial[i].length = 0;
        }
    }

    addBoidToSpatial(boid) {
        const index = HASH(boid.pos.mod(Vector.one()));
        this.boidsSpatial[index].push(boid);
    }

    getBoidsInRadius(pos, radius) {
        const boids = [];
        pos = pos.mod(Vector.one());

        const radiusVec = Vector.one().mul(radius);
        const spatialVec = Vector.one().mul(SPATIAL_GRID_SIZE);

        const min = pos.sub(radiusVec);
        const max = pos.add(radiusVec).add(spatialVec);

        for (let x = min.x; x < max.x; x += SPATIAL_GRID_SIZE) {
            for (let y = min.y; y < max.y; y += SPATIAL_GRID_SIZE) {
                const gridPos = new Vector(x, y).mod(Vector.one());
                const index = HASH(gridPos);
                const spatialBoids = this.boidsSpatial[index];

                boids.push(...spatialBoids);
            }
        }

        return boids;
    }

	update(delta, obstacles) {
		for (let i = 0; i < this.boids.length; i++) {
			const boid = this.boids[i];
			boid.calculateBehavior(this, obstacles);
		}

        this.resetSpatial();

        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            boid.update(delta);
            this.addBoidToSpatial(boid);
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

        this.resetSpatial();
        for (let i = 0; i < this.boids.length; i++) {
            const boid = this.boids[i];
            this.addBoidToSpatial(boid);
        }
    }
}