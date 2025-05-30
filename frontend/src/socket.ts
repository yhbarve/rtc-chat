import { io, Socket } from "socket.io-client";

const URL = "https://rtc-chat-8flp.onrender.com/";

export const socket: Socket = io(URL);