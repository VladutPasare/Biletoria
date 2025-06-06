import "./NavigationBar.css"
import { Link } from 'react-router-dom'

function toogleMenu() {
    document.getElementById('navigationLinks').classList.toggle('show');
}

function NavigationBar() {
    return (
        <nav className="navigation-bar">
            <div className="navigation-bar-top">
                <div><p id="logo">biletoria</p></div>
                <div className="hamburger" onClick={toogleMenu}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className="navigation-links desktop">
                    <Link to="/acasa">Acasă</Link>
                    <Link to="/acasa">Intră în cont</Link>
                    <Link to="/acasa">Cum funcționeză</Link>
                    <Link to="/acasa">Contact</Link>
                </div>
            </div>
            <div className="navigation-links mobile" id="navigationLinks">
                <Link to="/acasa">Acasă</Link>
                <Link to="/acasa">Intră în cont</Link>
                <Link to="/acasa">Cum funcționeză</Link>
                <Link to="/acasa">Contact</Link>
            </div>
            
        </nav>
    );
}

export default NavigationBar;