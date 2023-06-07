# Boids

2D boids simulation in JavaScript 


## TODO

- Performance??
	- Chunk into quads to not check all boids
    - Vector functions don't create new vectors
        - Instead modify `this`
- Debug draw modes?

## UI

- Top
    - Info: FPS
    - Delta: ms
- HR
- Middle
    - 
        - Slider: seperation weight (0-5) (2)
        - Slider: alignment weight (0-5) (1)
        - Slider: cohesion weight (0-5) (1)
    - 
        - Slider: seperation multiplier (0-1) (0.5)
    - 
        - Slider: perception radius: 0-100 (-> 0-1 in code) (0.1)
        - Slider: perception angle (degrees): 0-360 (-> 0-2PI in code) (270)
    - 
        - Slider: num boids (1-500) (100)
        - Checkbox: species (false)
    - 
        - Checkbox: avoid walls (false)
            - Slider: wall margin (0-0.5) (0.1)
            - Slider: wall turn strength (0-20) (7.5)
    - 
        - Slider: max vel (0-1) (0.33)
        - Slider: max acc (0-10) (5)
        - Slider: acc multiplier (0-10) (7.5)
    - 
        - Checkbox: draw history (true)
            - Slider: history length (0-100) (50)
        - Checkbox: draw triangles (true)
    - 
        - Slider: obstacle strength (0-5) (0)
- HR
- Bottom
    - Button: pause
    - Button: reset

