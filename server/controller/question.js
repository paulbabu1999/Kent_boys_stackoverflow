const express = require('express');
const Question = require("../models/questions");
const { addTag, getQuestionsByOrder, filterQuestionsBySearch, removeUpvote, removeDownvote } = require('../utils/question');
const authenticate = require("../middleWare/authenticate")
const checkLoggedIn = require("../middleWare/checkLoggedIn")

const { computeVote } = require("../utils/computeVote");
const Tag = require('../models/tags');


const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {

    try {
        const { order, search } = req.query;


        let ordered_questions = await getQuestionsByOrder(order)
        let filtered_questions = filterQuestionsBySearch(ordered_questions, search)
        res.json(filtered_questions);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {

    {

        let qid = req.params.qid;

        try {
            let questions = await Question.findOneAndUpdate(
                { _id: qid }, // Filter by document ID
                { $inc: { views: 1 } },
                { returnDocument: "after" }, // Update to be applied
            ).populate('answers')
            let voteCalcAns = computeVote(questions.answers, req.userId)
            const modifiedAnswers = [];
            for (const item of voteCalcAns) {
                const { upvote_list, downvote_list, ...rest } = item; // Destructuring
                modifiedAnswers.push(rest);
            }

            let voteCalcQuestion = computeVote([questions], req.userId)[0]
            const { upvote_list, downvote_list, ...rest } = voteCalcQuestion; // Destructuring
            res.json({ ...rest, answers: modifiedAnswers });

        } catch (error) {
            console.error("Error fetching questions:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    };

};

// To add Question
const addQuestion = async (req, res) => {

    async function questionCreate(title, text, tags, answers, asked_by, ask_date_time, views) {
        const qstndetail = {
            title: title,
            text: text,
            tags: tags,
        }
        if (answers != false) qstndetail.answers = answers;
        if (asked_by != false) qstndetail.asked_by = asked_by;

        if (ask_date_time != false) qstndetail.ask_date_time = ask_date_time;
        if (views != false) qstndetail.views = views;

        try {
            let saved = await Question.create(qstndetail);
            return saved;
        } catch (error) {
            console.error('Error saving question:', error);
            throw error;
        }
    }


    let { title, text, tags, asked_by, ask_date_time } = req.body;
    let tag_id_list = []

    for (let t in tags) {
        tag_id_list.push(await addTag(tags[t]))
    }


    let created_q = await questionCreate(title, text, tag_id_list, false, asked_by === undefined ? false : asked_by, ask_date_time === undefined ? false : ask_date_time, 0)
    res.json(created_q);


};


const upvoteQuestion = async (req, res) => {
    const { qid } = req.body;
    let username = req.userId

    // try {
    let question = await Question.findById(qid);




    if (!question) {

        return res.status(404).json({ msg: "Question not found" });
    }

    if (!username) {
        return res.status(404).json({ msg: "User not found!" });
    }

    if (question.upvote_list.includes(username)) {

        question = removeUpvote(question, username)
        await question.save()

        return res.json({ msg: "Upvote removed" });
    }

    if (question.downvote_list.includes(username)) {
        question = removeDownvote(question, username)
    }


    question.upvote_list.push(username);
    await question.save();


    res.json({ msg: "Upvote Success" });
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
};

// Downvote a Question
const downvoteQuestion = async (req, res) => {
    const { qid } = req.body;
    let username = req.userId


    try {
    let question = await Question.findById(qid);

    if (!question) {
        return res.status(404).json({ msg: "Question not found" });
    }

    if (!username) {
        return res.status(404).json({ msg: "User not found!" });
    }

    // Check if the user has already downvoted
    if (question.downvote_list.includes(username)) {
        question.downvote_list = removeDownvote(question, username);

        await question.save();
        return res.json({ msg: "Downvote cancelled successfully" });
    }

    // Remove user from upvotes if they are present
    if (question.upvote_list.includes(username)) {

        question = removeUpvote(question, username)

    }

    question.downvote_list.push(username);
    await question.save();

    res.json({ msg: "Question downvoted successfully " });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editQuestion = async (req, res) => {

    let questions = await getQuestionsByOrder("newest");
    let getQuestionCountByTag = (t_name) => {
        let cnt = 0;

        questions.forEach((q) => {

            q.tags.forEach((t) => {
                if (t.name === t_name)
                    cnt++;
            });
        });

        return cnt;
    };

    let { _id, title, text, tags, asked_by, ask_date_time } = req.body;
    let question = await Question.findById(_id);

    question.text = text
    question.asked_by = asked_by
    question.ask_date_time = ask_date_time
    question.title = title
    if (question.asked_by != req.username)
        return res.status(401).json({ message: 'Unauthorized invalid user' });


    for (let t in question.tags) {
        if (getQuestionCountByTag(t) === 1) {
            await Tag.findOneAndRemove({ name: t })
        }
    }
    let tag_id_list = []
    for (let t in tags) {
        tag_id_list.push(await addTag(tags[t]))
    }
    question.tags = tag_id_list
    await question.save()
    return res.json({ msg: "Edit Success" });
};



// Add appropriate HTTP verbs and their endpoints to the router.
router.get("/getQuestion",
    getQuestionsByFilter
);
router.get("/getQuestionById/:qid", checkLoggedIn,

    getQuestionById
);
router.post("/addQuestion", authenticate, addQuestion);
router.post("/upvoteQuestion", authenticate,
    upvoteQuestion
);
router.post("/downvoteQuestion", authenticate, downvoteQuestion);

router.post("/editQuestion", authenticate, editQuestion)

module.exports = router;
