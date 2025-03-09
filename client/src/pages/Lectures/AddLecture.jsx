import React, { useState } from 'react'
import toast from 'react-hot-toast';
import axios from 'axios';
import { server } from '../../main';
import "./AddLecture.css"

const AddLecture = ({id,setShow,fetchLectures}) => {

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [video, setvideo] = useState("");
  const [videoPrev, setVideoPrev] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);


  const changeVideoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onloadend = () => {
      setVideoPrev(reader.result);
      setvideo(file);
    };
  };

  const submitHandler = async (e) => {
    setBtnLoading(true);
    e.preventDefault();
    const myForm = new FormData();

    myForm.append("title", title);
    myForm.append("description", description);
    myForm.append("lecture", video);

    try {
      const { data } = await axios.post(
        `${server}/api/course/${id}`,
        myForm,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      toast.success(data.message);
      setBtnLoading(false);
      setShow(false);
      fetchLectures();
      setTitle("");
      setDescription("");
      setvideo("");
      setVideoPrev("");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setBtnLoading(false);
    }
  };


  return (
    <div className="add-lecture-page-form">
      <h2 className="add-lecture-page-title">Add Lecture</h2>
      <form onSubmit={submitHandler} className="add-lecture-page-form-container">
        <label htmlFor="text" className="add-lecture-page-label">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="add-lecture-page-input"
        />

        <label htmlFor="text" className="add-lecture-page-label">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="add-lecture-page-input"
        />

        <input
          type="file"
          placeholder="choose video"
          onChange={changeVideoHandler}
          required
          className="add-lecture-page-file-input"
        />

        {videoPrev && (
          <video
            src={videoPrev}
            alt="Preview"
            width={300}
            controls
            className="add-lecture-page-video-preview"
          ></video>
        )}

        <button
          disabled={btnLoading}
          type="submit"
          className="add-lecture-page-button"
        >
          {btnLoading ? "Please Wait..." : "Add"}
        </button>
      </form>
    </div>

  )
}

export default AddLecture