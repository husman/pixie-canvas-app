import React, { useCallback, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { v4 as uuidv4 } from "uuid";
import { MicOffIcon } from "../styles/assets/MicOffIcon";
import { MicOnIcon } from "../styles/assets/MicOnIcon";
import { WebcamOffIcon } from "../styles/assets/WebcamOffIcon";
import { WebcamOnIcon } from "../styles/assets/WebcamOnIcon";
import {
  MEDIA_SETTINGS_TITLE,
  MEETING_URL_TITLE,
  NAME_TITLE,
  NAME_ADVISORY_MESSAGE,
  WELCOME_MEETING_TITLE,
  MEDIA_SETTINGS_ADVISORY,
} from "./constants/translation";

const JoinMeetingForm = ({ onSubmit }) => {
  const [joiningNewMeeting, setJoiningNewMeeting] = useState(false);
  const [meetingUrl, setMeetingUrl] = useState("");
  const [micSettings, setMicSettings] = useState(true);
  const [videoSettings, setVideoSettings] = useState(false);

  const toggleJoinMeeting = useCallback(() => {
    setJoiningNewMeeting((prev) => !prev);
  }, [setJoiningNewMeeting]);

  const handleChange = useDebouncedCallback((value) => {
    setMeetingUrl(value);
  }, 250);

  const handleMic = () => {
    setMicSettings((prev) => !prev);
  };

  const handleVideo = () => {
    setVideoSettings((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(meetingUrl || uuidv4());
  };

  const icons = () => {};

  return (
    <form /*onSubmit={handleSubmit}*/ className="meeting-form">
      <div className="contents">
        <h2 className="meeting-form-header">{WELCOME_MEETING_TITLE}</h2>
        <div className="input-body">
          <label>{MEETING_URL_TITLE}</label>
          <br />
          <input
            type="text"
            className="meeting-form-input"
            onChange={(e) => handleChange.callback(e.currentTarget.value)}
          />
          <div className="meeting-form-info">
            <label>{NAME_TITLE}</label>
            <span>{NAME_ADVISORY_MESSAGE}</span>
          </div>
          <input
            type="text"
            className="meeting-form-input"
            onChange={(e) => handleChange.callback(e.currentTarget.value)}
          />
        </div>
        <div className="meeting-form-info media">
          <label className="settings">{MEDIA_SETTINGS_TITLE}</label>
          <p>{MEDIA_SETTINGS_ADVISORY}</p>
        </div>
        {/* Meeting Room Icons */}
        <div className="meeting-form-icons">
          <div className="meeting-form-icon mic-icon">
            <div
              className={`meeting-form-icon-background ${micSettings} `}
              onClick={handleMic}
            >
              {micSettings ? <MicOnIcon /> : <MicOffIcon />}
            </div>
            <h2 className="meeting-form-icon-cap">
              {micSettings ? "Mic On" : "Mic Off"}
            </h2>
          </div>
          <div className="meeting-form-icon">
            <div
              className={`meeting-form-icon-background ${videoSettings} video-icon`}
              onClick={handleVideo}
            >
              {videoSettings ? <WebcamOnIcon /> : <WebcamOffIcon />}
            </div>
            <h2 className="meeting-form-icon-cap">
              {videoSettings ? "Webcam On" : "Webcam Off"}
            </h2>
          </div>
        </div>
        {/* End of Meeting Room Icons */}
        <button type="submit" className="join-btn">
          Join Meeting
        </button>
        <a href="http://neetos.com/" className="meeting-form-help">
          Need help joining your meeting?
        </a>
      </div>
    </form>
  );
};

export default JoinMeetingForm;
