import "./RouteMap.css";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet"

const RouteMap = ({ stops }) => {

    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions ({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png")
    });

    const position = [45.9432, 24.9668]; // center of Romania

    

    const polylinePositions = stops.map(stop => [stop.latitude, stop.longitude]);
    return (
            <MapContainer center={position} zoom={6} className="map">
                <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <Polyline positions={polylinePositions} color="green"/>
                {stops.map((stop, index) => (
                    <Marker key={index} position={[stop.latitude, stop.longitude]}>
                        <Popup>{stop.name}</Popup>                    
                    </Marker>
                ))}
            </MapContainer>
    );
}

export default RouteMap;