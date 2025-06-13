import "./MapPage.css"
import ContentLayout from "../components/ContentLayout";
import RouteMap from "../components/RouteMap";
import NavigationBar from "../components/NavigationBar";
import { data, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const MapPage = () => { // →
    const location = useLocation();
    const { departure, destination, date, routeId } = location.state || {};
    const [stops, setStops] = useState([]);

    useEffect(() => {
        if(routeId && date) {
            const formattedDate = new Date(date).toISOString().split('T')[0];
            fetch(`http://localhost:8080/route-station/stops?routeId=${routeId}&date=${formattedDate}&departure=${departure}&destination=${destination}`)
            .then(response => {
                if(!response.ok) {
                    console.log("Error fetching stations.");
                }
                return response.json();
            })
            .then(data => setStops(data))
            .catch(error => console.error(error));
        }
    }, [routeId, date]);

    return (
        <ContentLayout>
            <NavigationBar></NavigationBar>
            <div className="weather-top-bar"><p>🚏 {departure} → {destination}</p></div>
            <div className="rute-direction">
                <RouteMap stops={stops} />
            </div>
            <div className="route-stations-list">
                {
                    stops.map((stop, index) => (
                        <div key={index} className="route-box-container">
                            <div className="arrow">→</div>
                            <div className="route-box">
                                <div className="name">{stop.name}</div>
                                <div className="date">Ajunge la: {new Date(stop.exactArrivalTime).toLocaleString()}</div>
                                <div className="facilities">{stop.facilities.join(", ")}</div>
                            </div>
                        </div>

                    ))
                }
            </div>
        </ContentLayout>
    );
}

export default MapPage;