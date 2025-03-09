import React from "react";
import "./Profile.css";
import { UserData } from "../../Context/UserContext";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { BiLogOut } from "react-icons/bi";
import Stats from "../../Admin/Stats";

const ProfilePage = ({ user }) => {

  const { setIsAuth, setUser } = UserData();
  const navigate = useNavigate();

  const logoutHandler = () => {
    setIsAuth(false);
    setUser([]);

    localStorage.clear();
    toast.success("Logged Out");
    navigate("/login");
  }

  return (
    <>
      <div className="profile-container">
        <h1 className="page-heading">{user.role==="admin" ? "Admin Dashboard" : "My Dashboard" }</h1>
        <div className="profile-card">
          {/* <img
          src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/8847/8847419.png"}
          alt="Profile"
          className="profile-image"
          /> */}
          <div className="profile-pic-container">
            <img
              src={user.profilePicture || "https://cdn-icons-png.flaticon.com/512/8847/8847419.png"}
              alt="Profile"
              id="profile-pic"
            />
            <button id="edit-btn" className="edit-button">
              <i className="edit-icon">✎</i>
            </button>
          </div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
            <p className="profile-role">Role: {user.role == "user" ? "Student" : "Admin"}</p>
            {user.bio && <p className="profile-bio">{user.bio}</p>}
            <button className="logout-button" onClick={logoutHandler}><BiLogOut />  Logout</button>
          </div>
        </div>
        {user.role === "admin" && <Stats />}
      </div>
    </>
  );
};

export default ProfilePage;
