import "./index.css";
import LoginPage from "../login"
import { useState } from "react";
import SideBarNav from "./sideBarNav";
import QuestionPage from "./questionPage";
import TagPage from "./tagPage";
import AnswerPage from "./answerPage";
import NewQuestion from "./newQuestion";
import NewAnswer from "./newAnswer";

// import { checkAuthentication } from "../../services/authService";

const Main = ({ search = "", title, setQuesitonPage,isLoggedIn,setShowLoginPage,showLoginPage,setIsLoggedIn,setUsername }) => {
    const [page, setPage] = useState("home");
    const [questionOrder, setQuestionOrder] = useState("newest");
    const [qid, setQid] = useState("");
    let selected = "";
    let content = null;

    const handleQuestions = () => {
        setShowLoginPage(false)
        setQuesitonPage();
        setPage("home");
    };

    const handleTags = () => {
        setShowLoginPage(false)

        setPage("tag");
    };

    const handleAnswer = (qid) => {
        setQid(qid);
        setPage("answer");
    };

    const clickTag = (tname) => {
        setQuesitonPage("[" + tname + "]", tname);
        setPage("home");
    };

    const handleNewQuestion = () => {
        setPage("newQuestion");
    };

    const handleNewAnswer = () => {
        setPage("newAnswer");
    };

    const getQuestionPage = (order = "newest", search = "") => {
        return (
            <QuestionPage
                title_text={title}
                order={order}
                search={search}
                setQuestionOrder={setQuestionOrder}
                clickTag={clickTag}
                handleAnswer={handleAnswer}
                handleNewQuestion={handleNewQuestion}
            />
        );
    };

    switch (page) {
        case "home": {
            selected = "q";
            content = getQuestionPage(questionOrder.toLowerCase(), search);
            break;
        }
        case "tag": {
            selected = "t";
            content = (
                <TagPage
                    clickTag={clickTag}
                    handleNewQuestion={handleNewQuestion}
                />
            );
            break;
        }
        case "answer": {
            selected = "";
            content = (
                <AnswerPage
                    qid={qid}
                    handleNewQuestion={handleNewQuestion}
                    handleNewAnswer={handleNewAnswer}
                    isLoggedIn={isLoggedIn}
                    setShowLoginPage={setShowLoginPage}
                    handleQuestions={handleQuestions}
                    handleAnswer={handleAnswer}
                />
            );
            break;
        }
        case "newQuestion": {

            selected = "";
            content = <NewQuestion handleQuestions={handleQuestions}
                                isLoggedIn= {isLoggedIn}
                                setShowLoginPage={setShowLoginPage}/>;
            break;
        }
        case "newAnswer": {
            selected = "";
            content = <NewAnswer qid={qid} handleAnswer={handleAnswer} isLoggedIn= {isLoggedIn}
            setShowLoginPage={setShowLoginPage}/>  ;
            break;
        }
        default:
            selected = "q";
            content = getQuestionPage();
            break;
    }

    return (
        <div id="main" className="main">
            <SideBarNav
                selected={selected}
                handleQuestions={handleQuestions}
                handleTags={handleTags}
            />
            <div id="right_main" className="right_main">
                {showLoginPage?(<LoginPage setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setShowLoginPage={setShowLoginPage}/>): content}
            </div>
        </div>
    );
};

export default Main;
