import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ChatWidget from "./components/ChatWidget";

function App() {
  return (
    <>
      <Navbar />
      <AppRoutes />
      <ChatWidget />
    </>
  );
}

export default App;