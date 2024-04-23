const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");
const authenticate = require("../middleWare/authenticate");

const router = express.Router();

// Adding answer
const addAnswer = async (req, res) => {
    function  answerCreate(text, ans_by, ans_date_time) {
        let answerdetail = { text: text };
        if (ans_by != false) answerdetail.ans_by = ans_by;
        if (ans_date_time != false) answerdetail.ans_date_time = ans_date_time;



        return answerdetail;
    }
    let { text, ans_by, ans_date_time } = req.body.ans

    let added_ans =  answerCreate(text, ans_by === undefined ? false : ans_by, ans_date_time === undefined ? false : ans_date_time)
    let pushedAns=await Answer.create(added_ans)

    await Question.findByIdAndUpdate(
        req.body.qid,
        { $push: { answers: { $each: [pushedAns._id], $position: 0 } } },
        { new: true } // Ensure we get the updated question
    );
    res.json(pushedAns);


};

const upvoteAnswer = async (req, res) => {
    const { qid } = req.body;
    let username=req.userId


    try {
        let answer = await Answer.findById(qid);

        if (!answer) {
            return res.status(404).json({ msg: "Answer not found" });
        }

        if (!username) {
            return res.status(404).json({ msg: "User not found!" });
        }
//undo upvote
        if (answer.upvote_list.includes(username)) {
            answer.upvote_list = answer.upvote_list.filter(id => id !== username);
            await answer.save();
            return res.json({ msg: "Upvote removed" });
        }

        if (answer.downvote_list.includes(username)) {
            answer.downvote_list = answer.downvote_list.filter(id => id !== username);
        }

        answer.upvote_list.push(username);
        await answer.save();

        res.json({ msg: "Upvote Success" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Downvote a Question
const downvoteAnswer = async (req, res) => {
    const { qid } = req.body;
    let username=req.userId


    try {
        let answer = await Answer.findById(qid);

        if (!answer) {
            return res.status(404).json({ msg: "Answer not found" });
        }

        if (!username) {
            return res.status(404).json({ msg: "User not found!" });
        }

        // Check if the user has already downvoted
        if (answer.downvote_list.includes(username)) {
            answer.downvote_list = answer.downvote_list.filter(id => id !== username);
            await answer.save();
            return res.json({ msg: "Downvote cancelled successfully" });
        }

        // Remove user from upvotes if they are present
        if (answer.upvote_list.includes(username)) {
            answer.upvote_list = answer.upvote_list.filter(id => id !== username);
        }

        answer.downvote_list.push(username);
        await answer.save();

        res.json({ msg: "Question downvoted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editAnswer = async (req, res) => {



    let { _id, text, ans_by, ans_date_time } = req.body;
    let answer = await Answer.findById(_id);

    answer.text = text
    answer.ans_by = ans_by
    answer.ans_date_time = ans_date_time
    if (answer.ans_by != req.username)
        return res.status(401).json({ message: 'Unauthorized invalid user' });



    await answer.save()
    return res.json({ msg: "Edit Success" });
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post("/addAnswer",authenticate, addAnswer)
router.post("/upvoteAnswer",authenticate, upvoteAnswer
);
router.post("/downvoteAnswer",authenticate, downvoteAnswer);
router.post("/editAnswer", authenticate, editAnswer)


module.exports = router;
