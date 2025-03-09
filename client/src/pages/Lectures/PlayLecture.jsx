import React from 'react'
import Loader from '../../components/Loader/Loader.jsx'

const PlayLecture = ({ lecLoading, lecture }) => {


  return (
    <div className="course-study-video-section">
      {lecLoading ? <Loader /> : (
        <>
          {lecture?.video ?
            <>
              <video
                src={lecture.video || ""}
                width="100%"
                height="90%"
                controls
                controlsList="nodownload noremoteplayback"
                disablePictureInPicture
                disableRemotePlayback
                autoPlay
                style={{ borderRadius: "10px" }}
              >
                Your browser does not support the video tag.
              </video>
              <div className="course-study-lecture-details">
                <h2>{lecture.title || "No Title Available"}</h2>
                <p>{lecture.description || "No Description Available"}</p>
              </div>
            </>
            : (
              <p>No lecture selected</p>
            )}
        </>
      )}
    </div>
  )
}

export default PlayLecture