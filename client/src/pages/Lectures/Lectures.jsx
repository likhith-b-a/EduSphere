import React, { useEffect, useState } from "react";
import { UserData } from "../../Context/UserContext";
import "./Lectures.css";
import { useNavigate, useParams } from "react-router";
import { server } from "../../main";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import PlayLecture from "./PlayLecture";
import AddLecture from "./AddLecture.jsx";
import toast from "react-hot-toast";
import { TiTick } from "react-icons/ti";

const Lectures = () => {
  const { user } = UserData();

  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lecture, setLecture] = useState([]);
  const [lecLoading, setLecLoading] = useState(false);
  const [show, setShow] = useState(false);

  const params = useParams();
  const navigate = useNavigate();



  if (user && user.role !== "admin" && !user.subscription.includes(params.id)) {
    navigate("/");
    return;
  }

  async function fetchLectures() {
    try {
      const { data } = await axios.get(`${server}/api/course/${params.id}/lectures`,
        {
          headers: {
            Authorization: localStorage.getItem("token")
          }
        });

      setLectures(data.data);
      setLecture(data.data[0])
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  async function fetchLecture(id) {
    setLecLoading(true);
    try {
      const data = await axios.get(`${server}/api/course/lectures/${id}`,
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          }
        }
      )
      setLecture(data.data.data);
      setLecLoading(false);
    } catch (error) {
      console.log(error);
      setLecLoading(false);
    }

  }

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this lecture")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/lectures/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        });

        toast.success(data.message);
        fetchLectures();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };



  useEffect(() => {
    fetchLectures()
  }, []);

  return (
    <>
      {loading ? <Loader /> :
        <div className="course-study-page">
          <PlayLecture
            lecLoading={lecLoading}
            lecture={lecture}
            params={params}
          />

          <div className="course-study-lecture-list-section">

            {user && user.role === "admin" && (
              <button className="buy-button" onClick={() => setShow(!show)}>
                {show ? "X" : "Add Lecture +"}
              </button>
            )}

            {show && (
              <AddLecture
                id={params.id}
                setShow={setShow}
                fetchLectures={fetchLectures}
              />
            )}

            <h3>Lectures</h3>
            <div className="course-study-lecture-list">
              {lectures.map((l, idx) => (
                <>
                  <div
                    key={l._id}
                    className={`course-study-lecture-item ${lecture?._id === l._id ? "active" : ""
                      }`}
                    onClick={() => fetchLecture(l._id)}
                  >

                    {idx + 1}. {l.title}

                  </div>
                  {user && user.role === "admin" && lecture?._id === l._id && (
                    <>
                      <button
                        key={idx}
                        className="buy-button"
                        style={{ background: "red", marginBottom: "10px" }}
                        onClick={() => deleteHandler(l._id)}
                      >
                        Delete {l.title}
                      </button>
                      <br></br>
                    </>
                  )}
                </>
              ))}
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default Lectures;
