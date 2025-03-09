import React, { useEffect } from 'react';
import './MyLearning.css';
import { UserData } from '../../Context/UserContext';
import { useNavigate } from 'react-router';

const MyLearning = () => {

  const { fetchMyCourses, myCourses: courses } = UserData();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyCourses()
  }, []);


  return (
    <div className="my-learning-container">
      <h1 className="my-learning-page-title">My Learning</h1>
      {courses && courses.length > 0 ? (
        <div className="my-learning-grid">
          {courses.map((course) => (
            <div 
              key={course._id} 
              className="my-learning-card"
              onClick={()=>{
                navigate(`/course/study/${course._id}`)
              }}
              >
              <div className="my-learning-image-container">
                <img
                  src={course.image}
                  alt={course.title}
                  className="my-learning-image"
                />
              </div>
              <div className="my-learning-content">
                <h3 className="my-learning-title">{course.title}</h3>
                <p className="my-learning-instructor">{course.createdBy}</p>
                <div className="my-learning-progress-container">
                  <p className="my-learning-progress-text">
                    {course.progress}% complete
                  </p>
                  <div className="my-learning-progress-bar">
                    <div
                      className="my-learning-progress"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                {/* <div className="my-learning-rating-container">
                  <span>⭐</span>
                  <p>Leave a rating</p>
                </div> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="my-learning-no-courses">
          You are not enrolled in any courses yet.
        </p>
      )}
    </div>
  );
};

export default MyLearning;
