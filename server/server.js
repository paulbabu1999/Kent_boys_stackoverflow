const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const checkLoggedIn=require("./middleWare/checkLoggedIn")


const MONGO_URL = "mongodb://127.0.0.1:27017/fake_so";
// const MONGO_URL = "mongodb://mongodb:27017/fake_so";

const CLIENT_URL = "http://localhost:3000";
const port = 8000;

mongoose.connect(MONGO_URL);

const app = express();

app.use(
    cors({
        credentials: true,
        origin: [CLIENT_URL],
    })
);
app.use(cookieParser());

app.use(express.json());


app.get("", (req, res) => {
    res.send("hello world");
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const loginController = require("./controller/user");

// Apply routes
app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/user", loginController);

const server = app.listen(port, () => {
    console.log(`Server starts at http://localhost:${port}`);
});

process.on("SIGINT", () => {
    server.close();
    mongoose.disconnect();
    console.log("Server closed. Database instance disconnected");
    process.exit(0);
});

module.exports = server;
