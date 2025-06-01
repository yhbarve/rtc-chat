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
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (room) {
      navigator.clipboard.writeText(room);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

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
    <div className="h-screen max-w-2xl mx-auto flex flex-col">
      {/* Header: Room Info + Members */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 text-sm bg-white shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-gray-700">In chat:</span>
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-amber-400 text-black rounded-full px-2 py-0.5 font-semibold text-xs"
            >
              {member}
              {member === username ? " (you)" : ""}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm text-gray-800">
            Room: {room}
          </span>
          <button
            onClick={handleCopy}
            className="text-blue-600 underline hover:text-blue-800 text-xs"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {/* Message area */}
      <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2 space-y-2 message-container">
        {messages.map((msg, index) =>
          msg.user === username ? (
            <MyMessageBubble msg={msg.msg} index={index} key={index} />
          ) : msg.user === "system" ? (
            <SystemMessage msg={msg.msg} index={index} key={index} />
          ) : (
            <OtherMessageBubble
              user={msg.user}
              msg={msg.msg}
              index={index}
              key={index}
            />
          )
        )}
      </div>

      {/* Message input bar */}
      <div
        className="sticky bottom-0 bg-white/90 backdrop-blur-md border-t border-gray-200 px-4 py-2 flex gap-2 justify-center items-center shadow-sm"
        style={{ zIndex: 10 }}
      >
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="bg-gray-100 w-full max-w-sm px-3 mb-4 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 mb-4 py-1.5 rounded-md hover:bg-blue-700 transition shadow"
        >
          Send
        </button>
      </div>
    </div>
  );
}
