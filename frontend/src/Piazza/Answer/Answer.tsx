import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Answer.css';
import { deleteAnswer, updateAnswer as updateAnswerAction } from './reducer';
import * as answerClient from './client';

interface AnswerProps {
    answer: any;
    currentUser: any;
}

const Answer: React.FC<AnswerProps> = ({ answer, currentUser }) => {
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(answer.text);
    
    const isAuthor = currentUser?._id === answer.author;
    const isInstructor = currentUser?.role === 'FACULTY';
    const canEdit = isInstructor || isAuthor;

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

    const handleEditAnswer = async () => {
        try {
            const updatedAnswer = await answerClient.updateAnswer(answer._id, {
                ...answer,
                text: editedText,
                isEdited: true,
                editDate: new Date(),
                editBy: currentUser?._id
            });
            dispatch(updateAnswerAction(updatedAnswer));
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating answer:', error);
        }
    };

    const handleDeleteAnswer = async () => {
        if (window.confirm('Are you sure you want to delete this answer?')) {
            try {
                await answerClient.deleteAnswer(answer._id);
                dispatch(deleteAnswer(answer._id));
            } catch (error) {
                console.error('Error deleting answer:', error);
            }
        }
    };

    const formatDate = (dateString: string | Date) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="answer-item">
            {isEditing ? (
                <div className="answer-editor">
                    <ReactQuill
                        value={editedText}
                        onChange={setEditedText}
                        modules={modules}
                        formats={formats}
                    />
                    <div className="edit-actions">
                        <button onClick={handleEditAnswer}>Save</button>
                        <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                </div>
            ) : (
                <>
                    <div className="answer-header">
                        <div className="answer-meta">
                            <span className="answer-author">{answer.author}</span>
                            <span className="answer-date">{formatDate(answer.date)}</span>
                            {answer.isEdited && (
                                <span className="answer-edited">
                                    (edited {formatDate(answer.editDate)})
                                </span>
                            )}
                        </div>
                        {canEdit && (
                            <div className="answer-actions">
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <div className="dropdown">
                                    <button className="dropdown-toggle">Actions</button>
                                    <div className="dropdown-menu">
                                        <button onClick={() => setIsEditing(true)}>Edit</button>
                                        <button onClick={handleDeleteAnswer}>Delete</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div
                        className="answer-content"
                        dangerouslySetInnerHTML={{ __html: answer.text }}
                    />
                </>
            )}
        </div>
    );
};

export default Answer;