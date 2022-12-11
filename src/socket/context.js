import { createContext } from "react";
import { io } from "socket.io-client";
const SOCKET_URL = "https://presentation-server.onrender.com";
let socket = null;
let socketToken = "";
export const getSocket = async () => {
  const token = localStorage.getItem("token") || "";
  if (!token) return null;
  if (socket && token === socketToken) return socket;
  if (token) {
    socketToken = token;
    socket = io(SOCKET_URL, {
      extraHeaders: {
        token,
      },
    });
  }
  return socket;
};
export const socketDestroy = () => {
  socket = null;
};
export default socket;
export const SocketContext = createContext(null);
