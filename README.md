# Boids

2D boids simulation in JavaScript 


## TODO

- fix math and weights
	- Make it more systematic/standarized
- Boids can sense through wrap-around
- Obstacle avoidance
- Color options:
	- Random
	- Random Nord
		- seperate by species
			- Choose number of species
			- Avoid mixing with other species
- Wall avoidance vs wrap UI option
- Trace paths
    - How to deal with wrap??
- Performance??
	- Chunk into quads to not check all boids
	- Only loop over once to calculate all forces
		- Instead of looping over all boids for each force
    - Vector functions don't create new vectors
        - Instead modify `this`

## UI

- Slider: ...
- ...