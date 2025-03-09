import React from 'react';
import './header.css';
import { Link } from "react-router-dom";

const Header = (props) => {
  return (
    <header className="header">
      <div className="logo">
        <h1>MyApp</h1>
      </div>

      <div>
        <nav className="nav">
          <Link to={"/"}>Home</Link>
          <Link to={"/courses"}>Courses</Link>
          <Link to={"/about"}>About</Link>
          {props.isAuth ? 
            (<Link to={"/profile"}>Account</Link>) :
            (<Link to={"/login"}>Login</Link>)
          }
        </nav>
      </div>

    </header>
  );
};

export default Header;
