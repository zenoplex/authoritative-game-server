export const CONNECTION_ESTABLISHED = 'connection_established';
export interface ConnectionEstablishedEventPayload {
  id: string;
  tickRate: number;
}

export const WORLD_UPDATE = 'world_update';
export interface WorldUpdateEventPayload {
  id: string;
  position: { x: number; y: number };
  lastProcessedInput: number;
  serverTime: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface WorldUpdateEventPayloads
  extends Array<WorldUpdateEventPayload> {}

export const USER_INPUT = 'user_input';
export interface UserInputEventPayload {
  id: string;
  xDeltaTime: number;
  yDeltaTime: number;
  inputId: number;
}
