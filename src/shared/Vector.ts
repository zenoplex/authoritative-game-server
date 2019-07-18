export class Vector {
  public x: number;
  public y: number;
  public z: number;

  public constructor(x: number = 0, y: number = 0, z: number = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public negative = () => {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
  };

  public add = (v: Vector | number) => {
    if (v instanceof Vector) {
      this.x += v.x;
      this.y += v.y;
      this.z += v.z;
    } else {
      this.x += v;
      this.y += v;
      this.z += v;
    }
  };

  public subtract = (v: Vector | number) => {
    if (v instanceof Vector) {
      this.x -= v.x;
      this.y -= v.y;
      this.z -= v.z;
    } else {
      this.x -= v;
      this.y -= v;
      this.z -= v;
    }
  };

  public multiply = (v: Vector | number) => {
    if (v instanceof Vector) {
      this.x *= v.x;
      this.y *= v.y;
      this.z *= v.z;
    } else {
      this.x *= v;
      this.y *= v;
      this.z *= v;
    }
  };

  public divide = (v: Vector | number) => {
    if (v instanceof Vector) {
      this.x /= v.x;
      this.y /= v.y;
      this.z /= v.z;
    } else {
      this.x /= v;
      this.y /= v;
      this.z /= v;
    }
  };

  public equals = (v: Vector) => {
    return this.x === v.x && this.y === v.y && this.z === v.z;
  };

  public dot = (v: Vector) => {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  };

  public cross = (v: Vector) => {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x,
    );
  };

  public magnitude = () => {
    return Math.sqrt(this.dot(this));
  };

  public normalize = () => {
    const magitude = this.magnitude();
    return magitude === 0 ? this : this.divide(this.magnitude());
  };

  public min = () => {
    return Math.min(Math.min(this.x, this.y), this.z);
  };

  public max = () => {
    return Math.max(Math.max(this.x, this.y), this.z);
  };

  public limit = (max: number) => {
    const squareMagnitude = this.dot(this);
    if (squareMagnitude > max * max) {
      this.divide(Math.sqrt(squareMagnitude)); // normalize
      this.multiply(max);
    }
    return this;
  };

  public toAngles = () => {
    return {
      theta: Math.atan2(this.z, this.x),
      pi: Math.asin(this.y / this.magnitude()),
    };
  };

  public angleTo = (v: Vector) => {
    return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
  };

  public toArray = () => {
    return [this.x, this.y, this.z];
  };

  public clone = () => {
    return new Vector(this.x, this.y, this.z);
  };

  public set = (x: number = 0, y: number = 0, z: number = 0) => {
    this.x = x;
    this.y = y;
    this.z = z;
  };
}

export default Vector;
