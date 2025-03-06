import io from "socket.io-client";

// import socketIO from "socket.io-client";
// "undefined" means the URL will be computed from the `window.location` object

export const socket = io.connect(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"],
});
