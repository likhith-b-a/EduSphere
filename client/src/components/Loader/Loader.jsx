import React from 'react';
import "./Loader.css"

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        <div className="box1" />
        <div className="box2" />
        <div className="box3" />
      </div>
      Loading..
    </div>
  );
}

export default Loader;
