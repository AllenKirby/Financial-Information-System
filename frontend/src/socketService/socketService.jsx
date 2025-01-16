import { io } from "socket.io-client";

let socket = null
let isInitialized = false

const addListeners = (socket) => {
  socket.on("connect", () => console.log("Connected to socket server:", socket.id));
  socket.on("disconnect", () => console.log("Disconnected from socket server"));
  socket.on("connect_error", (err) => console.error("Socket connection error:", err.message));
};

export const initializeSocket = (token) => {

  if (socket) {
    console.warn("Socket already initialized.");
    isInitialized = true
    return {socket, isInitialized};
  }

  socket = io(import.meta.env.VITE_API_URL, {
    auth: token ? { token } : {},
    withCredentials: true,
  });
  addListeners(socket);
  isInitialized = true
  return {socket, isInitialized};
};

export const getSocket = () => {
    if (!socket) {
        console.warn("Socket not initialized. Call initializeSocket first.");
    }
    return {socket, isInitialized};
};

export const updateSocketAuth = (newToken) => {
  if (socket) {
    socket.auth.token = newToken;
    socket.connect(); // Reconnect with the updated token
  } else {
    console.warn("Socket not initialized. Initialize it before updating the token.");
  }
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect(); // Close the WebSocket connection
    console.log("Socket disconnected.");
    socket = null; // Clear the socket reference
    isInitialized = false; // Reset the initialization flag
  } else {
    console.warn("No active socket to disconnect.");
  }
};