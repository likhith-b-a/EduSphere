import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'
import { UserData } from '../../Context/UserContext.jsx';




const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { btnLoading, loginUser} = UserData();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    // call to backend
    await loginUser(email, password, navigate)
  }


  return (
    <div className="container">
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={submitHandler}>
          <div className="login-input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="login-input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p
              style={{ float: 'right' }}
            >
              <Link to="/forgot">Forgot password?</Link>
            </p>
          </div>
          <button disabled={btnLoading} type="submit">{btnLoading ? "Please Wait..." : "Login"}</button>
        </form>
        <p>Don't have an account? <Link to="/register">sign up</Link></p>
      </div>
    </div>
  )
}

export default Login
