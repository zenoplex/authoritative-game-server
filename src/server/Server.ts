import socketIo from 'socket.io';
import { Entity } from '../shared/Entity';
import * as EVENTS from '../shared/events';

export class Server {
  private entities: { [key: string]: Entity } = {};
  public tickRate: number = 5;
  private updateInterval: NodeJS.Timeout | undefined = undefined;
  private inputSequence: { [key: string]: number } = {};
  private clientMessages: EVENTS.UserInputEventPayload[] = [];

  private io: socketIo.Server;

  public constructor(socket: socketIo.Server) {
    this.io = socket;

    this.io.on('connection', socket => {
      const { id } = socket;
      console.log(`User connected as ${id}`);
      socket.emit(EVENTS.CONNECTION_ESTABLISHED, {
        id,
        tickRate: this.tickRate,
      });

      const entity = new Entity(id);
      this.entities[id] = entity;

      entity.x = Math.random() * 100;

      socket.on(EVENTS.USER_INPUT, (payload: EVENTS.UserInputEventPayload) => {
        this.clientMessages.push(payload);
      });

      socket.on('disconnect', () => {
        console.log(`User ${id} disconnected.`);
        delete this.entities[id];
      });
    });

    this.setTickRate(10);
  }

  private setTickRate = (tickRate?: number) => {
    if (tickRate) this.tickRate = tickRate;

    if (this.updateInterval) clearInterval(this.updateInterval);
    this.updateInterval = setInterval(this.tick, 1000 / this.tickRate);
  };

  private tick = () => {
    this.processInputs();
    this.broadcast();
  };

  private validateInput = (input: EVENTS.UserInputEventPayload) => {
    if (
      Math.abs(input.xDeltaTime) > 1 / 40 ||
      Math.abs(input.yDeltaTime) > 1 / 40
    ) {
      return false;
    }
    return true;
  };

  private processInputs = () => {
    let message: EVENTS.UserInputEventPayload | undefined;
    while ((message = this.clientMessages.shift())) {
      // Do something to prevent cheating
      if (this.validateInput(message)) {
        const id = message.id;
        const entity = this.entities[id];
        if (entity) {
          this.entities[id].applyInput(message);
          this.inputSequence[id] = message.inputId;
        }
      }
    }
  };

  private broadcast = () => {
    const serverTime = Date.now();
    const state = Object.keys(this.entities).map(id => {
      const { x, y } = this.entities[id];
      return {
        id,
        position: { x, y },
        lastProcessedInput: this.inputSequence[id] || 0,
        serverTime,
      };
    });

    this.io.emit(EVENTS.WORLD_UPDATE, state);
  };
}
