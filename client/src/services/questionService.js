import { REACT_APP_API_URL, api } from "./config";

const QUESTION_API_URL = `${REACT_APP_API_URL}/question`;

// To get Questions by Filter
const getQuestionsByFilter = async (order = "newest", search = "") => {
    const res = await api.get(
        `${QUESTION_API_URL}/getQuestion?order=${order}&search=${search}`
    );

    return res.data;
};

// To get Questions by id
const getQuestionById = async (qid) => {
    const res = await api.get(`${QUESTION_API_URL}/getQuestionById/${qid}`);

    return res.data;
};

// To add Questions
const addQuestion = async (q) => {
    // const token = document.cookie.split('; ').find(cookie => cookie.startsWith('token=')).split('=')[1];

    // Make the request with the token as a header
    const res = await api.post(`${QUESTION_API_URL}/addQuestion`, q);
    return res.data;
};

const upvoteQuestion = async (qid) => {
    const data = { qid: qid };
    const res = await api.post(`${QUESTION_API_URL}/upvoteQuestion`, data);

    return res.data;
};

// To downvote a question
const downvoteQuestion = async (qid) => {
    const data = { qid: qid};
    const res = await api.post(`${QUESTION_API_URL}/downvoteQuestion`, data);

    return res.data;
};
const editQuestion = async (question) => {
    const res = await api.post(`${QUESTION_API_URL}/editQuestion`, question);

    return res.data;
};
export { getQuestionsByFilter, getQuestionById, addQuestion,upvoteQuestion,downvoteQuestion,editQuestion };
