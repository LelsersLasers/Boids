# Boids

2D boids simulation in JavaScript 


## TODO

- fix math and weights
	- Make it more systematic/standarized
- not "rolling" changes
	- IS THIS NEEDED?
	- use a buffer (like in Game of Life)
- Performance??
	- Chunk into quads to not check all boids
	- Only loop over once to calculate all forces
		- Instead of looping over all boids for each force
- Boids can sense through wrap-around
- Obstacle avoidance
- Color options:
	- Random
	- Random Nord
		- seperate by species
			- Choose number of species
			- Avoid mixing with other species
- Wall avoidance vs wrap UI option

## UI

- Slider: ...
- ...