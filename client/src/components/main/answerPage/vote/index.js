import React, { useState,useEffect } from 'react';
import { downvoteQuestion,getQuestionById, upvoteQuestion } from '../../../../services/questionService';
import { downvoteAnswer,  upvoteAnswer } from '../../../../services/answerService';
import "./index.css";


const voteComponent = ({ item,category,isLoggedIn,setShowLoginPage}) => {
    const [count, setCount] = useState(0);

    const [voted, setVoted] = useState(0); // 0 for not voted, 1 for upvote, -1 for downvote
    useEffect(() => {
        setCount(item.voteCount);
        setVoted(item.flag);

    },[item]);





    const handleVote = async (type) => {
        if (!isLoggedIn) {
            setShowLoginPage(true)
        }

        try {
            if (type === 'upvote' && voted !== 1) {
                if (category === "question") {
                    await upvoteQuestion(item._id);
                } else {
                    await upvoteAnswer(item._id);
                }

                setCount(count + (voted === -1 ? 2 : 1));
                setVoted(1);
            }
            else if (type === 'downvote' && voted !== -1) {
                if (category === "question") {
                    await downvoteQuestion(item._id);
                } else {
                    await downvoteAnswer(item._id);
                }

                setCount(count - (voted === 1 ? 2 : 1));
                setVoted(-1);
            }

            else if ((type === 'upvote' && voted === 1) ) {
                if (category === "question") {
                    await upvoteQuestion(item._id);
                } else {
                    await upvoteAnswer(item._id);
                }

                setCount(count -1);
                setVoted(0);
            } else if (type === 'downvote' && voted === -1) {

                if (category === "question") {
                    await downvoteQuestion(item._id);
                } else {
                    await downvoteAnswer(item._id);
                }

                setCount(count + 1);
                setVoted(0);

            }
            if (category==="question")
                await getQuestionById(item._id);

        } catch (error) {
            console.error('Error:', error);
        }
    };




    return (
        <div className="flex items-center">
        <button className={`button upvote ${voted === 1 ? 'pressed' : ''}`} onClick={() => handleVote('upvote')}>
            Upvote
        </button>
        <span className='ml-2' >{count}</span>

        <button className={`button downvote ${voted === -1 ? 'pressed' : ''}`} onClick={() => handleVote('downvote')}>
            Downvote
        </button>
    </div>
    );
};

export default voteComponent;
