import { createContext } from 'react';
import { io } from 'socket.io-client';
// export const SOCKET_URL = 'https://presentation-server.onrender.com';
export const SOCKET_URL = 'http://localhost:3000';

let socket = null;
let socketToken = '';
export const getSocket = async () => {
  const token = localStorage.getItem('token') || '';
  if (!token) return null;
  if (socket && token === socketToken) return socket;
  if (token) {
    socketToken = token;
    socket = io(SOCKET_URL, {
      extraHeaders: {
        token
      }
    });
    return socket;
  }
};
export const socketDestroy = () => {
  socket = null;
};
export default socket;
export const SocketContext = createContext(null);
