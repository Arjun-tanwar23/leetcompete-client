import { io } from "socket.io-client";

export const socket = io("https://leetcompete-server.onrender.com", {
  withCredentials: true,
});
