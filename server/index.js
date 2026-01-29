import http from 'node:http';
import { Server } from 'socket.io';

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const waitingQueue = [];
const pairedUsers = new Map();

const removeFromWaiting = (socketId) => {
  const index = waitingQueue.indexOf(socketId);
  if (index !== -1) {
    waitingQueue.splice(index, 1);
  }
};

const clearPairing = (socketId) => {
  const peerId = pairedUsers.get(socketId);
  if (peerId) {
    pairedUsers.delete(socketId);
    pairedUsers.delete(peerId);
    io.to(peerId).emit('peer-disconnected');
  }
};

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on('find-match', () => {
    if (pairedUsers.has(socket.id)) {
      return;
    }

    removeFromWaiting(socket.id);

    const peerId = waitingQueue.shift();

    if (!peerId) {
      waitingQueue.push(socket.id);
      return;
    }

    pairedUsers.set(socket.id, peerId);
    pairedUsers.set(peerId, socket.id);

    io.to(peerId).emit('match', {
      peerId: socket.id,
      shouldCreateOffer: true,
    });

    socket.emit('match', {
      peerId,
      shouldCreateOffer: false,
    });
  });

  socket.on('offer', ({ to, offer }) => {
    io.to(to).emit('offer', { from: socket.id, offer });
  });

  socket.on('answer', ({ to, answer }) => {
    io.to(to).emit('answer', { from: socket.id, answer });
  });

  socket.on('ice-candidate', ({ to, candidate }) => {
    io.to(to).emit('ice-candidate', { from: socket.id, candidate });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
    removeFromWaiting(socket.id);
    clearPairing(socket.id);
  });
});

httpServer.listen(PORT, () => {
  console.log(`Signaling server listening on port ${PORT}`);
});
