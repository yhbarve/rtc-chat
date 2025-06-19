import HomeScreen from "./pages/HomeScreen";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ChatScreen from "./pages/ChatScreen";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <div className="max-w-2xl mx-auto">
      <BrowserRouter>
        <Navbar />
        <UserProvider>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route
              path="/chat/"
              element={<ChatScreen />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<HomeScreen />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}
