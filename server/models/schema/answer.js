const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        text:{
            type:String,
        },
        ans_by:{
            type:String,
        },
        ans_date_time:{
            type:Date,

        },
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
    { collection: "Answer" }
);
