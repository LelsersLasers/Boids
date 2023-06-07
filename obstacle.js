class Obstacle {
    constructor(pos, radius) {
        this.pos = pos;
        this.radius = radius;
    }

    render(context) {

        const colors = [
            "#8FBCBB",
            "#88C0D0",
            "#81A1C1",
            "#5E81AC",
        ];

        const drawPos = this.pos.mul(context.canvas.width);
        const drawRadius = this.radius * context.canvas.width;

        for (let i = colors.length - 1; i >= 0; i--) {
            const color = colors[i];
            const radius = drawRadius / colors.length * (i + 1);
            context.beginPath();
            context.arc(drawPos.x, drawPos.y, radius, 0, 2 * Math.PI);
            context.fillStyle = color;
            context.fill();
        }
    }
}