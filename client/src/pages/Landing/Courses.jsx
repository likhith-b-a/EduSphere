
import { useNavigate } from 'react-router';
import CourseCard from '../../components/Course_Card/CourseCard';
import { CourseData } from '../../Context/CourseContext';
import './Courses.css'
import { UserData } from '../../Context/UserContext';

const Courses = () => {
  const { courses } = CourseData();
  const { user } = UserData();
  const navigate = useNavigate();
  console.log(courses);
  return (
    <div className="courses-container">
      <div>
        {user.role === "admin" &&
          <button className="buy-button"
            style={{ background: "red", float: "right", padding: "0.6rem 1.4rem" }}
            onClick={() => { navigate('/addcourse') }}
          >
            +Add Course
          </button>
        }
        <h1 className="page-heading">Available Courses</h1>
      </div>
      <div className="courses-grid">
        {courses.map((course, index) => (
          <CourseCard course={course} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Courses;
