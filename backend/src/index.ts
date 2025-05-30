import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
const server = http.createServer(app);
const members: string[] = [];
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

app.get("/", (req, res) => {
  res.send("Socket.IO Chat Server Created");
});

function generateUniqueRoomCode(io: Server, length = 5): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let code: string;

  do {
    code = Array.from({ length }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
  } while (io.sockets.adapter.rooms.has(code));

  return code;
}

const createdRooms = new Set<string>();

// handle websocket connections
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // join a room
  socket.on("joinRoom", async ({ username, room, exists }) => {
    if (exists && !createdRooms.has(room)) {
      socket.emit("errorMessage", { msg: "Room does not exist" });
      return;
    }
    socket.join(room);
    socket.data.username = username;
    console.log(`${username} joined room: ${room}`);
    io.to(room).emit("message", {
      user: "system",
      msg: `${username} has joined the chat`,
    });

    const socketsInRoom = await io.in(room).fetchSockets();
    const userList = socketsInRoom.map((s) => s.data.username);
    console.log("Hello");
    console.log(userList);
    io.to(room).emit("members", { members: userList });
  });

  socket.on("get-members", async ({room}) => {
    const socketsInRoom = await io.in(room).fetchSockets();
    const userList = socketsInRoom.map((s) => s.data.username);
    io.to(room).emit("members", { members: userList });
  });

  // send message
  socket.on("message", ({ username, room, msg }) => {
    console.log(`${username} sent : ${msg}`);
    io.to(room).emit("message", {
      user: username,
      msg,
    });
  });

  // disconnect
  socket.on("disconnecting", async () => {
    const username = socket.data.username;
    const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);

    for (const room of rooms) {
      socket.to(room).emit("message", {
        user: "system",
        msg: `${username} has left the chat.`,
      });

      const socketsInRoom = await io.in(room).fetchSockets();
      const userList = socketsInRoom.map((s) => s.data.username);
      io.to(room).emit("members", { members: userList });
    }
  });

  // create new room
  socket.on("generateRoom", ({}) => {
    const newRoom = generateUniqueRoomCode(io);
    createdRooms.add(newRoom);
    socket.emit("generatedNewRoom", { msg: newRoom });
  });
});

const PORT = 8080;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
