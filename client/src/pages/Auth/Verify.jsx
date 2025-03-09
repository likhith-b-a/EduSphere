import React, { useState } from 'react';
import { UserData } from '../../Context/UserContext';
import { Link, useNavigate } from 'react-router';
import ReCAPTCHA from 'react-google-recaptcha';
import './Verify.css';

const Verify = () => {
  const [otp, setOtp] = useState('');
  const { btnLoading, verifyOtp } = UserData();
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  function onChange(value) {
    console.log('Captcha value:', value);
    setShow(true);
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    await verifyOtp(Number(otp), navigate);
  };

  return (
    <div className="verify-otp-page-container">
      <div className="verify-otp-page-form-container">
        <h1 className="verify-otp-page-title">Verify OTP</h1>
        <form onSubmit={submitHandler} className="verify-otp-page-form">
          <div className="verify-otp-page-form-group">
            <label htmlFor="Enter OTP" className="verify-otp-page-label">
              Enter OTP
            </label>
            <input
              type="password"
              id="Enter OTP"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="verify-otp-page-input"
            />
            <ReCAPTCHA
              sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`}
              onChange={onChange}
              className="verify-otp-page-recaptcha"
            />
            {show && (
              <button
                disabled={btnLoading}
                type="submit"
                className="verify-otp-page-button"
              >
                {btnLoading ? "Please Wait..." : "Verify OTP"}
              </button>
            )}
          </div>
        </form>
        <p className="verify-otp-page-login-link">
          Go to{" "}
          <Link to="/login" className="verify-otp-page-link">
            Login
          </Link>{" "}
          page
        </p>
      </div>
    </div>
  );
};

export default Verify;
