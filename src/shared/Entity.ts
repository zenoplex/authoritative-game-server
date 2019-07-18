export class Entity {
  public id: string;

  public x: number = 0;

  public y: number = 0;

  public speed: number = 100;

  public size: number = 20;

  public color: string = `gray`;

  public interpolationBuffer: {
    time: number;
    position: { x: number; y: number };
  }[] = [];

  public constructor(id: string) {
    this.id = id;
  }

  public applyInput = (input: {
    xDeltaTime: number;
    yDeltaTime: number;
    inputId: number;
    id: string;
  }) => {
    this.x += input.xDeltaTime * this.speed;
    this.y += input.yDeltaTime * this.speed;
  };
}
