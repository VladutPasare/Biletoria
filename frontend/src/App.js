import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css"
import Home from "./pages/Home.js"
import RoutesPage from "./pages/RoutesPage.js"
import MapPage from "./pages/MapPage.js";
import WeatherPage from "./pages/WeatherPage.js";
import BuyTicketPage from "./pages/BuyTicketPage.js";

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
