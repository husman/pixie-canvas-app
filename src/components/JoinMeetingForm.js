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
      <div className="meeting-form-contents">
        <h2 className="meeting-form-header">{WELCOME_MEETING_TITLE}</h2>
        <h2>
          <label className="meeting-form-label">{MEETING_URL_TITLE}</label>
        </h2>
        <input
          type="text"
          className="meeting-form-input"
          onChange={(e) => handleChange.callback(e.currentTarget.value)}
        />
        <h2>
          <label className="meeting-form-label">{NAME_TITLE}</label>
        </h2>
        <p className="meeting-form-info">{NAME_ADVISORY_MESSAGE}</p>
        <input
          type="text"
          className="meeting-form-input"
          onChange={(e) => handleChange.callback(e.currentTarget.value)}
        />
        <h2>
          <label className="meeting-form-label media-settings">
            {MEDIA_SETTINGS_TITLE}
          </label>
        </h2>
        <p className="meeting-form-info">{MEDIA_SETTINGS_ADVISORY}</p>
        {/* Meeting Room Icons */}
        <div className="meeting-form-icons">
          <div className="meeting-form-icon">
            <div
              className={`meeting-form-icon-background ${micSettings} mic-icon`}
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
        <h2 href="http://neetos.com/" className="meeting-form-help">
          Need help joining your meeting?
        </h2>
      </div>
    </form>
  );
};

export default JoinMeetingForm;
