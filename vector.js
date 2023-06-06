class Vector {
	// 2d vector
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	add(other) {
		return new Vector(this.x + other.x, this.y + other.y);
	}
	sub(other) {
		return new Vector(this.x - other.x, this.y - other.y);
	}
	mul(scalar) {
		return new Vector(this.x * scalar, this.y * scalar);
	}
	div(scalar) {
		return new Vector(this.x / scalar, this.y / scalar);
	}
	dot(other) {
		return this.x * other.x + this.y * other.y;
	}
	mag() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	normalize() {
		const mag = this.mag();
		if (mag == 0) {
			return new Vector(0, 0);
		}
		return this.div(mag);
	}
	limit(max) {
		const mag = this.mag();
		if (mag > max) {
			return this.normalize().mul(max);
		}
		return this.clone();
	}
	wrap(other) {
		// MODIFIES THIS!!!
		if (this.x > other.x)	this.x -= other.x;
		if (this.x < 0)			this.x += other.x;

		if (this.y > other.y)	this.y -= other.y;
		if (this.y < 0)	this.y += other.y;
	}

	rotate(angle) {
		// Angle in radians
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
	}
	rotateAround(angle, other) {
		return this.sub(other).rotate(angle).add(other);
	}
	angleBetween(other) {
		return Math.acos(this.dot(other) / (this.mag() * other.mag()));
	}
	angle() {
		return Math.atan2(this.y, this.x);
	}

	toString() {
		return "<" + this.x + ", " + this.y + ">";
	}
	toArray() {
		return [this.x, this.y];
	}
	clone() {
		return new Vector(this.x, this.y);
	}

	static fromArray(array) {
		return new Vector(array[0], array[1]);
	}

	static randomUnit() {
		const angle = Math.random() * Math.PI * 2;
		return new Vector(Math.cos(angle), Math.sin(angle));
	}
	static randomRect() {
		return new Vector(Math.random(), Math.random());
	}

	static zero() {
		return new Vector(0, 0);
	}
	static one() {
		return new Vector(1, 1);
	}
	static unitX() {
		return new Vector(1, 0);
	}
	static unitY() {
		return new Vector(0, 1);
	}
	static unitXY() {
		return new Vector(1, 1);
	}
	static unitXYNeg() {
		return new Vector(-1, -1);
	}
	static unitXNeg() {
		return new Vector(-1, 0);
	}
	static unitYNeg() {
		return new Vector(0, -1);
	}
}