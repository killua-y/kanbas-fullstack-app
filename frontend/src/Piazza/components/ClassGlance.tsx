import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ClassGlance.css';
import * as answerClient from '../Answer/client';
import { setAnswers } from '../Answer/reducer';

interface ClassStats {
  unreadPosts: number;
  unansweredQuestions: number;
  totalPosts: number;
  instructorResponses: number;
  studentResponses: number;
  enrolledStudents: number;
}

interface ClassGlanceProps {
  courseId?: string;
}

export default function ClassGlance({ courseId }: ClassGlanceProps) {
  const dispatch = useDispatch();
  
  // Get data from Redux store
  const posts = useSelector((state: any) => state.postsReducer.posts);
  const answers = useSelector((state: any) => state.answersReducer.answers);
  const enrollments = useSelector((state: any) => state.enrollmentsReducer.enrollments);
  
  // Fetch all answers for the course when component mounts
  useEffect(() => {
    const fetchAllAnswers = async () => {
      if (!courseId) return;
      
      try {
        // Fetch answers for each post in the course
        const allAnswers = [];
        for (const post of posts) {
          if (post.course === courseId) {
            const postAnswers = await answerClient.findAnswersForPost(post._id);
            allAnswers.push(...postAnswers);
          }
        }
        
        // Update the Redux store with all answers
        dispatch(setAnswers(allAnswers));
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };
    
    fetchAllAnswers();
  }, [courseId, posts, dispatch]);
  
  // Calculate statistics
  const unreadPosts = posts.filter((post: any) => !post.isRead).length;
  const unansweredQuestions = posts.filter((post: any) => 
    post.postType === 'question' && !post.isResolved
  ).length;
  const totalPosts = posts.length;
  
  const instructorResponses = answers.filter((answer: any) => answer.isInstructorAnswer).length;
  const studentResponses = answers.filter((answer: any) => !answer.isInstructorAnswer).length;
  
  // Count enrolled students for the current course
  const enrolledStudents = enrollments.filter(
    (enrollment: any) => enrollment.course === courseId
  ).length;

  const stats: ClassStats = {
    unreadPosts,
    unansweredQuestions,
    totalPosts,
    instructorResponses,
    studentResponses,
    enrolledStudents
  };

  return (
    <div className="class-glance">
      <div className="card-header">
        <h2>Class at a Glance</h2>
        <div className="refresh-info">
          Updated just now
          <button className="refresh-button">Reload</button>
        </div>
      </div>

      <div className="stats-container">
        <div className={`stat-item ${stats.unreadPosts === 0 ? 'success' : 'warning'}`}>
          <span className="stat-icon">{stats.unreadPosts === 0 ? '✓' : '!'}</span>
          <span className="stat-label">
            {stats.unreadPosts === 0 
              ? 'no unread posts' 
              : `${stats.unreadPosts} unread post${stats.unreadPosts !== 1 ? 's' : ''}`}
          </span>
        </div>
        
        <div className={`stat-item ${stats.unansweredQuestions === 0 ? 'success' : 'warning'}`}>
          <span className="stat-icon">{stats.unansweredQuestions === 0 ? '✓' : '!'}</span>
          <span className="stat-label">
            {stats.unansweredQuestions === 0 
              ? 'no unanswered questions' 
              : `${stats.unansweredQuestions} unanswered question${stats.unansweredQuestions !== 1 ? 's' : ''}`}
          </span>
        </div>

        <div className="stats-summary">
          <div className="summary-item">
            <span className="label">total posts</span>
            <span className="value">{stats.totalPosts}</span>
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
            <span className="label">enrolled students</span>
            <span className="value">{stats.enrolledStudents}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 