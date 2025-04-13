import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Reply.css';
import { deleteReply, updateReply, addReply } from './reducer';
import * as replyClient from './client';

interface ReplyProps {
  reply: any;
  currentUser: any;
}

const Reply: React.FC<ReplyProps> = ({ reply, currentUser }) => {
  const dispatch = useDispatch();
  const { replies } = useSelector((state: any) => state.repliesReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(reply.text);
  const [newNestedReply, setNewNestedReply] = useState('');
  const [showReplyField, setShowReplyField] = useState(false);
  
  const isAuthor = currentUser?._id === reply.author;
  const isInstructor = currentUser?.role === 'FACULTY';
  const canEdit = isInstructor || isAuthor;

  // Filter nested replies for this reply
  const nestedReplies = replies.filter((r: any) => r.parentReply === reply._id);

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

  const handleEditReply = async () => {
    try {
      const updatedReply = await replyClient.updateReply(reply._id, {
        ...reply,
        text: editedText,
        isEdited: true,
        editDate: new Date(),
        editBy: currentUser?.username
      });
      dispatch(updateReply(updatedReply));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating reply:', error);
    }
  };

  const handleDeleteReply = async () => {
    if (window.confirm('Are you sure you want to delete this reply?')) {
      try {
        await replyClient.deleteReply(reply._id);
        dispatch(deleteReply(reply._id));
      } catch (error) {
        console.error('Error deleting reply:', error);
      }
    }
  };

  const handleSubmitNestedReply = async () => {
    if (!newNestedReply.trim()) return;
    
    try {
      const nestedReply = {
        discussion: reply.discussion,
        text: newNestedReply,
        author: currentUser?.username || 'unknown_username',
        date: new Date(),
        isEdited: false,
        parentReply: reply._id
      };
      
      const newReplyData = await replyClient.createReply(nestedReply);
      dispatch(addReply(newReplyData));
      setNewNestedReply('');
      setShowReplyField(false);
    } catch (error) {
      console.error('Error submitting nested reply:', error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="reply-item">
      {isEditing ? (
        <div className="reply-editor">
          <ReactQuill
            value={editedText}
            onChange={setEditedText}
            modules={modules}
            formats={formats}
          />
          <div className="edit-actions">
            <button onClick={handleEditReply}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="reply-header">
            <div className="reply-meta">
              <span className="reply-author">{reply.author}</span>
              <span className="reply-date">{formatDate(reply.date)}</span>
              {reply.isEdited && (
                <span className="reply-edited">
                  (edited {formatDate(reply.editDate)})
                </span>
              )}
            </div>
            {canEdit && (
              <div className="reply-actions">
                <button onClick={() => setIsEditing(true)}>Edit</button>
                <div className="dropdown">
                  <button className="dropdown-toggle">Actions</button>
                  <div className="dropdown-menu">
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={handleDeleteReply}>Delete</button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div
            className="reply-content"
            dangerouslySetInnerHTML={{ __html: reply.text }}
          />
          <div className="reply-footer">
            <button 
              className="reply-button"
              onClick={() => setShowReplyField(!showReplyField)}
            >
              Reply
            </button>
          </div>
        </>
      )}

      {/* Nested Reply Editor */}
      {showReplyField && (
        <div className="nested-reply-editor">
          <ReactQuill
            value={newNestedReply}
            onChange={setNewNestedReply}
            placeholder="Write your reply here..."
            modules={modules}
            formats={formats}
          />
          <div className="reply-actions">
            <button 
              className="submit-button"
              onClick={handleSubmitNestedReply}
              disabled={!newNestedReply.trim()}
            >
              Submit Reply
            </button>
            <button 
              className="cancel-button"
              onClick={() => {
                setNewNestedReply('');
                setShowReplyField(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Nested Replies */}
      {nestedReplies.length > 0 && (
        <div className="nested-replies">
          {nestedReplies.map((nestedReply: any) => (
            <Reply 
              key={nestedReply._id} 
              reply={nestedReply} 
              currentUser={currentUser} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reply;