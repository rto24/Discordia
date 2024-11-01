import { WebSocket, WebSocketServer } from "ws";
import { Server } from "http";
import jwt from 'jsonwebtoken';
import { WebSocketClient } from "../types/types";

let wss: WebSocketServer;
const clients: Record<string, WebSocketClient[]> = {};

export const initializeWebSocket = (server: Server) => {
  wss = new WebSocketServer({ server });

//   wss.on('connection', (ws, req) => {
//     // Parse the token from the URL using the URL class
//     const url = new URL(req.url || '', `http://${req.headers.host}`);
//     const token = url.searchParams.get('token');
    
//     if (!token) {
//       console.error('No token provided in WebSocket connection');
//       ws.close();
//       return;
//     }

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
//       const userId = decoded.id;

//       if (!clients[userId]) clients[userId] = [];
//       clients[userId].push(ws);

//       console.log(`User ${userId} connected with WebSocket`);

//       ws.on('close', () => {
//         clients[userId] = clients[userId].filter(client => client !== ws);
//         if (clients[userId].length === 0) delete clients[userId];
//         console.log(`User ${userId} disconnected from WebSocket`);
//       });
//     } catch (error) {
//       console.error('JWT verification failed:', error);
//       ws.close();
//     }
//   });
// };

wss.on('connection', (ws, req) => {
  const url = new URL(req.url || '', `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  
  if (!token) {
    console.error('No token provided in WebSocket connection');
    ws.close();
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { username: string };
    const userId = decoded.username;

    if (!clients[userId]) clients[userId] = [];
    clients[userId].push(ws);

    console.log(`User ${userId} connected with WebSocket`);

    ws.on('close', () => {
      clients[userId] = clients[userId].filter(client => client !== ws);
      if (clients[userId].length === 0) delete clients[userId];
      console.log(`User ${userId} disconnected from WebSocket`);
    });
  } catch (error) {
    console.error('JWT verification failed:', error);
    ws.close();
  }
});
}

export const broadcastCurrencyUpdate = (userId: string, currency: number) => {
  const userClients = clients[userId];
  if (userClients) {
    for (let i = 0; i < userClients.length; i++) {
      const client = userClients[i];
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({ currency }));
      }
    }
  }
};