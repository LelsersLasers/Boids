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
        pos = pos.mod(Vector.ONE);

        const radiusVec = Vector.fromRect(radius);
        const spatialVec = Vector.fromRect(SPATIAL_GRID_SIZE);

        const min = pos.sub(radiusVec);
        const max = pos.add(radiusVec).add(spatialVec);

        for (let x = min.x; x < max.x; x += SPATIAL_GRID_SIZE) {
            for (let y = min.y; y < max.y; y += SPATIAL_GRID_SIZE) {
                const gridPos = new Vector(x, y).modTo(Vector.ONE);
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
        switch (BoidSettings.debugDrawMode) {
            case 0: {
                for (let i = 0; i < this.boids.length; i++) {
                    const boid = this.boids[i];
                    boid.render(context, false);
                }
                break;
            }
            case 1: {
                for (let i = 0; i < this.boids.length; i++) {
                    const boid = this.boids[i];
                    boid.render(context, i == 0);
                }
                break;
            }
            case 2: {
                for (let i = 0; i < this.boids.length; i++) {
                    const boid = this.boids[i];
                    boid.render(context, true);
                }
            }
        }
	}

	addBoid() {
        const boid = new Boid();
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