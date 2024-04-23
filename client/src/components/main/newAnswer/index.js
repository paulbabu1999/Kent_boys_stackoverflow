import "./index.css";
import { useState,useEffect } from "react";
import Form from "../baseComponents/form";
import Textarea from "../baseComponents/textarea";
import { validateHyperlink } from "../../../tool";
import { addAnswer,editAnswer } from "../../../services/answerService";

const NewAnswer = ({ qid, handleAnswer,isLoggedIn, setShowLoginPage,setIsEditAnswer = () => null, fillAnswer }) => {
    const [text, setText] = useState("");
    const [textErr, setTextErr] = useState("");
    useEffect(() => {
        if(fillAnswer) {
            setText(fillAnswer.text || '');
        }
    },[fillAnswer])

    const postAnswer = async () => {
        let isValid = true;


        if (!text) {
            setTextErr("Answer text cannot be empty");
            isValid = false;
        }

        // Hyperlink validation
        if (!validateHyperlink(text)) {
            setTextErr("Invalid hyperlink format.");
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const answer = {
            text: text,
            ans_by: localStorage.username,
            ans_date_time: new Date(),
        };
        try{
            let res = ''
            if (fillAnswer) {


                answer._id=fillAnswer._id
                 res = await editAnswer(answer);
            }
            else{

        res = await addAnswer(qid, answer);
            }
        if (res && res._id) {
            handleAnswer(qid);
        }
        setIsEditAnswer(false)
    }
    catch(err){
        console.log("error")
        setShowLoginPage(true)
    }
    };
    if (!isLoggedIn) {
        setShowLoginPage(true)
    }
    return (
        <Form>
            <Textarea
                title={"Answer Text"}
                id={"answerTextInput"}
                val={text}
                setState={setText}
                err={textErr}
            />
            <div className="btn_indicator_container">
                <button
                    className="form_postBtn"
                    onClick={() => {
                        postAnswer();
                    }}
                >
                    Post Answer
                </button>
                <div className="mandatory_indicator">
                    * indicates mandatory fields
                </div>
            </div>
        </Form>
    );
};

export default NewAnswer;
