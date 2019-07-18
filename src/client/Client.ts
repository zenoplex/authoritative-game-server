import * as EVENTS from '../shared/events';
import { Entity } from '../shared/Entity';
import { Input } from './Input';

export class Client {
  private entities: { [key: string]: Entity } = {};

  // User input controller
  private input: Input;

  private serverTickRate: number = 1;

  public lag: number = 0;

  private id: string | null = null;

  public clientSidePrediction: boolean = false;
  public serverReconciliation: boolean = false;
  public entityInterpolation: boolean = false;
  // Currently we can only handle length of two
  private interpolationBufferLength: number = 2;
  private inputId: number = 0;
  // Local inputs
  private pendingInputs: {
    id: string;
    inputId: number;
    xDeltaTime: number;
    yDeltaTime: number;
  }[] = [];

  private serverMessages: EVENTS.WorldUpdateEventPayloads[] = [];

  private tickRate: number = 50;
  private tickInterval: number | undefined = undefined;
  private lastUpdateTime: number = 0;

  private socket: SocketIOClient.Socket;

  private canvas: HTMLCanvasElement;

  public constructor(socket: SocketIOClient.Socket, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.input = new Input(window);

    this.setTickRate(50);

    this.socket = socket;
    this.socket.on(
      EVENTS.CONNECTION_ESTABLISHED,
      ({ id, tickRate }: EVENTS.ConnectionEstablishedEventPayload) => {
        this.id = id;
        this.serverTickRate = tickRate;

        this.socket.on(
          EVENTS.WORLD_UPDATE,
          (payload: EVENTS.WorldUpdateEventPayloads) => {
            this.serverMessages.push(payload);
          },
        );
      },
    );
  }

  private setTickRate = (tickRate?: number) => {
    if (tickRate) this.tickRate = tickRate;

    window.clearInterval(this.tickInterval);
    this.tickInterval = window.setInterval(this.tick, 1000 / this.tickRate);
  };

  private tick = () => {
    if (this.id === null) return;
    this.processServerMessages();
    this.processInputs();

    if (this.entityInterpolation) this.interpolateEntities();

    window.requestAnimationFrame(this.render);
  };

  private processInputs = () => {
    const now = Date.now();
    const lastUpdateTime = this.lastUpdateTime || now;
    const deltaTime = (now - lastUpdateTime) / 1000;
    this.lastUpdateTime = now;

    if (!this.id) return;

    const input = { id: this.id, xDeltaTime: 0, yDeltaTime: 0, inputId: 0 };
    if (this.input.right) {
      input.xDeltaTime = deltaTime;
    }
    if (this.input.left) {
      input.xDeltaTime = -deltaTime;
    }
    if (this.input.up) {
      input.yDeltaTime = -deltaTime;
    }
    if (this.input.down) {
      input.yDeltaTime = deltaTime;
    }

    input.inputId = this.inputId++;

    if (this.lag) {
      setTimeout(() => this.socket.emit(EVENTS.USER_INPUT, input), this.lag);
    } else {
      this.socket.emit(EVENTS.USER_INPUT, input);
    }

    if (this.clientSidePrediction) this.entities[this.id].applyInput(input);

    // Saving for reconciliation
    this.pendingInputs.push(input);
  };

  private processServerMessages = () => {
    let message;
    while ((message = this.serverMessages.shift())) {
      const entities: { [key: string]: Entity } = {};

      for (const state of message) {
        const savedEntity = this.entities[state.id];
        const entity = savedEntity || new Entity(state.id);
        entities[entity.id] = entity;

        if (state.id === this.id) {
          entity.color = 'red';
          entity.x = state.position.x;
          entity.y = state.position.y;

          if (this.serverReconciliation) {
            let j = 0;
            while (j < this.pendingInputs.length) {
              const input = this.pendingInputs[j];
              if (input.inputId <= state.lastProcessedInput) {
                // Effect already processed so drop pending input
                this.pendingInputs.splice(j, 1);
              } else {
                // Not processed by the server
                entity.applyInput(input);
                j++;
              }
            }
          } else {
            this.pendingInputs = [];
          }
        } else {
          if (!this.entityInterpolation) {
            entity.x = state.position.x;
            entity.y = state.position.y;
          } else {
            entity.interpolationBuffer.push({
              time: Date.now(),
              position: state.position,
            });
          }
        }
      }
      this.entities = entities;
    }
  };

  private interpolateEntities = () => {
    const renderTimestamp = Date.now() - 1000 / this.serverTickRate;

    Object.keys(this.entities).forEach(id => {
      const entity = this.entities[id];

      if (entity.id === this.id) return;

      const { interpolationBuffer } = entity;

      // Drop older positions.
      while (
        interpolationBuffer.length >= this.interpolationBufferLength &&
        interpolationBuffer[1].time <= renderTimestamp
      ) {
        interpolationBuffer.shift();
      }

      // Interpolate between the two surrounding authoritative positions
      if (
        interpolationBuffer.length >= this.interpolationBufferLength &&
        interpolationBuffer[0].time <= renderTimestamp &&
        renderTimestamp <= interpolationBuffer[1].time
      ) {
        const { x: x0, y: y0 } = interpolationBuffer[0].position;
        const { x: x1, y: y1 } = interpolationBuffer[1].position;
        const { time: t0 } = interpolationBuffer[0];
        const { time: t1 } = interpolationBuffer[1];
        const alpha = (renderTimestamp - t0) / (t1 - t0);
        entity.x = x0 + (x1 - x0) * alpha;
        entity.y = y0 + (y1 - y0) * alpha;
      }
    });
  };

  private render = () => {
    const context = this.canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    Object.keys(this.entities).forEach(id => {
      const entity = this.entities[id];
      context.fillStyle = entity.color;
      context.fillRect(entity.x, entity.y, entity.size, entity.size);
    });
  };
}
