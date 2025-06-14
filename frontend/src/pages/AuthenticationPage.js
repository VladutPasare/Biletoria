import "./AuthenticationPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom"


const AuthenticationPage = () => {
    const navigate = useNavigate();

    const [showRegister, setShowRegister] = useState(false);
    const [activeTab, setActiveTab] = useState("user");

    const [loginForm, setLoginForm] = useState({
        email: "",
        password: ""
    });

    const [userRegister, setUserRegister] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [companyRegister, setCompanyRegister] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        companyPhone: "",
        companyAddress: "",
    });

    const [loginErrors, setLoginErrors] = useState({});
    const [userRegisterErrors, setUserRegisterErrors] = useState({});
    const [companyRegisterErrors, setCompanyRegisterErrors] = useState({});

    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setLoginForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUserRegisterChange = (e) => {
        const { name, value } = e.target;
        setUserRegister(prev => ({ ...prev, [name]: value }));
    };

    const handleCompanyRegisterChange = (e) => {
        const { name, value } = e.target;
        setCompanyRegister(prev => ({ ...prev, [name]: value }));
    };

    const validateLogin = () => {
        const errors = {};

        if(!loginForm.email || !/^\S+@\S+\.\S+$/.test(loginForm.email)) {
            errors.email = "Introduceți o adresă de email validă!";
        }

        if(!loginForm.password) {
            errors.password = "Introduceți parola!";
        }
        setLoginErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateUserRegister = () => {
        const errors = {};

        if(!userRegister.firstName) {
            errors.firstName = "Introduceți prenumele dvs.!";
        }

        if(!userRegister.lastName) {
            errors.lastName = "Introduceți numele dvs. de familie!";
        }

        if(!userRegister.email || !/^\S+@\S+\.\S+$/.test(userRegister.email)) {
            errors.email = "Introduceți o adresă de email validă!";
        }

        if(!userRegister.password || userRegister.password.length < 6) {
            errors.password = "Password must be at least 6 characters!";
        }

        if(userRegister.password !== userRegister.confirmPassword) {
            errors.confirmPassword = "Parolele nu se potrivesc!";
        }
        setUserRegisterErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateCompanyRegister = () => {
        const errors = {};

        if(!companyRegister.firstName) {
            errors.firstName = "Introduceți prenumele dvs.!";
        }

        if(!companyRegister.lastName) {
            errors.lastName = "Introduceți numele dvs. de familie!";
        }

        if(!companyRegister.email || !/^\S+@\S+\.\S+$/.test(companyRegister.email)) {
            errors.email = "Introduceți o adresă de email validă!";
        }

        if(!companyRegister.password || companyRegister.password.length < 6) {
            errors.password = "Password must be at least 6 characters!";
        }

        if(companyRegister.password !== companyRegister.confirmPassword) {
            errors.confirmPassword = "Parolele nu se potrivesc!";
        }

        if(!companyRegister.companyName) {
            errors.companyName = "Introduce numele companiei!";
        }

        if(!companyRegister.companyPhone || !/^[0-9+ ]+$/.test(companyRegister.companyPhone)) {
            errors.companyPhone = "Număr de telefon invalid!";
        }

        if(!companyRegister.companyAddress) {
            errors.companyAddress = "Introduceți adresa sediului companiei!";
        }

        setCompanyRegisterErrors(errors);
        return Object.keys(errors).length === 0;
    }


    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        if(validateLogin()) {
            try {
                const response = await fetch("http://localhost:8080/authentication/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: loginForm.email,
                        password: loginForm.password
                    })
                });

                if(!response.ok) {
                    const errorData = await response.json();

                    if(errorData.error.includes("not yet approved")) {
                        alert("Contul de administrator nu a fost aprobat încă!");
                    } else if (errorData.error.includes("not active")){
                        alert("Contul este inactiv");
                    } else if(errorData.error.includes("Invalid credentials")){
                        alert("Email sau parolă incorectă!");
                    } else {
                        alert(errorData.error || "Eroare la autentificare!");
                    }
                    return;
                }

                const data = await response.json();

                if(data.userType === "PASSENGER") {
                    navigate("/passenger");
                } else if(data.userType === "COMPANY_ADMIN") {
                    navigate("/company");
                }
            } catch (error) {
                alert(error.message || "Login failed.");
            }
        }
    };

    const handleUserRegisterSubmit = async (e) => {
        e.preventDefault();

        if(validateUserRegister()) {
            try {
                const response = await fetch("http://localhost:8080/authentication/register/passenger", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept":  "application/json",
                    },
                    body: JSON.stringify({
                        firstName: userRegister.firstName,
                        lastName: userRegister.lastName,
                        email: userRegister.email,
                        password: userRegister.password,
                        confirmationPassword: userRegister.confirmPassword    
                    }), 
                    credentials: "include" // adaugat
                });
                
                if(!response.ok) {
                    const errorData = await response.json();

                    if(response.status === 409 && errorData.error.includes("already in use")) {
                        alert("Acest email este deja înregistrat!");
                    } else if(response.status === 400 && errorData.error.includes("Passwords don't match")) {
                        alert("Parolele nu coincid");
                    } else {
                        alert(errorData.error || "Eroare la înregistrare!");
                    }
                    return;
                }

                alert("Crearea contului s-a realizat cu succes!");
                setShowRegister(false);
                //Reset
                setUserRegister({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: ""
                });
            } catch(error) {
                alert(error.message || "Registration failed.");
            }
        }
    };

    const handleCompanyRegisterSubmit = async (e) => {
        e.preventDefault();

        if(validateCompanyRegister()) {
            try {

                const response = await fetch("http://localhost:8080/authentication/register/company", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        firstName: companyRegister.firstName,
                        lastName: companyRegister.lastName,
                        email: companyRegister.email,
                        password: companyRegister.password,
                        confirmationPassword: companyRegister.confirmPassword,
                        companyName: companyRegister.companyName,
                        companyPhone: companyRegister.companyPhone,
                        companyAddress: companyRegister.companyAddress
                    }), 
                    credentials: "include" // adaugat
                });

                if(!response.ok) {
                    const errorData = await response.json();

                    if(response.status === 409 && errorData.error.includes("already in use")) {
                        alert("Acest email este deja înregistrat!");
                    } else if(response.status === 400 && errorData.error.includes("Passwords don't match")) {
                        alert("Parolele nu coincid");
                    } else {
                        alert(errorData.error || "Eroare la înregistrare!");
                    }
                    return;
                }

                alert("Cererea a fost trimisă! Un email de confirmare va fi trimis imediat după ce aceasta va fi acceptată.")
                setShowRegister(false);
                setCompanyRegister({
                    firstName: "",
                    lastName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    companyName: "",
                    companyPhone: "",
                    companyAddress: ""
                });
            } catch (error) {
                alert(error.message || "Registration failed");
            }
        }
    };

    return (
    <div className="auth-layout">
        <div className="page-container">
                <div className="header">
                    <h1>Biletoria</h1>
                    <p>Înregistrează-te sau intră în cont</p>
                </div>
                <div className="auth-container">
                    {}
                    {!showRegister && (
                        <div className="auth-box">
                            <h2>Login</h2>
                            <form onSubmit={handleLoginSubmit}>
                                <div className="form-group">
                                    <label htmlFor="loginEmail">Email Address</label>
                                    <input type="email" id="loginEmail" name="email" value={loginForm.email} onChange={handleLoginChange} required/>
                                    {loginErrors.email && <div className="error">{loginErrors.email}</div>}
                                </div>
                                <div className="form-group">
                                    <label htmlFor="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" name="password" value={loginForm.password} onChange={handleLoginChange} required/>
                                    {loginErrors.password && <div className="error">{loginErrors.password}</div>}
                                </div>
                                <button type="submit" className="btn">Login</button>
                            </form>
                            <div className="switch-text">Nu ai cont?<button className="link-button" onClick={() => setShowRegister(true)}>Înregistrează-te aici</button></div>
                        </div>
                    )}
                    {}
                    {showRegister && (
                        <div className="auth-box" id="registerBox">
                            <div className="auth-tabs">
                                <div className={`auth-tab ${activeTab === "user" ? "active" : ""}`} onClick={() => setActiveTab("user")} >Pasager</div>
                                <div className={`auth-tab ${activeTab === "company" ? "active" : ""}`} onClick={() => setActiveTab("company")} >Admin companie</div>
                            </div>
                            {}
                            {activeTab === "user" && (
                                <div className="auth-content active" id="userRegister">
                                    <form onSubmit={handleUserRegisterSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="userFirstName">Prenume</label>
                                            <input type="text" id="userFirstName" name="firstName" value={userRegister.firstName} onChange={handleUserRegisterChange} required/>
                                            {userRegisterErrors.firstName && <div className="error">{userRegisterErrors.firstName}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userLastName">Nume</label>
                                            <input 
                                                type="text"
                                                id="userLastName"
                                                name="lastName"
                                                value={userRegister.lastName}
                                                onChange={handleUserRegisterChange}
                                                required
                                            />
                                            {userRegisterErrors.lastName && <div className="error">{userRegisterErrors.lastName}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userEmail">Adresa de Email</label>
                                            <input
                                                type="email"
                                                id="userEmail"
                                                name="email"
                                                value={userRegister.email}
                                                onChange={handleUserRegisterChange}
                                                required
                                            />
                                            {userRegisterErrors.email && <div className="error">{userRegisterErrors.email}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userPassword">Parolă</label>
                                            <input 
                                                type="password"
                                                id="userPassword"
                                                name="password"
                                                value={userRegister.password}
                                                onChange={handleUserRegisterChange}
                                                required
                                            />
                                            {userRegisterErrors.password && <div className="error">{userRegisterErrors.password}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="userConfirmationPassword">Confirmă parola</label>
                                            <input 
                                                type="password"
                                                id="userConfirmPassword"
                                                name="confirmPassword"
                                                value={userRegister.confirmPassword}
                                                onChange={handleUserRegisterChange}
                                                required
                                            />
                                            {userRegisterErrors.confirmPassword && <div className="error">{userRegisterErrors.confirmPassword}</div>}
                                        </div>
                                        <button type="submit" className="btn">Înregistrează-te</button>
                                    </form>
                                    <div className="switch-text">Ai deja un cont?<button className="link-button" onClick={() => setShowRegister(false)}>Conectează-te aici</button></div>
                                </div>
                            )}

                            {}
                            {activeTab === "company" && (
                                <div className="auth-content active" id="companyRegister">
                                    <div className="info-text">
                                        Conturile de administrare curse necesită aprobare de la administratorul central.
                                    </div>
                                    <form onSubmit={handleCompanyRegisterSubmit}>
                                        <div className="form-group">
                                            <label htmlFor="companyFirstName">Prenume</label>
                                            <input type="text" id="companyFirstName" name="firstName" value={companyRegister.firstName} onChange={handleCompanyRegisterChange} required/>
                                            {companyRegisterErrors.firstName && <div className="error">{companyRegisterErrors.firstName}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="companyLastName">Nume</label>
                                            <input type="text" id="companyLastName" name="lastName" value={companyRegister.lastName} onChange={handleCompanyRegisterChange} required/>
                                            {companyRegisterErrors.lastName && <div className="error">{companyRegisterErrors.lastName}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="companyEmail">Adresa de email</label>
                                            <input type="email" id="companyEmail" name="email" value={companyRegister.email} onChange={handleCompanyRegisterChange} required/>
                                            {companyRegisterErrors.email && <div className="error">{companyRegisterErrors.email}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="companyPassword">Parolă</label>
                                            <input type="password" id="companyPassword" name="password" value={companyRegister.password} onChange={handleCompanyRegisterChange} required/>
                                            {companyRegisterErrors.password && <div className="error">{companyRegisterErrors.password}</div>}
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="companyConfirmPassword">Confirmă Parola</label>
                                            <input type="password" id="companyConfirmPassword" name="confirmPassword" value={companyRegister.confirmPassword} onChange={handleCompanyRegisterChange} required/>
                                            {companyRegisterErrors.confirmPassword && <div className="error">{companyRegisterErrors.confirmPassword}</div>}
                                        </div>
                                        <div className="company-info">
                                            <div className="form-group">
                                                <label htmlFor="companyName">Numele companiei</label>
                                                <input type="text" id="companyName" name="companyName" value={companyRegister.companyName} onChange={handleCompanyRegisterChange} required/>
                                                {companyRegisterErrors.companyName && <div className="error">{companyRegisterErrors.companyName}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="companyPhone">Număr de telefon</label>
                                                <input type="tel" id="companyPhone" name="companyPhone" value={companyRegister.companyPhone} onChange={handleCompanyRegisterChange} required/>
                                                {companyRegisterErrors.companyPhone && <div className="error">{companyRegisterErrors.companyPhone}</div>}
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="companyAddress">Adresa</label>
                                                <input type="text" id="companyAddress" name="companyAddress" value={companyRegister.companyAddress} onChange={handleCompanyRegisterChange} required/>
                                                {companyRegisterErrors.companyAddress && <div className="error">{companyRegisterErrors.companyAddress}</div>}
                                            </div>
                                        </div>
                                        <button type="submit" className="btn">Cere Înregistrarea Contului de Admin</button>
                                    </form>
                                    <div className="switch-text">Deja ai un cont? <button className="link-button" onClick={() => setShowRegister(false)}>Conecteză-te aici</button></div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthenticationPage;