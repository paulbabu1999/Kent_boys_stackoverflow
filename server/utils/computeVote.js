function computeVote(iter, userId) {
    const processed = iter.map(question => {
        // Calculate count of votes
        const upvotes = question.upvote_list.length;
        const downvotes = question.downvote_list.length;
        const voteCount = upvotes - downvotes;

        // Determine flag based on user's presence in upvote_list and downvote_list
        let flag = 0;
        if (userId === null) {
            flag = null;
        } else if (question.upvote_list.includes(userId)) {
            flag = 1;
        } else if (question.downvote_list.includes(userId)) {
            flag = -1;
        }





        return {
        ...question["_doc"],voteCount,flag
        };
    });
    return processed;

}
module.exports={computeVote}
