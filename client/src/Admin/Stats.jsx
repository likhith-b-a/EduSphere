import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import "./Stats.css";
import axios from "axios";
import { server } from "../main";

const Stats = () => {

  const navigate = useNavigate();
  const [stats, setStats] = useState();
  const fetchStats = async() => {
    const data = await axios.get(`${server}/api/course/stats`,{
      headers:{
        Authorization: localStorage.getItem("token")
      }
    });
    setStats(data.data.data);
  }

  useEffect(()=>{
    fetchStats()
  },[])

  return (
    <div className="admin-stats-page">
      <div className="admin-stats-grid">
        <div className="admin-stats-card"
          onClick={()=>{navigate("/users")}}
        >
          <h3>Total Users</h3>
          <p>{stats && stats.totalUsers}</p>
        </div>
        <div className="admin-stats-card"
        onClick={()=>{navigate("/courses")}}>
          <h3>Courses Available</h3>
          <p>{stats && stats.totalCourses}</p>
        </div>
        <div className="admin-stats-card">
          <h3>Total Lectures</h3>
          <p>{stats && stats.totalLectures}</p>
        </div>
      </div>
    </div>
  );
};

export default Stats;
