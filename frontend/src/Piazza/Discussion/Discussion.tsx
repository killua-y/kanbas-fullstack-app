import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Discussion.css';
import { deleteDiscussion, updateDiscussion, toggleResolvedStatus } from './reducer';
import * as discussionClient from './client';
import Reply from "../Reply/Reply";
import { setReplies, addReply, clearReplies } from '../Reply/reducer';
import * as replyClient from '../Reply/client';

interface DiscussionProps {
  discussion: any;
  currentUser: any;
}

const Discussion: React.FC<DiscussionProps> = ({ discussion, currentUser }) => {
  const dispatch = useDispatch();
  const { replies } = useSelector((state: any) => state.repliesReducer);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(discussion.text);
  const [newReply, setNewReply] = useState('');
  const [showReplyField, setShowReplyField] = useState(false);
  
  const isAuthor = currentUser?._id === discussion.author;
  const isInstructor = currentUser?.role === 'FACULTY';
  const canEdit = isInstructor || isAuthor;

  // Filter replies for this discussion
  const discussionReplies = replies.filter((reply: any) => 
    reply.discussion === discussion._id && !reply.parentReply
  );

  // Fetch replies for this discussion
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const data = await replyClient.findRepliesForDiscussion(discussion._id);
        dispatch(setReplies(data));
      } catch (error) {
        console.error('Error fetching replies:', error);
      }
    };

    if (discussion._id) {
      fetchReplies();
    }

    // Clear replies when component unmounts
    return () => {
      dispatch(clearReplies());
    };
  }, [discussion._id, dispatch]);

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

  const handleEditDiscussion = async () => {
    try {
      const updatedDiscussion = await discussionClient.updateDiscussion(discussion._id, {
        ...discussion,
        text: editedText,
        isEdited: true,
        editDate: new Date(),
        editBy: currentUser?._id
      });
      dispatch(updateDiscussion(updatedDiscussion));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating discussion:', error);
    }
  };

  const handleDeleteDiscussion = async () => {
    if (window.confirm('Are you sure you want to delete this discussion?')) {
      try {
        await discussionClient.deleteDiscussion(discussion._id);
        dispatch(deleteDiscussion(discussion._id));
      } catch (error) {
        console.error('Error deleting discussion:', error);
      }
    }
  };

  const handleToggleResolved = async () => {
    try {
      const updatedDiscussion = await discussionClient.toggleResolvedStatus(discussion._id);
      dispatch(toggleResolvedStatus(updatedDiscussion));
    } catch (error) {
      console.error('Error toggling resolved status:', error);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim()) return;
    
    try {
      const reply = {
        discussion: discussion._id,
        text: newReply,
        author: currentUser?.username || 'unknown_username',
        date: new Date(),
        isEdited: false
      };
      
      const newReplyData = await replyClient.createReply(reply);
      dispatch(addReply(newReplyData));
      setNewReply('');
      setShowReplyField(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className={`discussion-item ${discussion.isResolved ? 'resolved' : 'unresolved'}`}>
      {isEditing ? (
        <div className="discussion-editor">
          <ReactQuill
            value={editedText}
            onChange={setEditedText}
            modules={modules}
            formats={formats}
          />
          <div className="edit-actions">
            <button onClick={handleEditDiscussion}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <div className="discussion-header">
            <div className="discussion-meta">
              <span className="discussion-author">{discussion.author}</span>
              <span className="discussion-date">{formatDate(discussion.date)}</span>
              {discussion.isEdited && (
                <span className="discussion-edited">
                  (edited {formatDate(discussion.editDate)})
                </span>
              )}
              <span className={`discussion-status ${discussion.isResolved ? 'resolved' : 'unresolved'}`}>
                {discussion.isResolved ? 'Resolved' : 'Unresolved'}
              </span>
            </div>
            <div className="discussion-actions">
              <button 
                className={`resolve-button ${discussion.isResolved ? 'resolved' : 'unresolved'}`}
                onClick={handleToggleResolved}
              >
                {discussion.isResolved ? 'Mark as Unresolved' : 'Mark as Resolved'}
              </button>
              {canEdit && (
                <div className="action-dropdown">
                  <button className="dropdown-toggle">Actions</button>
                  <div className="dropdown-menu">
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={handleDeleteDiscussion}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className="discussion-content"
            dangerouslySetInnerHTML={{ __html: discussion.text }}
          />
          <div className="discussion-footer">
            <button 
              className="reply-button"
              onClick={() => setShowReplyField(!showReplyField)}
            >
              Reply
            </button>
          </div>
        </>
      )}

      {/* Reply Editor */}
      {showReplyField && (
        <div className="reply-editor">
          <ReactQuill
            value={newReply}
            onChange={setNewReply}
            placeholder="Write your reply here..."
            modules={modules}
            formats={formats}
          />
          <div className="reply-actions">
            <button 
              className="submit-button"
              onClick={handleSubmitReply}
              disabled={!newReply.trim()}
            >
              Submit Reply
            </button>
            <button 
              className="cancel-button"
              onClick={() => {
                setNewReply('');
                setShowReplyField(false);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Replies Section */}
      {discussionReplies.length > 0 && (
        <div className="replies-section">
          {discussionReplies.map((reply: any) => (
            <Reply 
              key={reply._id} 
              reply={reply} 
              currentUser={currentUser} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Discussion;