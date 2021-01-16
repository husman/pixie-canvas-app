import React, { useState } from "react";
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
  MEDIA_ADVISORY_MESSAGE,
  JOIN_HELP_MESSAGE,
  JOIN_MEETING,
} from "./constants/translation";

const JoinMeetingForm = ({ onSubmit, name, micOn, cameraOn }) => {
  const [meetingUrl, setMeetingUrl] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [micSettings, setMicSettings] = useState(true);
  const [videoSettings, setVideoSettings] = useState(false);

  const handleMeetingURL = useDebouncedCallback((value) => {
    setMeetingUrl(value);
  }, 250);

  const handleDisplayName = useDebouncedCallback((value) => {
    setDisplayName(value);
  }, 250);

  const handleMic = () => {
    setMicSettings((prev) => !prev);
  };

  const handleVideo = () => {
    setVideoSettings((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* NOTE: Default Submit with no meetingURL/meetingID creates a NewMeeting */
    onSubmit(meetingUrl || uuidv4());
    name(displayName);
    micOn(micSettings);
    cameraOn(videoSettings);
  };

  return (
    <form onSubmit={handleSubmit} className="meeting-form">
      <div className="form-body">
        <h2>{WELCOME_MEETING_TITLE}</h2>

        {/* Meeting Input Fields */}
        <div>
          <label>{MEETING_URL_TITLE}</label>
          <br />
          <input
            type="text"
            onChange={(e) => handleMeetingURL.callback(e.currentTarget.value)}
          />
          <div className="meeting-form-info">
            <label>{NAME_TITLE}</label>
            <span>{NAME_ADVISORY_MESSAGE}</span>
          </div>
          <input
            type="text"
            onChange={(e) => handleDisplayName.callback(e.currentTarget.value)}
          />
        </div>
        <div className="meeting-form-info media-settings">
          <label>{MEDIA_SETTINGS_TITLE}</label>
          <p>{MEDIA_ADVISORY_MESSAGE}</p>
        </div>

        {/* Meeting Room Icons */}
        <div className="icons">
          {/* Mic Icon */}
          <div className="mic">
            <div
              className={`icon-background ${micSettings} `}
              onClick={handleMic}
            >
              {micSettings ? <MicOnIcon /> : <MicOffIcon />}
            </div>
            <h2 className="icon-caption">
              {micSettings ? "Mic On" : "Mic Off"}
            </h2>
          </div>

          {/* Video Icon */}
          <div className="video">
            <div
              className={`icon-background ${videoSettings}`}
              onClick={handleVideo}
            >
              {videoSettings ? <WebcamOnIcon /> : <WebcamOffIcon />}
            </div>
            <h2 className="icon-caption">
              {videoSettings ? "Webcam On" : "Webcam Off"}
            </h2>
          </div>
        </div>

        {/* Join Meeting */}
        <button type="submit" className="join-btn">
          {JOIN_MEETING}
        </button>
        <a href="http://neetos.com/" className="help">
          {JOIN_HELP_MESSAGE}
        </a>
      </div>
    </form>
  );
};

export default JoinMeetingForm;
