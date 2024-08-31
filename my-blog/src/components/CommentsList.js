import React from "react";

const CommentsList = ( {comments}) => {
    return (
        <>
        <h3>Comments:</h3>
        {comments.map(comment => {
            return (
                <div
                className="comment" 
                key={comment.postedBy + ':' + comment.text}
                >
                    <h4>{comment.postedBy || comment.email}</h4>
                    <p>{comment.text}</p>
                </div>
            )
        })}
        </>
    )
}

export default CommentsList;