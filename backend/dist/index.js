"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const members = [];
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});
app.use((0, cors_1.default)());
app.get("/", (req, res) => {
    res.send("Socket.IO Chat Server Created");
});
function generateUniqueRoomCode(io, length = 5) {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    let code;
    do {
        code = Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join("");
    } while (io.sockets.adapter.rooms.has(code));
    return code;
}
const createdRooms = new Set();
// handle websocket connections
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
    // join a room
    socket.on("joinRoom", (_a) => __awaiter(void 0, [_a], void 0, function* ({ username, room, exists }) {
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
        const socketsInRoom = yield io.in(room).fetchSockets();
        const userList = socketsInRoom.map((s) => s.data.username);
        console.log("Hello");
        console.log(userList);
        io.to(room).emit("members", { members: userList });
    }));
    socket.on("get-members", (_a) => __awaiter(void 0, [_a], void 0, function* ({ room }) {
        const socketsInRoom = yield io.in(room).fetchSockets();
        const userList = socketsInRoom.map((s) => s.data.username);
        io.to(room).emit("members", { members: userList });
    }));
    // send message
    socket.on("message", ({ username, room, msg }) => {
        console.log(`${username} sent : ${msg}`);
        io.to(room).emit("message", {
            user: username,
            msg,
        });
    });
    // disconnect
    socket.on("disconnecting", () => __awaiter(void 0, void 0, void 0, function* () {
        const username = socket.data.username;
        const rooms = Array.from(socket.rooms).filter((r) => r !== socket.id);
        for (const room of rooms) {
            socket.to(room).emit("message", {
                user: "system",
                msg: `${username} has left the chat.`,
            });
            const socketsInRoom = yield io.in(room).fetchSockets();
            const userList = socketsInRoom.map((s) => s.data.username);
            io.to(room).emit("members", { members: userList });
        }
    }));
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
