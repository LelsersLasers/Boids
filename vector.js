class Vector {
	// 2d vector
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

    addTo(other) {
        this.x += other.x;
        this.y += other.y;
        return this;
    }
    subTo(other) {
        this.x -= other.x;
        this.y -= other.y;
        return this;
    }
    mulTo(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    }
    divTo(scalar) {
        this.x /= scalar;
        this.y /= scalar;
        return this;
    }
    normalizeTo() {
        const mag = this.mag();
        if (mag == 0) {
            return this;
        }
        return this.divTo(mag);
    }
    limitTo(max) {
        const mag = this.mag();
        if (mag > max) {
            return this.normalizeTo().mulTo(max);
        }
        return this;
    }
    modTo(other) {
        // Should play nice with negative numbers
        this.x = (this.x % other.x + other.x) % other.x;
        this.y = (this.y % other.y + other.y) % other.y;
        return this;
    }
    rotateTo(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;

        this.x = x;
        this.y = y;
        
        return this;
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
    dist(other) {
        const xDif = this.x - other.x;
        const yDif = this.y - other.y;
        return Math.sqrt(xDif * xDif + yDif * yDif);
    }
	limit(max) {
		const mag = this.mag();
		if (mag > max) {
			return this.normalize().mul(max);
		}
		return this.clone();
	}
    mod(other) {
        // Should play nice with negative numbers
        const x = (this.x % other.x + other.x) % other.x;
        const y = (this.y % other.y + other.y) % other.y;
        return new Vector(x, y);
    }

	rotate(angle) {
		// Angle in radians
		const cos = Math.cos(angle);
		const sin = Math.sin(angle);
		return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
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
	clone() {
		return new Vector(this.x, this.y);
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

    static fromRect(rect) {
        return new Vector(rect, rect);
    }

    // DON'T MODIFY THESE!!
    static ONE = Vector.one();
    static ZERO = Vector.zero();
    static UNIT_X = Vector.unitX();
    static UNIT_Y = Vector.unitY();
    static UNIT_XY = Vector.unitXY();
    static UNIT_XY_NEG = Vector.unitXYNeg();
    static UNIT_X_NEG = Vector.unitXNeg();
    static UNIT_Y_NEG = Vector.unitYNeg();
}