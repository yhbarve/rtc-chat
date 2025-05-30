import { socket } from "./socket";
import HomeScreen from "./pages/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatScreen from "./pages/ChatScreen";
import { UserProvider } from "./context/UserContext";

export default function App() {
  return (
    <div className="mt-12 max-w-2xl mx-auto">
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomeScreen socket={socket} />} />
            <Route
              path="/chat/:room"
              element={<ChatScreen socket={socket} />}
            />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}
