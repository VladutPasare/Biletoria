import "./RouteCard.css"
import { useNavigate } from "react-router-dom"

const RouteCard = ({id, departureLocation, arrivalLocation, departureTime, arrivalTime, company, availableSeats, adultPrice, childPrice, adults, children}) => { // 🗺️ℹ️☁️💰💺📍
    const navigate = useNavigate();

    const convertTime = (dateTime) => {
        const date = new Date(dateTime);
        return `${date.toLocaleDateString('ro-Ro')} ${date.toLocaleTimeString('ro-Ro', { hour : "2-digit", minute: "2-digit" })}`;
    }

    return (
        <div className="route-card" onClick={() => {
                            navigate("/buy-ticket", {
                                state: {
                                    routeId: id,
                                    adultPrice,
                                    childPrice,
                                    departure: departureLocation,
                                    destination: arrivalLocation,
                                    date: departureTime,
                                    maxNumberOfPassengers: availableSeats
                                }
                            })}}>
            <div className="company-header">
                <div className="company-info-box">
                    <div className="company-logo" alt="Bus Company Logo"></div>
                    <div className="company-name">{company}</div>
                </div>
                <button className="info-button">See info</button>
            </div>
            <div className="route-body" >
                <div className="route-side route-left">
                    <div className="location-label">Plecare</div>
                    <div className="route-time">{convertTime(departureTime)}</div>
                    <div className="route-location">{departureLocation}</div>
                </div>
                <div className="route-details">
                    <div className="seats">💺 Locuri disponibile: {availableSeats}</div>
                    <div className="price">Pret: {adultPrice * adults + childPrice * children} RON</div>
                    <div className="buttons-container">
                        <button className="weather-button" onClick={(e) => {
                            e.stopPropagation();
                            navigate("/weather", {
                                state: {
                                    departure: departureLocation,
                                    destination: arrivalLocation,
                                    date: departureTime,
                                    routeId: id
                                }
                            })}}>☁️ Weather</button>
                        <button className="map-button" 
                        onClick={(e) => {
                            e.stopPropagation();
                            navigate("/map", {
                                state: {
                                    departure: departureLocation,
                                    destination: arrivalLocation,
                                    date: departureTime,
                                    routeId: id
                                }
                            })}}>🗺️ Route</button>
                    </div>
                </div>
                <div className="route-side route-right">
                    <div className="location-label">Sosire</div>
                    <div className="route-time">{convertTime(arrivalTime)}</div>
                    <div className="route-location">{arrivalLocation}</div>
                </div>
            </div>
        </div>
    );
}

export default RouteCard;