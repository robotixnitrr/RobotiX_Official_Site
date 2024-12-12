import React, { useState, useEffect } from 'react';
import { createComment, getCommentsForPost, editComment, deleteComment, likeComment } from '../api/commentApi';
import { getUser } from '../api/userApi';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function CommentSection({ postId }) {
  const user = useSelector(state => state.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState({ content: '', author: user.userid });
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [updatedComment, setUpdatedComment] = useState({ content: '' });
  const [authorNames, setAuthorNames] = useState({});

  // console.log("user: " + user, newComment)

  useEffect(() => {
    const fetchAuthorNames = async () => {
      const namesMap = { ...authorNames };

      await Promise.all(
        comments.map(async (comment) => {
          if (!namesMap[comment._id]) {
            try {
              const response = await getUser(comment.author);
              namesMap[comment._id] = response.data.username;
            } catch (error) {
              // console.log(error);
              namesMap[comment._id] = 'Unknown Author';
            }
          }
        })
      );

      setAuthorNames(namesMap);
    };

    fetchAuthorNames();
  }, [comments]);

  useEffect(() => {
    getCommentsForPost(postId)
      .then((response) => setComments(response.data))
      .catch((error) => console.log(error));
  }, [postId]);  

  const handleAddComment = (e) => {
    e.preventDefault();
    setNewComment({ ...comments, author: user.userid })

    // if (!user || !user._id) {
    //   console.log("User is not logged in or user ID is not available.");
    //   navigate('/log-in')
    //   return;
    // }

    // createComment({ ...newComment, author: user.userId, post: postId })
    createComment({ ...newComment, post: postId })
      .then((response) => setComments([...comments, response.data]))
      .catch((error) => console.log(error));
      

    setNewComment({ content: '', author: user.userid });
    console.log(newComment);

  };

  const handleLike = (commentId) => {
    likeComment(commentId)
      .then(() => setComments(
        comments.map((comment) =>
          comment._id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
        )
      ))
      .catch((error) => console.log(error));
  };

  const handleEditComment = (commentId, commentContent) => {
    setEditingCommentId(commentId);
    setUpdatedComment({ content: commentContent });
  };

  const handleUpdateComment = (e) => {
    e.preventDefault();
    editComment(editingCommentId, updatedComment)
      .then((response) => {
        setComments(
          comments.map((comment) =>
            comment._id === editingCommentId ? response.data : comment
          )
        );
        setEditingCommentId(null);
        setUpdatedComment({ content: '' });
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteComment = (commentId) => {
    deleteComment(commentId)
      .then(() => setComments(comments.filter((comment) => comment._id !== commentId)))
      .catch((error) => console.log(error));
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-bold text-gray-900 dark:text-yellow-500">Comments</h3>

      <form onSubmit={handleAddComment} className="space-y-4 bg-gray-100 dark:bg-gray-800 p-5 rounded-lg shadow-md">
        <textarea
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-yellow-500 placeholder-opacity-100"
          placeholder="Add a comment"
          value={newComment.content}
          onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
          rows="4"
        />
        {/* <input
          type="text"
          placeholder="Author ID"
          value={newComment.author}
          onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
          className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-yellow-500 transition-all duration-200 placeholder-yellow-500 bg-gray-800"
          required
        /> */}
        <button
          type="submit"
          className="w-full px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200 shadow-md"
        >
          Comment
        </button>
      </form>

      {comments.map((comment) => (
        <div
          key={comment._id}
          className="p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 space-y-3"
        >
          {editingCommentId === comment._id ? (
            <form onSubmit={handleUpdateComment} className="space-y-3">
              <textarea
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                value={updatedComment.content}
                onChange={(e) => setUpdatedComment({ content: e.target.value })}
                rows="3"
              />
              <div className="space-x-3">
                <button
                  type="submit"
                  className="px-5 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors duration-200"
                >
                  Update
                </button>
                <button
                  type="button"
                  className="px-5 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Author: {authorNames[comment._id]}</strong>
              </p>
              <p className="text-gray-800 dark:text-gray-300 text-base">{comment.content}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Likes: {comment.likes}</p>

              <div className="space-x-3">
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                  onClick={() => handleLike(comment._id)}
                >
                  Like
                </button>
                {comment.author === user.userid &&
                  <button
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                }
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default CommentSection;
