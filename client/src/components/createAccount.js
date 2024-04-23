import { useState } from "react";
import { createAccount } from "../services/loginService"; // Importing createAccount function from loginService

export default function CreateAccountPage({setIsLoggedIn, setUsername, setShowLoginPage} ) {
    const [form_username, setFormUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');




    const [error, setError] = useState('');

    const handleCreateAccount = async () => {
        try {
                if (fullName && form_username && password && confirmPassword) {
                    if (password !== confirmPassword) {
                        setError('Passwords do not match');
                        return;
                    }
                    if (password.length < 8) {
                        setError('Password must be at least 8 characters long');
                        return;
                    }
                const res = await createAccount(form_username, password,fullName); // Call service function to create user
                if (res.status===201) {
                    setIsLoggedIn(true)
                    setUsername(form_username)
                    setShowLoginPage(false)
                    localStorage.setItem('username', form_username);
            }
        }
            else {
                setError('Please enter username and password');
            }
        }

        catch (error1) {
            if (error1.response.status===409)
                setError("Username Already Exists")
            // Handle network errors or unexpected errors
        }
    }



    return (
        <div className="create-account-container">
            <div className="create-account-form">
                <h2 className="create-account-title">Create Account</h2>
                {error && <p className="error-message">{error}</p>}
                <div className="form-group">
                    <label className="form-label">Full Name:</label>
                    <input type="text" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Username:</label>
                    <input type="text" className="form-input" value={form_username} onChange={(e) => setFormUsername(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Password:</label>
                    <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="form-group">
                    <label className="form-label">Confirm Password:</label>
                    <input type="password" className="form-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button className="create-account-button" onClick={handleCreateAccount}>Create Account</button>
            </div>
        </div>
    );
}
