import React from "react";
import { useState } from "react";
import Header from "./header";
import Main from "./main";

export default function FakeStackOverflow() {
    const [search, setSearch] = useState("");
    const [mainTitle, setMainTitle] = useState("All Questions");
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userName, setUsername] = useState("")
    const [showLoginPage, setShowLoginPage] = useState(false)


    const setQuesitonPage = (search = "", title = "All Questions") => {
        setShowLoginPage(false);
        setSearch(search);
        setMainTitle(title);

    };
    return (
        <>
            <Header search={search}
                setQuesitonPage={setQuesitonPage}
                isLoggedIn={isLoggedIn}
                setShowLoginPage={setShowLoginPage}
                userName={userName}
                setIsLoggedIn={setIsLoggedIn} />
            <Main
                title={mainTitle}
                search={search}
                setQuesitonPage={setQuesitonPage}
                isLoggedIn={isLoggedIn}
                setShowLoginPage={setShowLoginPage}
                showLoginPage={showLoginPage}
                setIsLoggedIn={setIsLoggedIn}
                setUsername={setUsername}
            />
        </>
    );
}
