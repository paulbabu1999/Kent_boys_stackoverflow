import { REACT_APP_API_URL, api } from "./config";

const ANSWER_API_URL = `${REACT_APP_API_URL}/answer`;

// To add answer
const addAnswer = async (qid, ans) => {
    const data = { qid: qid, ans: ans };
    const res = await api.post(`${ANSWER_API_URL}/addAnswer`, data);

    return res.data;
};
const upvoteAnswer = async (qid) => {
    const data = { qid: qid };
    const res = await api.post(`${ANSWER_API_URL}/upvoteAnswer`, data);

    return res.data;
};

// To downvote a question
const downvoteAnswer = async (qid) => {
    const data = { qid: qid};
    const res = await api.post(`${ANSWER_API_URL}/downvoteAnswer`, data);

    return res.data;
};
const editAnswer = async (answer) => {
    const res = await api.post(`${ANSWER_API_URL}/editAnswer`, answer);

    return res.data;
};

export { addAnswer,upvoteAnswer,downvoteAnswer,editAnswer  };
