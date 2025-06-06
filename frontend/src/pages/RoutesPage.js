import NavigationBar from "../components/NavigationBar.js"
import "./RoutesPage.css"
import Dates from "../components/Dates"
import Passengers from "../components/Passengers.js"
import RouteCard from "../components/RouteCard.js"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"

function RoutesPage() {
    const location = useLocation();
    const searchParameters = location.state || {};
    const [routes, setRoutes] = useState([]);
    const [departure, setDeparture] = useState(searchParameters.departure || "");
    const [destination, setDestination] = useState(searchParameters.destination || "");
    const [date, setDate] = useState(searchParameters.date || "");
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => { console.log("da")
        if(departure && destination && date) {
            setLoading(true);
            const url = `http://localhost:8080/route/search` + 
                        `?departureStationName=${encodeURIComponent(departure)}` +
                        `&arrivalStationName=${encodeURIComponent(destination)}` +
                        `&departureDate=${encodeURIComponent(date)}` +
                        `&adults=${adults}` +
                        `&children=${children}`;
            fetch(url)
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                console.log(data);
                if(Array.isArray(data)) {
                    setRoutes(data);
                }
                else {
                    setRoutes([]);
                }
            })
            .catch(error => {
                setLoading(false);
                alert(error)
            });
        }
    }, [departure, destination, date, adults, children]);

    const [stations, setStations] = useState([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/stations")
        .then((response) => response.json())
        .then((data) => {
            setStations(data);
        })
        .catch((error) => {
            console.error(error);
        });
    }, []);

    return (
        <div className="content">
            <NavigationBar />
            <div className="search-route-details">
                <div className="locations-container">
                        <input  list="stations" className="input-location box" id="route-departure" type="text" placeholder="Stație plecare" defaultValue={departure} onChange={(e)=> setDeparture(e.target.value)} required/>
                    <div className="swap-image-icon-container"> <img className="swap-locations-icon" src="/icons/swap_horiz_70dp_1F1F1F_FILL0_wght0_GRAD0_opsz48.svg" alt="icon" /></div>
                    <div>
                        <input list="stations" className="input-location box" id="route-destination" type="text" placeholder="Stație sosire" defaultValue={destination} onChange={(e)=> setDestination(e.target.value)} required/>
                    </div>
                </div>
                <Dates className="dates-box" givenValue={date} onDateChange={(value)=> setDate(value)}/>
                <Passengers adults={adults} setAdults={setAdults} children={children} setChildren={setChildren}/>
            </div>
            
            <datalist id="stations">
                {stations.map((station, index) => (
                    <option key={index} value={station.name}/>
                ))}
            </datalist>

            <ul className="routes-list">
                {loading ? (
                    <p>Searching routes...</p>
                ) : routes.length === 0 ? (
                    <p>No routes found.</p>
                ) : (
                    routes.map((route, index) => (
                        <RouteCard 
                            key={index}
                            id={route.id}
                            departureLocation={route.departureLocation}
                            arrivalLocation={route.arrivalLocation}
                            departureTime={route.departureTime}
                            arrivalTime={route.arrivalTime}
                            company={route.company}
                            availableSeats={route.availableSeats}
                            price={route.price}
                        />
                    ))
                )}
            </ul>
        </div>
    );
}

export default RoutesPage;