import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PostView.css';
import { updatePost, deletePost } from './reducer';
import * as postClient from './client';

interface Answer {
  _id: string;
  text: string;
  author: string;
  date: Date;
  isInstructorAnswer: boolean;
}

interface Discussion {
  _id: string;
  text: string;
  author: string;
  date: Date;
  isResolved: boolean;
  replies: Reply[];
}

interface Reply {
  _id: string;
  text: string;
  author: string;
  date: Date;
  parentDiscussion: string;
}

interface PostViewProps {
  post: any;
  onClose: () => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [instructorAnswer, setInstructorAnswer] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState(post);

  const isInstructor = currentUser?.role === 'instructor';
  const isAuthor = currentUser?._id === post.postBy;
  const canEdit = isInstructor || isAuthor;

  const handleEditPost = async () => {
    try {
      const updatedPost = await postClient.updatePost(post._id, editedPost);
      dispatch(updatePost(updatedPost));
      setEditMode(false);
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postClient.deletePost(post._id);
        dispatch(deletePost(post._id));
        onClose();
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const handleSubmitAnswer = async (isInstructor: boolean) => {
    const answerText = isInstructor ? instructorAnswer : studentAnswer;
    if (!answerText.trim()) return;

    try {
      // TODO: Implement answer submission
      // Reset the answer field
      if (isInstructor) {
        setInstructorAnswer('');
      } else {
        setStudentAnswer('');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  return (
    <div className="post-view">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-meta">
          <span className="post-type">{post.postType === 'question' ? '❓' : '📢'}</span>
          <span className="post-folder">{post.folders.join(', ')}</span>
          <span className="post-views">{post.viewCount} views</span>
          <span className="post-author">Posted by {post.postBy}</span>
        </div>
        {canEdit && (
          <div className="post-actions">
            <button onClick={() => setEditMode(!editMode)}>Edit</button>
            <button onClick={handleDeletePost}>Delete</button>
          </div>
        )}
      </div>

      {/* Post Content */}
      <div className="post-content">
        {editMode ? (
          <>
            <input
              type="text"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              className="edit-title"
            />
            <ReactQuill
              value={editedPost.text}
              onChange={(value) => setEditedPost({ ...editedPost, text: value })}
            />
            <div className="edit-actions">
              <button onClick={handleEditPost}>Save</button>
              <button onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h2>{post.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: post.text }} />
          </>
        )}
      </div>

      {/* Student Answers Section */}
      {post.postType === 'question' && (
        <div className="answers-section">
          <h3>Student Answers</h3>
          {/* TODO: Display student answers */}
          {!isInstructor && (
            <div className="answer-editor">
              <ReactQuill
                value={studentAnswer}
                onChange={setStudentAnswer}
                placeholder="Write your answer here..."
              />
              <button onClick={() => handleSubmitAnswer(false)}>Submit Answer</button>
            </div>
          )}
        </div>
      )}

      {/* Instructor Answers Section */}
      {post.postType === 'question' && (
        <div className="answers-section">
          <h3>Instructor Answers</h3>
          {/* TODO: Display instructor answers */}
          {isInstructor && (
            <div className="answer-editor">
              <ReactQuill
                value={instructorAnswer}
                onChange={setInstructorAnswer}
                placeholder="Write your answer here..."
              />
              <button onClick={() => handleSubmitAnswer(true)}>Submit Answer</button>
            </div>
          )}
        </div>
      )}

      {/* Followup Discussions Section */}
      <div className="discussions-section">
        <h3>Followup Discussions</h3>
        {/* TODO: Display existing discussions */}
        <div className="new-discussion">
          <ReactQuill
            value={newDiscussion}
            onChange={setNewDiscussion}
            placeholder="Start a new followup discussion..."
          />
          <button onClick={() => {/* TODO: Handle new discussion */}}>
            Start Discussion
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostView; 