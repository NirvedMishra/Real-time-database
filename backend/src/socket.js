// src/socket.js
import { Server } from 'socket.io';
import { initKafka, consumer } from './utils/kafka.js';
import dotenv from 'dotenv';
dotenv.config();

let io;

async function setupSocket(server) {
  // 1) Initialize Socket.IO
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  console.log('⚡ Socket.IO initialized');

  // 2) Handle new connections
  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (!userId) {
      console.warn('⚠️ No userId in handshake, disconnecting');
      return socket.disconnect(true);
    }

    // Join a room named after the userId
    socket.join(userId);
    console.log(`🔌 Socket ${socket.id} joined room ${userId}`);
    
    socket.on('disconnect', () => {
      console.log(`❌ Socket ${socket.id} left room ${userId}`);
    });
  });

  // 3) Bootstrap Kafka consumer
  await initKafka();  // connects producer & consumer
  await consumer.subscribe({ topic: 'db-change', fromBeginning: false });

  // 4) On each Kafka message, route to the correct room
  await consumer.run({
    eachMessage: async ({ message }) => {
      const payload = JSON.parse(message.value.toString());
      const { userId, ...changeData } = payload;

      // Emit exactly as before:
      io.to(userId).emit(`realtime-update-${userId}`, changeData);
    },
  });
}

export { setupSocket };
