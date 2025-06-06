import "./BuyTicketPage.css"
import ContentLayout from "../components/ContentLayout";
import NavigationBar from "../components/NavigationBar";

import { useState } from "react"

const BuyTicketPage = () => {
    const [email, setEmail] = useState("");
    const [numberOfAdults, setNumberOfAdults] = useState(1);
    const [numberOfChildren, setNumberOfChildren] = useState(0);
    const [showForm, setShowForm] = useState(false);
    const [passengers, setPassengers] = useState([]);
    const [message, setMessage] = useState("");

    const handleContinue = () => {
        if(!email.trim()) {
            alert("Email invalid!");
            return;
        }

        if(numberOfAdults + numberOfChildren === 0) {
            alert("Trebuie sa adaugi cel puțin un pasager!");
            return;
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const total = numberOfAdults * 120 + numberOfChildren * 60;

        let summary = `Biletul a fost rezervat cu success!\nUn email cu acesta a fost trimis la adresa ${email}\nRută Cluj-Napoca -> Bucuresti\n\nPasageri:`;
        
        passengers.forEach((p, index) => {
            summary += `\n${index + 1}. ${p.type}: ${p.name} ${p.lastName}`;
        });

        summary += `\n\nTotal plată: ${total} RON`;
        setMessage(summary.replace(/\n/g, "<br>"));
    }

    return(
        <ContentLayout>
            <NavigationBar></NavigationBar>
            <div className="ticket-container">
                <h2>Cumpără Bilet</h2>
                <div>
                    <label>Rută selectată</label>
                    <div className="route">Cluj-Napoca → Bucuresti</div>
                </div>
                <div className="price-box">
                    <p><strong>Preț adult:</strong> 140 RON</p>
                    <p><strong>Preț copil:</strong> 50 RON</p>
                </div>
                <div>
                    <label for="ticket-email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="ticket-email" placeholder="andrei.ionescu@gmail" />
                </div>
                <div>
                    <label for="number-Of-Adults">Adulți</label>
                    <input type="number" id="number-Of-Adults" min="0" value={numberOfAdults} onChange={(e) => setNumberOfAdults(Number(e.target.value))} defaultValue="1"/>
                </div>
                <div>
                    <label for="number-Of-Children">Copii</label>
                    <input type="number" id="number-Of-Children" min="0" value={numberOfChildren} onChange={(e) => setNumberOfChildren(Number(e.target.value))} defaultValue="1"/>
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