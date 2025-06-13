import "./SearchRoute.css"
import { useNavigate } from "react-router-dom"
import Dates from "../components/Dates"
import { useEffect, useState } from "react";

function SearchRoute() {
    const navigate = useNavigate();
    const [departure, setDeparture] = useState("");
    const [destination, setDestination] = useState("");
    const [date, setDate] = useState("");
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

    const handleSearch = () => {console.log(date);
        if(departure && destination && date) {
            navigate("/routes", {
                state: {
                    departure,
                    destination,
                    date
                }
            });
        } else {
            alert("Completeaza toate campurile!");
        }
    }

    return (
        <div className="main-container">
            <div className="container">
                <h1>Caută curse</h1>
                <div className="search-route-box">
                    <div className="input-container">
                        <label htmlFor="departure">Plecare din </label>
                        <input  list="stations" className="input-location" id="departure" type="text" placeholder="Stație plecare" required value={departure} onChange={(e) => setDeparture(e.target.value)}/>
                    </div>
                    <div className="input-container">
                        <label htmlFor="destination">Destinație</label>
                        <input list="stations" className="input-location" id="destination" type="text" placeholder="Stație sosire" required value={destination} onChange={(e) => setDestination(e.target.value)}/>
                    </div>
                    <div className="input-container">
                        <label>Dată plecare</label>
                        <Dates className="dates" onDateChange={setDate}/>
                    </div>
                    <button className="search-button" onClick={handleSearch}><span>Caută</span></button>
                </div>
            </div>
            <datalist id="stations">
                {stations.map((station, index) => (
                    <option key={index} value={station.name}/>
                ))}
            </datalist>
            <div className="container">
                <h1>Destinații populare</h1>
                <ul className="popular-destinations-list">
                    <li><a href="#">București</a></li>
                    <li><a href="#">Brasov</a></li>
                    <li><a href="#">Cluj-Napoca Central Station</a></li>
                    <li><a href="#">Timisoara</a></li>
                    <li><a href="#">Iasi Terminal</a></li>
                    <li><a href="#">Oradea</a></li>
                    <li><a href="#">Constanta</a></li>
                </ul>
            </div>
        </div>
    );
}

export default SearchRoute;