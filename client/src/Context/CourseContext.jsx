import axios from "axios";
import {createContext, useContext, useEffect, useState} from "react";
import { Toaster } from "react-hot-toast";
import { server } from "../main";

const courseContext = createContext();

export const CourseContextProvider = ({children}) =>{

  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);

  async function fetchCourses() {
    try {
      const {data} = await axios.get(`${server}/api/course/all`,{})
      setCourses(data.data);
    } catch (error) {
      console.log(error);
    }
  }
  
  async function fetchCourse(id) {
    try {
      const {data} = await axios.get(`${server}/api/course/${id}`,
        {
          headers: {
            token: localStorage.getItem("token"),
          },
        })
      setCourse(data.data);
    } catch (error) {
      console.log(error);
    }  
  }



    useEffect(()=>{
      fetchCourses();
    },[])


  return (
    <courseContext.Provider
      value = {{fetchCourses, courses, fetchCourse, course}}
    >
      {children}
      <Toaster/>
    </courseContext.Provider>
  )
}

export const CourseData = () => useContext(courseContext);
