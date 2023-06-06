# Boids

2D boids simulation in JavaScript 


## TODO

- perceptionAngle
- not "rolling" changes
	- use a buffer (like in Game of Life)
- Performance
	- Chunk into quads to not check all boids
	- Only loop over once to calculate all forces
		- Instead of looping over all boids for each force
- Boids can sense through wrap-around
- Obstacle avoidance