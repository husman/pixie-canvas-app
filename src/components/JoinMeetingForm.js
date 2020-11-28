import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const JoinMeetingForm = ({ onSubmit }) => {
  const [joiningNewMeeting, setJoiningNewMeeting] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");

  const toggleJoinMeeting = useCallback(() => {
    setJoiningNewMeeting((prev) => !prev);
  }, [setJoiningNewMeeting]);

  const handleChange = ({ currentTarget: { value } }) => {
    setMeetingUrl(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(meetingUrl || uuidv4());
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-form">
      {!joiningNewMeeting && (
        <>
          <button className="btn">Create a New Meeting</button>
          <button onClick={toggleJoinMeeting} className="btn">
            Join a Meeting
          </button>
        </>
      )}
      {joiningNewMeeting && (
        <>
          <button className="back btn" onClick={toggleJoinMeeting}>
            Back
          </button>
          <label className="label">Meeting ID</label>
          <input
            type="text"
            onChange={handleChange}
            className="input"
            size="40"
          />
          <button type="submit" className="btn">
            Join
          </button>
        </>
      )}
    </form>
  );
};

export default JoinMeetingForm;
