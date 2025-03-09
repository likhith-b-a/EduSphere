import React from "react";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-left">MyApp</div>
        <div className="footer-center">
          <a href="#privacy">Privacy Policy</a> | 
          <a href="#terms">Terms of Service</a> | 
          <a href="#contact">Contact Us</a>
        </div>
        <div className="footer-right">
          © 2025 MyApp. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
