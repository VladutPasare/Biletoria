import "./BuyTicketPage.css"
import ContentLayout from "../components/ContentLayout";
import NavigationBar from "../components/NavigationBar";
import { useLocation } from "react-router-dom";
import { useState } from "react"


const BuyTicketPage = () => {
    const [email, setEmail] = useState("");
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [passengers, setPassengers] = useState([]);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const { routeId, adultPrice, childPrice, departure, destination, date, maxNumberOfPassengers } = location.state || {};

    const formatDate = (isoString) => {
        if(!isoString) {
            return "";
        }

        const options = {
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }
        const date = new Date(isoString);
        return date.toLocaleString("ro-Ro", options);
    }

    const handleContinue = () => {
        if(!email.trim()) {
            alert("Email invalid!");
            return;
        }

        if(numberOfAdults === 0) {
            alert("Copiii trebuie însoțiți de cel puțin un adult!");
            return;
        }
        const passengers = numberOfAdults + numberOfChildren;
        if(passengers === 0) {
            alert("Trebuie să adaugi cel puțin un pasager!");
            return;
        }

        if(passengers > maxNumberOfPassengers) {
            alert(`Numărul de pasageri nu poate depăsi ${maxNumberOfPassengers}.`);
        }

        const newPassengers = [];

        for(let i = 0; i < numberOfAdults; i++) {
            newPassengers.push({ type: "Adult", name: "", lastName: ""});
        }

        for(let i = 0; i < numberOfChildren; i++) {
            newPassengers.push({ type: "Child", name: "", lastName: ""});
        }

        setPassengers(newPassengers);
        setShowForm(true);
        setMessage("");
    }


    const handleChange = (index, field, value) => {
        const updated = [...passengers];
        updated[index][field] = value;
        setPassengers(updated);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        for(const passenger of passengers) {
            if(!passenger.name.trim() || !passenger.lastName.trim()) {
                alert("Completați toate câmpurile pentru pasageri!");
                return;
            }
        }

        try {
            const ticketPromises = passengers.map(passenger => {
                const ticketData = {
                    routeId: routeId,
                    departureStationName: departure,
                    destinationStationName: destination,
                    firstName: passenger.name,
                    lastName: passenger.lastName,
                    passengerType: passenger.type.toUpperCase(),
                    departureDate: new Date(date).toISOString().slice(0, 19),
                    email: email
                };
                console.log(ticketData)
                return fetch("http://localhost:8080/ticket", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                })
                .then(response => {
                    if(!response.ok) {
                        throw new Error("Response for passengers data was not ok!", response.message);
                    }
                    return response.json();
                });
            });

            await Promise.all(ticketPromises);
        
            const total = numberOfAdults * adultPrice + numberOfChildren * childPrice;

            let summary = `Biletul a fost rezervat cu success!\nUn email cu acesta a fost trimis la adresa ${email}\nRută Cluj-Napoca -> Bucuresti\n\nPasageri:`;
        
            passengers.forEach((p, index) => {
                summary += `\n${index + 1}. ${p.type}: ${p.name} ${p.lastName}`;
            });

            summary += `\n\nTotal plată: ${total} RON`;
            setMessage(summary.replace(/\n/g, "<br>"));
        }
        catch(error) {
            console.error("Error booking tickets: ", error);
            alert("A apărut o eroare la rezervarea biletului");
        }
    }

    return(
        <ContentLayout>
            <NavigationBar></NavigationBar>
            <div className="ticket-container">
                <h2>Cumpără Bilet</h2>
                <div>
                    <label>Rută selectată</label>
                    <div className="route">{departure} → {destination}, {formatDate(date)}</div>
                </div>
                <div className="price-box">
                    <p><strong>Preț adult:</strong> {adultPrice} RON</p>
                    <p><strong>Preț copil:</strong> {childPrice} RON</p>
                </div>
                <div>
                    <label htmlFor="ticket-email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="ticket-email" placeholder="andrei.ionescu@gmail" required/>
                </div>
                <div>
                    <label htmlFor="number-Of-Adults">Adulți</label>
                    <input type="number" id="number-Of-Adults" min="0" value={numberOfAdults} onChange={(e) => setNumberOfAdults(Number(e.target.value))}/>
                </div>
                <div>
                    <label htmlFor="number-Of-Children">Copii</label>
                    <input type="number" id="number-Of-Children" min="0" value={numberOfChildren} onChange={(e) => setNumberOfChildren(Number(e.target.value))}/>
                </div>
                <button className="ticket-button" onClick={handleContinue}>Continuă</button>
                
                {showForm && (
                    <form onSubmit={handleSubmit}>
                        {passengers.map((p, i) => (
                            <div key={i} className="person-group">
                                <h4>{p.type} {p.type === "Adult" ? i + 1: i + 1 - numberOfAdults + 1}</h4>
                                <div>
                                    <label>Nume</label>
                                    <input type="text" required value={p.name} onChange={(e) => handleChange(i, "name", e.target.value)} placeholder={`Nume ${p.type.toLowerCase()} ${i + 1}`} />
                                </div>
                                <div>
                                    <label>Prenume</label>
                                    <input type="text" required value={p.lastName} onChange={(e) => handleChange(i, "lastName", e.target.value)} placeholder={`Prenume ${p.type.toLowerCase()} ${i + 1}`} />
                                </div>
                            </div>
                        ))}
                        <button className="ticket-button reserve-button" type="submit">Rezervă Bilet</button>
                    </form>
                )}
                {message && <div dangerouslySetInnerHTML={{__html: message }} />}
            </div>
        </ContentLayout>
    );
};

export default BuyTicketPage;