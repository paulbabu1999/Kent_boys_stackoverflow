import React, { useEffect, useState } from "react";
import { login } from "../services/loginService";
import CreateAccountPage from "../components/createAccount";

export default function LoginPage({ setIsLoggedIn, setUsername, setShowLoginPage }) {
    const [error, setError] = useState('');

    const [form_username, setFormUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showCreateAccountPage, setShowCreateAccountPage] = useState(false);

    const handleCreateAccount = () => {
        setShowCreateAccountPage(true);
    };

    useEffect(() => {
        setIsLoggedIn(false);
    }, [])

    const handleLogin = async () => {
        try {

            if (form_username && password) {
                const res = await login(form_username, password);

                if (res) {
                    setIsLoggedIn(true)
                    setUsername(form_username)
                    setShowLoginPage(false)
                    localStorage.setItem('username', form_username);


                }
            }
            else {
                setError("Enter Username and Password")
            }

        }
        catch
        {
            setError("Login Failed!! Try Again")

        }


    };

    return (<>

        {!showCreateAccountPage ? (
            <div className="login-container">
                <div className="login-form">
                    <div>
                        <h2 className="login-title">Login</h2>
                        <div className="form-group">
                            <label className="form-label">Username:</label>
                            <input
                                type="text"
                                className="form-input"
                                value={form_username}
                                onChange={(e) => setFormUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Password:</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="error-message">{error}</p>}

                        </div>
                        <button className="login-button" onClick={handleLogin}>Login</button>
                        <button className="create-account-button" onClick={handleCreateAccount}>Create Account</button>
                    </div>
                </div>
            </div>
        ) : (
            <CreateAccountPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setShowLoginPage={setShowLoginPage} />
        )}
    </>
    );
}
