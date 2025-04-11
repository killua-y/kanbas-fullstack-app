import React from 'react';
import './ClassGlance.css';

interface ClassStats {
  unreadPosts: number;
  unansweredQuestions: number;
  unansweredFollowups: number;
  totalPosts: number;
  totalContributions: number;
  instructorResponses: number;
  studentResponses: number;
  avgResponseTime: string;
  enrolledStudents: number;
  estimatedStudents: number;
}

export default function ClassGlance() {
  const stats: ClassStats = {
    unreadPosts: 0,
    unansweredQuestions: 0,
    unansweredFollowups: 0,
    totalPosts: 27,
    totalContributions: 50,
    instructorResponses: 5,
    studentResponses: 0,
    avgResponseTime: '8 hr',
    enrolledStudents: 106,
    estimatedStudents: 100
  };

  return (
    <div className="class-glance">
      <div className="card-header">
        <h2>Class at a Glance</h2>
        <div className="refresh-info">
          Updated 10 seconds ago.
          <button className="refresh-button">Reload</button>
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item success">
          <span className="stat-icon">✓</span>
          <span className="stat-label">no unread posts</span>
        </div>
        
        <div className="stat-item success">
          <span className="stat-icon">✓</span>
          <span className="stat-label">no unanswered questions</span>
        </div>
        
        <div className="stat-item success">
          <span className="stat-icon">✓</span>
          <span className="stat-label">no unanswered followups</span>
        </div>

        <div className="stats-summary">
          <div className="summary-item">
            <span className="label">license status</span>
            <span className="value">active instructor license</span>
          </div>
          
          <div className="summary-item">
            <span className="label">total posts</span>
            <span className="value">{stats.totalPosts}</span>
          </div>
          
          <div className="summary-item">
            <span className="label">total contributions</span>
            <span className="value">{stats.totalContributions}</span>
          </div>
          
          <div className="summary-item">
            <span className="label">instructors' responses</span>
            <span className="value">{stats.instructorResponses}</span>
          </div>
          
          <div className="summary-item">
            <span className="label">students' responses</span>
            <span className="value">{stats.studentResponses}</span>
          </div>

          <div className="summary-item">
            <span className="label">avg. response time</span>
            <span className="value">{stats.avgResponseTime}</span>
          </div>
        </div>

        <div className="enrollment-section">
          <div className="enrollment-header">
            <span>Student Enrollment</span>
            <button className="edit-button">Edit</button>
          </div>
          <div className="enrollment-bar">
            <div 
              className="enrollment-progress" 
              style={{ width: `${(stats.enrolledStudents / stats.estimatedStudents) * 100}%` }}
            />
          </div>
          <div className="enrollment-text">
            {stats.enrolledStudents} enrolled out of {stats.estimatedStudents} (estimated)
          </div>
        </div>

        <div className="app-download">
          <span>Download us in the app store:</span>
          <div className="store-buttons">
            <a href="#" className="app-store-button">
              <img src="/images/app-store.png" alt="App Store" />
            </a>
            <a href="#" className="play-store-button">
              <img src="/images/play-store.png" alt="Google Play" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 