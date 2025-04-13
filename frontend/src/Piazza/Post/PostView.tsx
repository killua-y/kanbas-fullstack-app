import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './PostView.css';
import '../Answer/Answer.css';
import { updatePost, deletePost } from './reducer';
import * as postClient from './client';
import * as answerClient from '../Answer/client';
import { setAnswers, addAnswer, clearAnswers } from '../Answer/reducer';
import Answer from '../Answer/Answer';

interface PostViewProps {
  post: any;
  onClose: () => void;
}

const PostView: React.FC<PostViewProps> = ({ post, onClose }) => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { answers } = useSelector((state: any) => state.answersReducer);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [instructorAnswer, setInstructorAnswer] = useState('');
  const [newDiscussion, setNewDiscussion] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editedPost, setEditedPost] = useState(post);

  const isInstructor = currentUser?.role === 'FACULTY';
  const isAuthor = currentUser?._id === post.postBy;
  const canEdit = isInstructor || isAuthor;

  // Fetch answers when post changes
  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const data = await answerClient.findAnswersForPost(post._id);
        dispatch(setAnswers(data));
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };

    if (post._id) {
      fetchAnswers();
    }

    // Clear answers when component unmounts
    return () => {
      dispatch(clearAnswers());
    };
  }, [post._id, dispatch]);

  // Quill editor modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image'],
      ['clean']
    ]
  };

  // Quill editor formats
  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image',
    'color', 'background'
  ];

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

  const handleSubmitAnswer = async (isInstructorAnswer: boolean) => {
    const answerText = isInstructorAnswer ? instructorAnswer : studentAnswer;
    if (!answerText.trim()) return;
  
    try {
      // Create the answer object without an _id - let the server generate it
      const answer = {
        post: post._id,
        text: answerText,
        author: currentUser?._id || '1', // Use current user ID or fallback to mock ID
        isInstructorAnswer: isInstructorAnswer,
        date: new Date(),
        isEdited: false
      };
  
      const newAnswer = await answerClient.createAnswer(answer);
      
      // Update state
      dispatch(addAnswer(newAnswer));
      
      // If this is an instructor answer, mark the post as resolved
      if (isInstructorAnswer) {
        const resolvedPost = await postClient.toggleResolvedStatus(post._id);
        dispatch(updatePost(resolvedPost));
      }
      
      // Reset the answer field
      if (isInstructorAnswer) {
        setInstructorAnswer('');
      } else {
        setStudentAnswer('');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  // Filter answers by type
  const studentAnswers = answers.filter((answer: any) => !answer.isInstructorAnswer);
  const instructorAnswers = answers.filter((answer: any) => answer.isInstructorAnswer);

  const hasStudentAnswer = studentAnswers.length > 0;
  const hasInstructorAnswer = instructorAnswers.length > 0;

  // Check if the current user can post an answer
  const canPostStudentAnswer = !isInstructor && !hasStudentAnswer;
  const canPostInstructorAnswer = isInstructor && !hasInstructorAnswer;

  return (
    <div className="post-view">
      {/* Post Header */}
      <div className="post-header">
        <div className="post-meta">
          <span className="post-type">{post.postType === 'question' ? '❓' : '📒'}</span>
          <span className="post-folder">{post.folders.join(', ')}</span>
          <span className="post-views">{post.viewCount} views</span>
          <span className="post-author">Posted by {post.postBy}</span>
        </div>
        {canEdit && (
          <div className="post-actions">
            <button onClick={() => setEditMode(!editMode)}>Edit</button>
            <div className="dropdown">
              <button className="dropdown-toggle">Actions</button>
              <div className="dropdown-menu">
                <button onClick={() => setEditMode(!editMode)}>Edit</button>
                <button onClick={handleDeletePost}>Delete</button>
              </div>
            </div>
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
              modules={modules}
              formats={formats}
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
          <h3 className="answers-section-header">Student Answers</h3>
          <div className="student-answer">
            {studentAnswers.length > 0 ? (
              studentAnswers.map((answer: any) => (
                <Answer 
                  key={answer._id} 
                  answer={answer} 
                  currentUser={currentUser} 
                />
              ))
            ) : (
              <div className="no-answers">No student answers yet</div>
            )}
          </div>
          
          {canPostStudentAnswer && (
            <div className="answer-editor">
              <ReactQuill
                value={studentAnswer}
                onChange={setStudentAnswer}
                placeholder="Write your answer here..."
                modules={modules}
                formats={formats}
              />
              <button 
                className="submit-button"
                onClick={() => handleSubmitAnswer(false)}
                disabled={!studentAnswer.trim()}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Instructor Answers Section */}
      {post.postType === 'question' && (
        <div className="answers-section">
          <h3 className="answers-section-header">Instructor Answers</h3>
          <div className="instructor-answer">
            {instructorAnswers.length > 0 ? (
              instructorAnswers.map((answer: any) => (
                <Answer 
                  key={answer._id} 
                  answer={answer} 
                  currentUser={currentUser} 
                />
              ))
            ) : (
              <div className="no-answers">No instructor answers yet</div>
            )}
          </div>
          
          {canPostInstructorAnswer && (
            <div className="answer-editor">
              <ReactQuill
                value={instructorAnswer}
                onChange={setInstructorAnswer}
                placeholder="Write your answer here..."
                modules={modules}
                formats={formats}
              />
              <button 
                className="submit-button"
                onClick={() => handleSubmitAnswer(true)}
                disabled={!instructorAnswer.trim()}
              >
                Submit Answer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Followup Discussions Section */}
      <div className="discussions-section">
        <h3 className="answers-section-header">Followup Discussions</h3>
        {/* TODO: Display existing discussions */}
        <div className="new-discussion">
          <ReactQuill
            value={newDiscussion}
            onChange={setNewDiscussion}
            placeholder="Start a new followup discussion..."
            modules={modules}
            formats={formats}
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