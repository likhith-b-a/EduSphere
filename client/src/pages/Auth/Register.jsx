import React, { useState } from 'react'
import './Register.css'
import { Link, useNavigate } from 'react-router'
import { UserData } from '../../Context/UserContext';

const Register = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { btnLoading, registerUser } = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) =>{
    e.preventDefault();
    await registerUser(name,email,password,navigate);
  }

  return (
    <div className="container">
      <div className="register-container">
        <h1>Register</h1>
        <form onSubmit={submitHandler}>

          <div className="register-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              placeholder="name"
              value={name}
              onChange={(e) => { setName(e.target.value) }}
              required
            />
          </div>

          <div className="register-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value) }}
              placeholder="Enter Email"
              required />
          </div>

          <div className="register-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => { setPassword(e.target.value) }}
              required />
          </div>

          <button type="submit" disabled={btnLoading}>{btnLoading ? "Please Wait" : "Register"}</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register