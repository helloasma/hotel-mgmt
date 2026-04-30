import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import ChatWidget from "./components/ChatWidget";
import ScrollToTop from "./components/ScrollToTop";
import Footer from "./components/Footer/Footer";

function App() {
  const location = useLocation();
  
  // Check if current route is admin page (admin pages have AdminLayout which handles their own navbar)
  const isAdminRoute = location.pathname.startsWith("/admin");
  
  // Don't show Navbar/Sidebar/Footer on admin login page or admin routes
  const shouldShowMainLayout = !isAdminRoute;

  return (
    <>
      <ScrollToTop />

      {shouldShowMainLayout && <Navbar />}
      <AppRoutes />
      {shouldShowMainLayout && <Footer />}
      
      {shouldShowMainLayout && <ChatWidget />}
    </>

  );
}

export default App;