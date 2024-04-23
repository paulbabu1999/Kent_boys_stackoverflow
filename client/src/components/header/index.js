import "./index.css";
import { useState } from "react";
import { logout } from "../../services/loginService";




const Header = ({ search, setQuesitonPage, isLoggedIn, setShowLoginPage, userName, setIsLoggedIn }) => {




    const handleLogout = async () => {
        await logout(userName);
        setIsLoggedIn(false)

    };
    const handleLogin = () => {
        setShowLoginPage(true)

    };




    const [val, setVal] = useState(search);
    return (
        <div id="header" className="header">
            <div></div>
            <div className="title">Fake Stack Overflow</div>
            <input
                id="searchBar"
                placeholder="Search ..."
                type="text"
                value={val}
                onChange={(e) => {
                    setVal(e.target.value);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        setQuesitonPage(e.target.value, "Search Results");
                    }
                }}
            />
            {isLoggedIn ? (
                <button className="logoutButton" onClick={handleLogout}>Log out</button>
            ) : (
                <button className="loginButton" onClick={handleLogin} >Login</button>
            )}
        </div>
    );
};

export default Header;
