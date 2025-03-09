import React, { useEffect, useState } from 'react'
import "./CourseDescription.css"
import { useNavigate, useParams } from 'react-router';
import { UserData } from '../../Context/UserContext';
import { CourseData } from '../../Context/CourseContext';
import Loader from '../../components/Loader/Loader';
import axios from 'axios';
import { server } from '../../main';
import toast from 'react-hot-toast';

const CourseDescription = ({ user }) => {
  const params = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { fetchUser } = UserData();
  const { fetchCourse, course, fetchCourses, fetchMyCourse } = CourseData();

  useEffect(() => {
    fetchCourse(params.id);
  }, []);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    const order = (await axios.post(
      `${server}/api/course/${params.id}/checkout`,
      {},
      {
        headers: {
          Authorization: token,
        },
      }
    )).data.data.order;


    const options = {
      key_id: import.meta.env.VITE_RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      name: "My app", //your business name
      description: "Test Transaction",
      //image: "https://example.com/your_logo",
      order_id: order.id,

      handler: async function (response) {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
          response;

        try {
          const { data } = await axios.post(
            `${server}/api/course/${params.id}/checkout/verification`,
            {
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
            },
            {
              headers: {
                Authorization: token,
              },
            }
          );

          console.log(data);

          await fetchUser();
          await fetchCourses();
          //await fetchMyCourse();
          toast.success(data.message);
          setLoading(false);
          navigate(`/payment-success/${razorpay_payment_id}`);
        } catch (error) {
          toast.error(error.response.data.message);
          setLoading(false);
        }
      },
      theme: {
        color: "#1e2a78",
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", function (response) {
      console.error("Payment failed:", response.error);
      toast.error("Payment failed: " + response.error.description);
    });
    

    //console.log(razorpay);

    razorpay.open();
  }


  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="course-details-container">
          <div className="course-header">
            <img src={course.image} alt={course.title} className="course-image" />
            <div className="course-info">
              <h1 className="course-title">{course.title}</h1>
              <p className="course-category">{course.category}</p>
              <p className="course-instructor">By {course.createdBy}</p>
              <p className="course-duration">Duration: {course.duration}</p>
            </div>
          </div>

          <div className="course-description">
            <h2>Course Description</h2>
            <p>{course.description}</p>
          </div>

          <div className="course-pricing">

            {user && (user.subscription.includes(course._id) || user.role === "admin") ? (
              <button
                onClick={() => navigate(`/course/study/${course._id}`)}
                className="buy-button"
              >
                Study
              </button>
            ) : (
              <>
                <p className="course-price">
                  ₹{course.price} <span className="old-price">{course.oldPrice && `₹${course.oldPrice}`}</span>
                </p>
                <button onClick={checkoutHandler} className="buy-button">
                  Buy Now
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default CourseDescription