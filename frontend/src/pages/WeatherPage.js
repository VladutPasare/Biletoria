import ContentLayout from "../components/ContentLayout";
import NavigationBar from "../components/NavigationBar";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import "./MapPage.css"
import "./WeatherPage.css"

const weatherCodes = {
    0: {icon: "☀️", description: "Cer senin"},
    1: {icon: "🌤️", description: "Parțial senin"},
    2: {icon: "⛅️", description: "Parțial înnorat"},
    3: {icon: "☁️", description: "Întrerupt"},
    45: {icon: "🌫️", description: "Ceață"},
    48: {icon: "🌫️", description: "Ceață cu depunere chiciură"},
    51: {icon: "🌦️", description: "Burniță slabă"},
    53: {icon: "🌦️", description: "Burniță moderată"},
    55: {icon: "🌧️", description: "Burniță densă"},
    56: {icon: "❄️", description: "Burniță înghețată slabă"},
    57: {icon: "❄️", description: "Burniță înghețată densă"},
    61: {icon: "🌧️", description: "Ploaie ușoară"},
    63: {icon: "🌧️", description: "Ploaie moderată"},
    65: {icon: "🌧️", description: "Ploaie puternică"},
    66: {icon: "❄️", description: "Ploaie înghețată ușoară"},
    67: {icon: "❄️", description: "Ploaie înghețată puternică"},
    71: {icon: "❄️", description: "Ninsori ușoare"},
    73: {icon: "❄️", description: "Ninsori moderate"},
    75: {icon: "❄️", description: "Ninsori puternice"},
    77: {icon: "❄️", description: "Boabe de zăpada"},
    80: {icon: "🌧️", description: "Averse ușoare"},
    81: {icon: "🌧️", description: "Averse moderate"},
    82: {icon: "🌧️", description: "Averse violente"},
    85: {icon: "❄️", description: "Averse de zăpada ușoare"},
    86: {icon: "❄️", description: "Averse de zăpada puternice"},
    95: {icon: "⛈️", description: "Furtună (moderată)"},
    96: {icon: "⛈️", description: "Furtună cu grindină ușoară"},
    99: {icon: "⛈️", description: "Furtună cu grindină puternică"},
}

const WeatherPage = () => {
    const [weatherData, setWeatherData] = useState([]);
    const location = useLocation();
    const routeId = location.state.routeId;
    const [stops, setStops] = useState([]);
    const [loadingStops, setLoadingStops] = useState(true);
    const [loadingWeatherData, setLoadingWeatherData] = useState(true);
    
    useEffect(() => {
        if(routeId) {
            setLoadingStops(true);
            fetch(`http://localhost:8080/route-station/stops?routeId=${routeId}`)
            .then(response => {
                if(!response.ok) {
                    console.log("Error fetching stations.");
                }
                return response.json();
            })
            .then(data => {
                setStops(data);
                setLoadingStops(false);
            })
            .catch(error => {
                console.error(error)
                setLoadingStops(false);
            });
        }
    }, [routeId]);


    useEffect(() => {
        if(stops.length === 0) {
            setLoadingWeatherData(false);
            return;
        }

        const fetchWeather = async () => {
            const results = await Promise.all(
                stops.map(async (stop) => {
                    const date = new Date(stop.arrivalTime);
                    const yyyy = date.getUTCFullYear();
                    const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
                    const dd = String(date.getUTCDate()).padStart(2, "0");
                    const dateString = `${yyyy}-${mm}-${dd}`;

                    const url = `https://api.open-meteo.com/v1/forecast?latitude=${stop.latitude}&longitude=${stop.longitude}&hourly=temperature_2m,weathercode&start_date=${dateString}&end_date=${dateString}&timezone=UTC`;
                    try {
                        const response = await fetch(url);
                        const data = await response.json();
                        const hourIndex = date.getUTCHours();

                        return {
                            name: stop.name,
                            arrivalTime: stop.arrivalTime,
                            temperature: Math.round(data.hourly.temperature_2m[hourIndex]),
                            weatherDescription: weatherCodes[data.hourly.weathercode[hourIndex]] || {icon: "?", description: "Necunoscut"},
                        };
                    } catch(error) {
                        return {
                            name: stop.name,
                            arrivalTime: stop.arrivalTime,
                            temperature: "-",
                            weatherDescription: {icon: "", description: "Nu se poate încarca"}
                        };
                    }
                })
            );
            setWeatherData(results);
            setLoadingWeatherData(false);
        };
        fetchWeather();
    }, [stops]);

    if(loadingStops || loadingWeatherData) {
        return (
            <ContentLayout>
                <NavigationBar></NavigationBar>
                <div className="weather-top-bar"><p>Condiții meteo pentru fiecare stație</p></div>
                <p>Se incarca datele meteo...</p>
            </ContentLayout>
        );
    }
    if(!loadingStops && !loadingWeatherData && weatherData.length === 0) {
        return (
            <ContentLayout>
                <NavigationBar></NavigationBar>
                <div className="weather-top-bar"><p>Condiții meteo pentru fiecare stație</p></div>
                <p>{/*Nu s-au gasit date meteo */}</p>
            </ContentLayout>
        );
    }
    return (     
        <ContentLayout>
                <NavigationBar></NavigationBar>
                <div className="weather-top-bar"><p>Condiții meteo pentru fiecare stație</p></div>
                    <div className="route-stations-list">
                        {weatherData.map((stop, index) => (
                                <div key={index} className="route-box-container">
                                    <div className="arrow">→</div>
                                    <div className="route-box">
                                        <div className="name">{stop.name}</div>
                                        <div className="date">Ajunge la: {new Date(stop.arrivalTime).toLocaleString()}</div>
                                        <div className="weather">
                                            {stop.temperature}℃,  {stop.weatherDescription.icon} {stop.weatherDescription.description}
                                        </div>
                                    </div>
                                </div>
                            ))}
                    </div>
        </ContentLayout>
    );
}

export default WeatherPage;