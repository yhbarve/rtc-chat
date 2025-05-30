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
    <div>
      <div className=" h-screen flex flex-col mt-24 mx-auto gap-4 items-start">
        <div className="font-semibold text-2xl">Join the Chat.</div>
        <input
          type="text"
          placeholder="your username..."
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="px-2 py-0.5 bg-amber-300 rounded-md"
        />
        <div className="my-12">
          <div className="font-medium mb-2">Join an existing room</div>
          <div className="flex gap-4">
            <input
              type="text"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="enter room code..."
              className="px-2 py-0.5 bg-orange-300 rounded-md"
            />
            <button className="bg-black text-white py-0.5 rounded-md cursor-pointer hover:bg-gray-300 hover:text-black transition ease-in-out px-2" onClick={() => handleJoin(room, true)}>
              Join room
            </button>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Create a new room</div>
          <div className="flex gap-2 items-center">
            <button
              className="px-2 py-0.5 bg-pink-300 rounded-md cursor-pointer hover:bg-pink-500 hover:text-white transition ease-in-out"
              onClick={() => {
                setShowNewRoom(true);
                socket.emit("generateRoom", {});
              }}
            >
              Generate
            </button>
            {showNewRoom && (
              <div className="text-sm">
                Created room <span className="font-bold">{newRoom}</span>.
              </div>
            )}
            <button
              className="bg-black text-white px-2 py-0.5 rounded-md cursor-pointer hover:bg-gray-300 hover:text-black transition ease-in-out"
              onClick={() => {handleJoin(newRoom, false)}}
            >
              Go to room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
