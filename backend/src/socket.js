import { Server } from 'socket.io';
import { changeEventEmitter } from './event.js';

let io;

const setupSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  console.log('setup');
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId; // <-- sent from frontend

    if (!userId) {
      console.log('⚠️ No user ID found in socket connection');
      return socket.disconnect(true);
    }

    console.log(`🔌 Socket ${socket.id} connected for user ${userId}`);

    const handler = (update) => {
      socket.emit(`realtime-update-${userId}`, update);
    };

    // Start listening for user-specific updates
    changeEventEmitter.on(`update:${userId}`, handler);

    socket.on('disconnect', () => {
      console.log(`❌ Socket ${socket.id} disconnected for user ${userId}`);
      changeEventEmitter.off(`update:${userId}`, handler);
    });
  });
};

export { setupSocket };
