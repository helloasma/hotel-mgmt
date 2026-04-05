import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ChatWidget from "./components/ChatWidget";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <ScrollToTop />

      <Navbar />
      <AppRoutes />
      <Footer />
      
      <ChatWidget />
    </>

  );
}

export default App;