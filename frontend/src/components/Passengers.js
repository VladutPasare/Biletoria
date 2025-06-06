import { useState, useRef, useEffect } from "react" 
import "./Passengers.css"

function Passengers({adults, setAdults, children, setChildren}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerReference = useRef(null);

    const togglePassangerPanel = () => {
        setIsOpen((previous) => !previous);
    };

    const getSummary = () => {
        let summary = `${adults} Adult${adults > 1 ? "i" : ''}`;

        if(children > 0) {
            summary += `, ${children} Copi${children > 1 ? "i" : "l"}`;
        }
        return summary;
    }

    const updateCount = (person, q) => {
        if(person == "adult") {
            setAdults((previous) => Math.max(1, previous + q));
        }
        
        if(person == "child") {
            setChildren((previous) => Math.max(0, previous + q));
        }
    }

    const handleClickOutsideContainer = (e) => {
        if(containerReference.current && !containerReference.current.contains(e.target)) {
            setIsOpen(false);
        }
    }

    useEffect(() =>  {
        window.addEventListener("click", handleClickOutsideContainer);
        return () => window.removeEventListener("click", handleClickOutsideContainer);
    }, []);

    return (
        <div className="passengers-container" ref={containerReference}>
            <div className="passengers-toggle" onClick={togglePassangerPanel}>
                <span id="summary">{getSummary()}</span>
                <img className="arrow-down" src="/icons/keyboard_arrow_down_70dp_1F1F1F_FILL0_wght0_GRAD0_opsz48.svg" alt="extend"></img>
            </div>

            {isOpen && (
                <div className="dropdown-passangers-panel">
                    <div className="passenger-row">
                        <p>Adulți</p>
                        <div className="counter">
                            <button onClick={() => updateCount("adult", -1)}>-</button>
                            <span>{adults}</span>
                            <button onClick={() => updateCount("adult", 1)}>+</button>
                        </div>
                    </div>
                    <div className="passenger-row">
                        <p>Copii</p>
                        <div className="counter">
                            <button onClick={() => updateCount("child", -1)}>-</button>
                            <span>{children}</span>
                            <button onClick={() => updateCount("child", 1)}>+</button>
                        </div>
                    </div>
                </div>
        )}
        </div>
    );
}

export default Passengers;