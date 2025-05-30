import { useEffect, useState } from "react";
import MyMessageBubble from "../components/MyMessageBubble";
import SystemMessage from "../components/SystemMessage";
import OtherMessageBubble from "../components/OtherMessageBubble";
import type { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ChatScreen({ socket }: { socket: Socket }) {
  const { room } = useParams();
  const { username } = useUser();
  const [messages, setMessages] = useState<{ user: string; msg: string }[]>([]);
  const [msg, setMsg] = useState("");
  const [members, setMembers] = useState([]);

  useEffect(() => {
    socket.emit("get-members", { room });

    socket.on("message", ({ user, msg }) => {
      console.log("HI! ", user, msg);
      setMessages((old) => [...old, { user, msg }]);
    });

    socket.on("members", ({ members }) => {
      console.log("received memebers: ", members);
      setMembers(members);
    });

    return () => {
      socket.emit("disconnecting");
    };
  }, []);

  function sendMessage() {
    console.log("HI   ", msg);
    socket?.emit("message", { username, room, msg });
    setMsg("");
  }

  if (!username) {
    return (
      <div className="text-center mt-12 text-red-500 font-semibold">
        Username not found. Please{" "}
        <a
          href="/"
          className="font-bold hover:text-red-800 transition ease-in-out"
        >
          go back
        </a>{" "}
        and join a room properly.
      </div>
    );
  }

  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <div className="mx-8">
        <div className="flex gap-2 text-sm mb-12 justify-between">
          <div className="flex gap-2">
            <div className="font-bold">Currently in the chat: </div>
            {members.map((member, index) => (
              <div
                className="bg-amber-400 text-black rounded-full px-2 font-bold"
                key={index}
              >
                {member}
                {member === username ? " (you)" : ""}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div>
              Room Code: <span className="font-mono">{room}</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(room!);
              }}
              className="text-blue-600 underline hover:text-blue-800 text-sm cursor-pointer"
            >
              Copy
            </button>
          </div>
        </div>
        {messages.map((msg, index) =>
          msg.user == username ? (
            <MyMessageBubble msg={msg.msg} index={index} />
          ) : msg.user == "system" ? (
            <SystemMessage index={index} msg={msg.msg} />
          ) : (
            <OtherMessageBubble user={msg.user} msg={msg.msg} index={index} />
          )
        )}
        <div className="mt-12 flex gap-2 justify-center">
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="your message..."
            className="bg-gray-100 px-2 py-0.5 rounded-md"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-2 rounded-md"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
