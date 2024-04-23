const express = require("express");
const Tag = require("../models/tags");
const { getQuestionsByOrder } = require('../utils/question');

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
    let questions = await getQuestionsByOrder("newest");
    let tags=await Tag.find({})
    let getQuestionCountByTag = (t_name) => {
        let cnt = 0;

        questions.forEach((q) => {

            q.tags.forEach((t) => {
                if (t.name=== t_name)
                cnt++;
            });
        });

        return cnt;
    };
    let resp=[]

    tags.forEach((t)=>{
        let count=0


    count=getQuestionCountByTag(t.name)
    resp.push({name:t.name,qcnt:count})})
    res.json(resp)

};

// add appropriate HTTP verbs and their endpoints to the router.
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber
)


module.exports = router;
