import React from 'react'
import "./CourseCard.css"
import { UserData } from '../../Context/UserContext'
import { useNavigate } from 'react-router';
import { CourseData } from '../../Context/CourseContext';
import toast from "react-hot-toast";
import axios from "axios";
import { server } from '../../main';

const CourseCard = ({ course }) => {
  const navigate = useNavigate();

  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();


  console.log(course._id);
  async function deleteHandler(id) {
    if (confirm("Are you sure you want to delete this course")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${course._id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });
        console.log(data);
        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.message);
      }
    }
  }

  return (
    <div className="course-card">
      <div className="course-image-container">
        <img
          src={course.image || "https://via.placeholder.com/150"}
          alt={course.title}
          className="course-image"
        />
      </div>
      <div className="course-content">
        <h2 className="course-title">{course.title}</h2>
        <p className="course-description">{course.description}</p>
        <p className="course-details">
          <strong>Category:</strong> {course.category}
        </p>
        <p className="course-details">
          <strong>Instructor:</strong> {course.createdBy}
        </p>
        <p className="course-details">
          <strong>Duration:</strong> {course.duration}
        </p>
        <p className="course-price">Price: ₹{course.price}</p>
        {isAuth ?
          <>{
            user && (user.role === "admin" || user.subscription.includes(course._id)) ?
              <button onClick={() => { navigate(`/course/study/${course._id}`) }} className="buy-button">Study</button>
              :
              <button onClick={() => { navigate(`/course/${course._id}`) }} className="buy-button" >Get Started</button>}
          </>
          :
          <button onClick={() => { navigate('/login') }} className="buy-button" >Get Started</button>
        }

        <br />
        <br />

        {user && user.role === "admin" && (
          <button
            onClick={() => deleteHandler(course._id)}
            className="buy-button"
            style={{ background: "red" }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default CourseCard