const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
  function tagCreate(name) {
    let tag = new Tag({ name: name });
    return tag.save();
  }
  let tag = await Tag.findOne({ name: tname });

  if (tag !== null) {
    return tag._id.toString();
  }

  tag = await tagCreate(tname);
  return tag._id;
};

const getQuestionsByOrder = async (order = "newest") => {
  var questions
  questions = await Question.find({},{"title":1,"text":1,"asked_by":1,"ask_date_time":1,"views":1,"tags":1,"answers":1})
    .populate(["tags"])
  questions.sort((a, b) => b.ask_date_time - a.ask_date_time)

  if (order === "unanswered") {
    questions = questions.filter((q) => q.answers.length === 0)
  }
  if (order === "active") {

    let findRecentAns = (data) => {
      if (data.length === 0) {
        return new Date(-1)
      }
      return data.reduce((max, u) => u.ans_date_time > max ? u.ans_date_time : max, new Date(-1));
    };
    let latest_ans = []


    let getActiveQuestion = () => {
      questions.forEach((q) => {

        let to_push = findRecentAns(q.answers, q.ask_date_time)

        latest_ans.push([q, to_push])
      });
    };
    getActiveQuestion();
    latest_ans.sort((a, b) => {


      return b[1] - a[1]
    });


    questions = latest_ans.map((ans) => ans[0])


  }



  return questions;


};


const filterQuestionsBySearch = (qlist, search) => {
  let parseTags = (search) => {
    return (search.match(/\[([^\]]+)\]/g) || []).map((word) =>
      word.slice(1, -1)
    );
  };

  let parseKeyword = (search) => {
    return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
  };
  let checkKeywordInQuestion = (q, keywordlist) => {
    for (let w of keywordlist) {
      if (
        q.title.toLowerCase().includes(w.toLowerCase()) ||
        q.text.toLowerCase().includes(w.toLowerCase())
      ) {
        return true;
      }
    }

    return false;
  };

  let checkTagInQuestion = (q, taglist) => {
    for (let tag of taglist) {
      for (let _ of q.tags) {
        if (tag === _.name) {
          return true;
        }
      }
    }

    return false;
  };


  let searchTags = parseTags(search);
  let searchKeyword = parseKeyword(search);

  const res = qlist.filter((q) => {
    if (searchKeyword.length == 0 && searchTags.length == 0) {
      return true;
    } else if (searchKeyword.length == 0) {
      return checkTagInQuestion(q, searchTags);
    } else if (searchTags.length == 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    } else {
      return (
        checkKeywordInQuestion(q, searchKeyword) ||
        checkTagInQuestion(q, searchTags)
      );
    }
  });
  return res;
};

const removeUpvote=  (item,userId)=>{
  let upvote_list = item.upvote_list.filter(id =>
    id.toString()!== userId);
item.upvote_list=upvote_list
return item
};

const removeDownvote=(item,userId)=>{
  let downvote_list = item.downvote_list.filter(id =>
    id.toString()!== userId);
item.downvote_list=downvote_list
return item

};




module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch ,removeUpvote,removeDownvote};
