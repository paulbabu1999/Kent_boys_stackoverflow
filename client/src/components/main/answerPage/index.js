import { useEffect, useState } from "react";
import { getMetaData } from "../../../tool";
import Answer from "./answer";
import AnswerHeader from "./header";
import "./index.css";
import QuestionBody from "./questionBody";
import { getQuestionById } from "../../../services/questionService";
import VoteComponent from "./vote";
import NewQuestion from "../newQuestion";
import NewAnswer from "../newAnswer";


// Component for the Answers page
const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, isLoggedIn, setShowLoginPage,handleQuestions,handleAnswer }) => {
    const [question, setQuestion] = useState({});
    const [isEdit, setIsEdit] = useState(false);
    const [isEditAnswer, setIsEditAnswer] = useState(false);
    const [answer,setAnswer]=useState({})

    useEffect(() => {
        const fetchData = async () => {
            let res = await getQuestionById(qid);
            setQuestion(res || {});
        };
        fetchData().catch((e) => console.log(e));
    }, [qid,isEdit,isEditAnswer]);





    return (
        isEdit ? (
            <NewQuestion
                handleQuestions={handleQuestions}
                isLoggedIn={isLoggedIn}
                setShowLoginPage={setShowLoginPage}
                fillQuestion={question}
                setIsEdit={setIsEdit}
            />
        ) :
        isEditAnswer?(<NewAnswer
             qid={qid}
             handleAnswer={handleAnswer}
             isLoggedIn= {isLoggedIn}
             fillAnswer={answer}
             setIsEditAnswer={setIsEditAnswer}
             setShowLoginPage={setShowLoginPage}

        />) :

            <>
                <AnswerHeader
                    ansCount={
                        question && question.answers && question.answers.length
                    }
                    title={question && question.title}
                    handleNewQuestion={handleNewQuestion}
                />
                {question && <VoteComponent item={question} category={"question"} isLoggedIn={isLoggedIn} setShowLoginPage={setShowLoginPage} />}

                <QuestionBody
                    views={question && question.views}
                    text={question && question.text}
                    askby={question && question.asked_by}
                    meta={question && getMetaData(new Date(question.ask_date_time))}
                />

                {question &&
                    question.answers &&
                    question.answers.map((a, idx) => (
                        <>
                            <VoteComponent item={a} category={"answer"} isLoggedIn={isLoggedIn} setShowLoginPage={setShowLoginPage} />
                            {(localStorage.username === a.ans_by) &&

                    <button
                        className="bluebtn ansButton"
                        onClick={() => {
                            setAnswer(a)
                            setIsEditAnswer(true);

                        }}
                    >
                        Edit Answer
                    </button>
                }

                            <Answer
                                key={idx}
                                text={a.text}
                                ansBy={a.ans_by}
                                meta={getMetaData(new Date(a.ans_date_time))}

                            />
                        </>

                    ))}


                <button
                    className="bluebtn ansButton"
                    onClick={() => {
                        handleNewAnswer();
                    }}
                >
                    Answer Question
                </button>

                {(localStorage.username === question.asked_by) &&
                    <button
                        className="bluebtn ansButton"
                        onClick={() => {
                            setIsEdit(true);
                        }}
                    >
                        Edit Question
                    </button>
                }
            </>
    );
};

export default AnswerPage;
