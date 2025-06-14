import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home.js"
import RoutesPage from "./pages/RoutesPage.js"
import MapPage from "./pages/MapPage.js";
import WeatherPage from "./pages/WeatherPage.js";
import BuyTicketPage from "./pages/BuyTicketPage.js";
import AuthenticationPage from "./pages/AuthenticationPage.js";
import PassengerPage from "./pages/PassengerPage.js"
import CompanyAdminPage from "./pages/CompanyAdminPage.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/acasa" element={<Home/>} />
        <Route path="/routes" element={<RoutesPage/>} />
        <Route path="/map" element={<MapPage/>} />
        <Route path="/weather" element={<WeatherPage/>} />
        <Route path="/buy-ticket" element={<BuyTicketPage/>} />
        <Route path="/authentication" element={<AuthenticationPage/>} />
        <Route path="passenger" element={<PassengerPage/>} />
        <Route path="company-admin" element={<CompanyAdminPage/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
