const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {

        title:{
            type:String,
        },
        text:{
            type:String,
        },
        asked_by:{
            type:String,
        },
        ask_date_time:{
            type:Date
        },
        views:{
            type: Number,
            default:0
        },
        answers:[{

            type:mongoose.Schema.Types.ObjectId,
            ref:'Answer'


        }],
        tags:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Tag',
        }],
        upvote_list: [{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'// Array of user IDs for downvotes
            },


        ],
        downvote_list: [{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'// Array of user IDs for downvotes
            },
        ]
    },

    { collection: "Question" }
);
