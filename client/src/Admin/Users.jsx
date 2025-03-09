import React, { useEffect, useState } from 'react'
import "./Users.css"
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../main";
import toast from "react-hot-toast";

const Users = ({user}) => {
  const navigate = useNavigate();

  if (user && user.role !== "admin"){
    navigate("/");
  }

  const [users, setUsers] = useState([]);

  async function fetchUsers() {
    try {
      const { data } = await axios.get(`${server}/api/course/users`, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      });

      setUsers(data.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateRoleHandler = async (id,role) => {
    console.log(id,role);
    if (confirm("are you sure you want to update this user role")) {
      try {
        const {data}  = await axios.put(
          `${server}/api/course/user/updateRole`,
          {
            id,
            role
          },
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );
        console.log(data);
        toast.success(data.message);
        fetchUsers();
      } catch (error) {
        toast.error(error.response.data.message);
      }
    }
  };
  
  const deleteUserHandler = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      // Call API to delete user
      console.log(`Deleting user with ID ${userId}`);
    }
  };
  

  return (
    <div className="admin-user-management-page">
      <h2 className="admin-user-management-title">User Management</h2>
      <div className="admin-user-management-table-container">
        <table className="admin-user-management-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user,idx) => (
              <tr key={user._id} className="admin-user-management-row">
                <td>{idx+1}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateRoleHandler(user._id, e.target.value)}
                    className="admin-user-management-select"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => deleteUserHandler(user.id)}
                    className="admin-user-management-delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Users;


