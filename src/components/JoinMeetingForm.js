import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { NEW_MEETING, JOIN_MEETING } from "./constants/translation";
// import MicOn from "../../public/mic-on"; // ./mic-on-icon-24.png";

const JoinMeetingForm = ({ onSubmit }) => {
  const [joiningNewMeeting, setJoiningNewMeeting] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");

  const toggleJoinMeeting = useCallback(() => {
    setJoiningNewMeeting((prev) => !prev);
  }, [setJoiningNewMeeting]);

  const handleChange = useDebouncedCallback((value) => {
    setMeetingUrl(value);
  }, 250);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(meetingUrl || uuidv4());
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-form">
      <h2 className="meeting-form-header">Welcome to your meeting</h2>
      <h2>
        <label className="meeting-form-label">Your Meeting URL</label>
      </h2>
      <input
        type="text"
        className="meeting-form-input"
        onChange={(e) => handleChange.callback(e.currentTarget.value)}
      />
      <h2>
        <label className="meeting-form-label">Your Name</label>
      </h2>
      <p className="meeting-form-info">(Other participants will see this)</p>
      <input
        type="text"
        className="meeting-form-input"
        onChange={(e) => handleChange.callback(e.currentTarget.value)}
      />
      <h2>
        <label className="meeting-form-label media-settings">
          Your Audio + Video Settings
        </label>
      </h2>
      <p className="meeting-form-info">
        (You can update these settings once the meeting begins)
      </p>
      {/* Meeting Room Icons */}
      <div className="meeting-form-icons">
        <div className="meeting-form-icon">
          <div className="meeting-form-icon-png" />
          <img className="meeting-form-mic-on" src={MicOn} />
          <h3 className="meeting-form-icon-desc">Mic On</h3>
        </div>
        <div className="meeting-form-icon">
          <div className="meeting-form-icon-png">
            <img className="meeting-form-mic-on" src="" />
          </div>
          <h3 className="meeting-form-icon-desc">Webcam On</h3>
        </div>
      </div>
    </form>
    // <form onSubmit={handleSubmit} className="meeting-form">
    //   {!joiningNewMeeting && (
    //     <>
    //       <button className="btn">{NEW_MEETING}</button>
    //       <button onClick={toggleJoinMeeting} className="btn">
    //         Join a Meeting
    //       </button>
    //     </>
    //   )}
    //   {joiningNewMeeting && (
    //     <>
    //       <button className="back btn" onClick={toggleJoinMeeting}>
    //         Back
    //       </button>
    //       <label className="label">{JOIN_MEETING}</label>
    //       <input
    //         type="text"
    //         onChange={(e) => handleChange.callback(e.currentTarget.value)}
    //         className="input"
    //         size="40"
    //       />
    //       <button type="submit" className="btn">
    //         Join
    //       </button>
    //     </>
    //   )}
    // </form>
  );
};

export default JoinMeetingForm;
