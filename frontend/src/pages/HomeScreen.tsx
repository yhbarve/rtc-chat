import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";
import { useUser } from "../context/UserContext";

export default function HomeScreen({ socket }: { socket: Socket }) {
  const { setUsername } = useUser();
  const [usernameInput, setUsernameInput] = useState("");
  const [room, setRoom] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [showNewRoom, setShowNewRoom] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("errorMessage", ({ msg }) => {
      alert(msg);
    });

    socket.on("generatedNewRoom", ({ msg }) => {
      console.log("Hello");
      console.log(msg);
      setNewRoom(msg);
    });
  }, []);

  function handleJoin(room: string, exists: boolean) {
  if (!usernameInput || !room) {
    alert("Please enter username and room");
    return;
  }

  setUsername(usernameInput);
  socket.emit("joinRoom", { username: usernameInput, room, exists });
  navigate(`/chat/${room}`);
}


  return (
  <div className="h-screen flex items-center justify-center">
    <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Join the Chat
      </h1>

      {/* Username input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Username
        </label>
        <input
          type="text"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          placeholder="e.g. yash_01"
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-amber-100 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      {/* Join Room */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Join an Existing Room
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            placeholder="Enter room code"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-orange-100 focus:outline-none focus:ring focus:border-blue-300"
          />
          <button
            onClick={() => handleJoin(room, true)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Join
          </button>
        </div>
      </div>

      {/* Create New Room */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Create a New Room
        </label>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => {
              setShowNewRoom(true);
              socket.emit("generateRoom", {});
            }}
            className="px-4 py-2 bg-pink-400 text-white rounded-md hover:bg-pink-500 transition"
          >
            Generate
          </button>

          {showNewRoom && (
            <div className="text-sm font-mono text-gray-700">
              {newRoom && (
                <>
                  Created Room: <span className="font-bold">{newRoom}</span>
                </>
              )}
            </div>
          )}

          <button
            onClick={() => handleJoin(newRoom, false)}
            className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
          >
            Go
          </button>
        </div>
      </div>
    </div>
  </div>
);

}
