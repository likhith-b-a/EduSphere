import React, { useState } from 'react'
import { useNavigate } from 'react-router';
import { CourseData } from '../Context/CourseContext';
import "./AddCourse.css"
import axios from 'axios';
import toast from 'react-hot-toast';
import { server } from '../main';

const categories = [
  "Web Development",
  "App Development",
  "Game Development",
  "Data Science",
  "Artificial Intelligence",
];


const AddCourse = ({user}) => {

  const navigate = useNavigate();

  if (user && user.role !== "admin") return navigate("/");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [imagePrev, setImagePrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const changeImageHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setImagePrev(reader.result);
      setImage(file);
    };
  };

  const { courses, fetchCourses } = CourseData();

  const submitHandler = async (e) => {
    e.preventDefault();
    setBtnLoading(true);

    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("category", category);
    myForm.append("price", price);
    myForm.append("createdBy", createdBy);
    myForm.append("duration", duration);
    myForm.append("image", image);

    try {
      const { data } = await axios.post(`${server}/api/course/new`, myForm, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      toast.success(data.message);
      setBtnLoading(false);
      await fetchCourses();
      setImage("");
      setTitle("");
      setDescription("");
      setDuration("");
      setImagePrev("");
      setCreatedBy("");
      setPrice("");
      setCategory("");
      navigate("/courses");
    } catch (error) {
      console.log(error);
      //toast.error(error.response.data.message);
    }
  };

  return (
    <div className="add-course-page">
      <div className="add-course-page-form-container">
        <button className='buy-button'
          style={{background:"red"}}
          onClick={() => navigate("/courses")}
        >X</button>  
        <h2 className="add-course-page-title">Add Course</h2>
        <form onSubmit={submitHandler} className="add-course-page-form">
          <label htmlFor="text" className="add-course-page-label">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="add-course-page-input"
          />

          <label htmlFor="text" className="add-course-page-label">Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="add-course-page-input"
          />

          <label htmlFor="text" className="add-course-page-label">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="add-course-page-input"
          />

          <label htmlFor="text" className="add-course-page-label">Created By</label>
          <input
            type="text"
            value={createdBy}
            onChange={(e) => setCreatedBy(e.target.value)}
            required
            className="add-course-page-input"
          />

          <label htmlFor="category" className="add-course-page-label">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="add-course-page-select"
          >
            <option value="">Select Category</option>
            {categories.map((e) => (
              <option value={e} key={e}>
                {e}
              </option>
            ))}
          </select>

          <label htmlFor="text" className="add-course-page-label">Duration (Hours)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="add-course-page-input"
          />

          <label htmlFor="image" className="add-course-page-label">Upload Image</label>
          <input
            type="file"
            required
            onChange={changeImageHandler}
            className="add-course-page-file-input"
          />
          {imagePrev && (
            <img
              src={imagePrev}
              alt="Preview"
              width={300}
              className="add-course-page-image-preview"
            />
          )}

          <button
            type="submit"
            disabled={btnLoading}
            className="add-course-page-button"
          >
            {btnLoading ? "Please Wait..." : "Add"}
          </button>
        </form>
      </div>
    </div>

  )
}

export default AddCourse



// const AdminCourses = ({ user }) => {
//   const navigate = useNavigate();

//   if (user && user.role !== "admin") return navigate("/");

//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [category, setCategory] = useState("");
//   const [price, setPrice] = useState("");
//   const [createdBy, setCreatedBy] = useState("");
//   const [duration, setDuration] = useState("");
//   const [image, setImage] = useState("");
//   const [imagePrev, setImagePrev] = useState("");
//   const [btnLoading, setBtnLoading] = useState(false);

//   const changeImageHandler = (e) => {
//     const file = e.target.files[0];
//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onloadend = () => {
//       setImagePrev(reader.result);
//       setImage(file);
//     };
//   };

//   const { courses, fetchCourses } = CourseData();

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     setBtnLoading(true);

//     const myForm = new FormData();

//     myForm.append("title", title);
//     myForm.append("description", description);
//     myForm.append("category", category);
//     myForm.append("price", price);
//     myForm.append("createdBy", createdBy);
//     myForm.append("duration", duration);
//     myForm.append("file", image);

//     try {
//       const { data } = await axios.post(`${server}/api/course/new`, myForm, {
//         headers: {
//           token: localStorage.getItem("token"),
//         },
//       });

//       toast.success(data.message);
//       setBtnLoading(false);
//       await fetchCourses();
//       setImage("");
//       setTitle("");
//       setDescription("");
//       setDuration("");
//       setImagePrev("");
//       setCreatedBy("");
//       setPrice("");
//       setCategory("");
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };

//   return (
//     <div className="add-course">
//       <div className="course-form">
//         <h2>Add Course</h2>
//         <form onSubmit={submitHandler}>
//           <label htmlFor="text">Title</label>
//           <input
//             type="text"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />

//           <label htmlFor="text">Description</label>
//           <input
//             type="text"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             required
//           />

//           <label htmlFor="text">Price</label>
//           <input
//             type="number"
//             value={price}
//             onChange={(e) => setPrice(e.target.value)}
//             required
//           />

//           <label htmlFor="text">createdBy</label>
//           <input
//             type="text"
//             value={createdBy}
//             onChange={(e) => setCreatedBy(e.target.value)}
//             required
//           />

//           <select
//             value={category}
//             onChange={(e) => setCategory(e.target.value)}
//           >
//             <option value={""}>Select Category</option>
//             {categories.map((e) => (
//               <option value={e} key={e}>
//                 {e}
//               </option>
//             ))}
//           </select>

//           <label htmlFor="text">Duration</label>
//           <input
//             type="number"
//             value={duration}
//             onChange={(e) => setDuration(e.target.value)}
//             required
//           />

//           <input type="file" required onChange={changeImageHandler} />
//           {imagePrev && <img src={imagePrev} alt="" width={300} />}

//           <button
//             type="submit"
//             disabled={btnLoading}
//             className="common-btn"
//           >
//             {btnLoading ? "Please Wait..." : "Add"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };
