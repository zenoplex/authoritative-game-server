import socketIo from 'socket.io-client';
import * as dat from 'dat.gui';
import { Client } from './Client';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas');
if (!canvas) throw new Error('must have canvas element named #canvas');
canvas.width = 900;
canvas.height = 300;

const { PORT } = process.env;

const socket = PORT ? socketIo(`localhost:${PORT}`) : socketIo();

const client = new Client(socket, canvas);

const gui = new dat.GUI();
gui.add(client, 'clientSidePrediction');
gui.add(client, 'serverReconciliation');
gui.add(client, 'entityInterpolation');
gui.add(client, 'lag');
