import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './Editor.css';

interface User {
    id: string;
    name: string;
    role: string;
}

interface EditorProps {
    onCancel: () => void;
    onSubmit: (post: any) => void;
    users: User[];
    folders: string[];
}

const Editor: React.FC<EditorProps> = ({ onCancel, onSubmit, users, folders }) => {
    const [postType, setPostType] = useState<'Question' | 'Note' | 'Poll'>('Question');
    const [postTo, setPostTo] = useState<'entire-class' | 'individual'>('entire-class');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedFolders, setSelectedFolders] = useState<string[]>([]);
    const [summary, setSummary] = useState('');
    const [details, setDetails] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

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

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (summary.trim() === '') {
            newErrors.summary = 'Summary is required';
        }
        if (summary.length > 100) {
            newErrors.summary = 'Summary must be 100 characters or less';
        }
        if (details.trim() === '') {
            newErrors.details = 'Details are required';
        }
        if (selectedFolders.length === 0) {
            newErrors.folders = 'At least one folder must be selected';
        }
        if (postTo === 'individual' && selectedUsers.length === 0) {
            newErrors.users = 'Please select at least one user';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            onSubmit({
                type: postType,
                visibility: postTo,
                visibleTo: postTo === 'individual' ? selectedUsers : 'all',
                folders: selectedFolders,
                summary,
                details,
            });
        }
    };

    return (
        <div className="post-editor">
            <div className="post-type-tabs">
                <button
                    className={`tab ${postType === 'Question' ? 'active' : ''}`}
                    onClick={() => setPostType('Question')}
                >
                    Question
                </button>
                <button
                    className={`tab ${postType === 'Note' ? 'active' : ''}`}
                    onClick={() => setPostType('Note')}
                >
                    Note
                </button>
                <button
                    className={`tab ${postType === 'Poll' ? 'active' : ''}`}
                    onClick={() => setPostType('Poll')}
                    disabled
                >
                    Poll/In-Class Response
                </button>
            </div>

            <div className="post-to-section">
                <h3>Post To</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            checked={postTo === 'entire-class'}
                            onChange={() => setPostTo('entire-class')}
                        />
                        Entire Class
                    </label>
                    <label>
                        <input
                            type="radio"
                            checked={postTo === 'individual'}
                            onChange={() => setPostTo('individual')}
                        />
                        Individual Student(s)/Instructor(s)
                    </label>
                </div>

                {postTo === 'individual' && (
                    <div className="user-selection">
                        {users.map(user => (
                            <label key={user.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedUsers([...selectedUsers, user.id]);
                                        } else {
                                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                        }
                                    }}
                                />
                                {user.name} ({user.role})
                            </label>
                        ))}
                        {errors.users && <div className="error">{errors.users}</div>}
                    </div>
                )}
            </div>

            <div className="folders-section">
                <h3>Select Folder(s)</h3>
                <div className="folder-selection">
                    {folders.map(folder => (
                        <label key={folder}>
                            <input
                                type="checkbox"
                                checked={selectedFolders.includes(folder)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedFolders([...selectedFolders, folder]);
                                    } else {
                                        setSelectedFolders(selectedFolders.filter(f => f !== folder));
                                    }
                                }}
                            />
                            {folder}
                        </label>
                    ))}
                </div>
                {errors.folders && <div className="error">{errors.folders}</div>}
            </div>

            <div className="summary-section">
                <h3>Summary</h3>
                <input
                    type="text"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Enter a one line summary (100 characters or less)"
                    maxLength={100}
                />
                {errors.summary && <div className="error">{errors.summary}</div>}
            </div>

            <div className="details-section">
                <h3>Details</h3>
                <ReactQuill
                    value={details}
                    onChange={setDetails}
                    modules={modules}
                    formats={formats}
                    placeholder="Enter your post details here..."
                    style={{ height: '300px', marginBottom: '50px' }}
                />
                {errors.details && <div className="error">{errors.details}</div>}
            </div>

            <div className="button-group">
                <button 
                    className="submit-button"
                    onClick={handleSubmit}
                >
                    {`Post My ${postType}`}
                </button>
                <button 
                    className="cancel-button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Editor;
