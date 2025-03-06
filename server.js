// Import necessary modules
import express from "express";
import path from "path";
import http from "http";
import { fileURLToPath } from "url";
import { Server as SocketIO } from "socket.io";

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "dist")));

// Create a Socket.IO server
const io = new SocketIO(server);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(process.cwd(), "dist")));

// Handle WebSocket connections
io.on("connection", (socket) => {
  console.log("WebSocket connected");
  socket.on("disconnect", () => {
    console.log("WebSocket disconnected");
  });
});

// Catch-all route for handling all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
