import path from 'path';
import { config } from 'dotenv';
import express from 'express';
import { Server } from './Server';
import socketIo from 'socket.io';

config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(express.static(path.join(__dirname, '../')));

const server = app.listen(PORT, () => {
  console.log(`Server listening to ${PORT}`);
  const io = socketIo(server);
  new Server(io); // eslint-disable-line no-new
});
