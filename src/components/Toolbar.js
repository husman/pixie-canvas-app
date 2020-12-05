import React, { useState } from "react";
import {
  VideocamOff,
  MicOff,
  Mic,
  Videocam,
  Fullscreen,
  FullscreenExit,
  PowerSettingsNew,
} from "@material-ui/icons";
import { IconButton, Button } from "@material-ui/core";
import PinVideoDialog from "./PinVideoDialog";

export default function Toolbar({
  stream,
  isMicOn,
  isCameraOn,
  sessionId,
  micStatusChanged,
  camStatusChanged,
  toggleFullscreen,
  leaveSession,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [pinningVideos, setPinningVideos] = useState(false);
  const [subscribers, setSubscribers] = useState([
    { name: "Bob", video: true },
    { name: "Mary", video: false },
    { name: "Joel", video: true },
  ]);

  const handleMicClick = () => {
    micStatusChanged();
  };

  const handleCamClick = () => {
    camStatusChanged();
  };

  const handleFullscreenClick = () => {
    setFullscreen((prevFullscreen) => !prevFullscreen);
    toggleFullscreen();
  };

  const handleLeaveClick = () => {
    leaveSession();
  };

  const togglePinVideos = () => {
    setPinningVideos(true);
  };

  const handleClose = (pinnedVideos) => {
    /*  TOOD: Enforce contract that pinned videos can never remove subscribers from the stream, only alters their pinned state */
    setSubscribers(pinnedVideos);
    setPinningVideos(false);
  };

  return (
    console.log("Subscribers TOOLBAR", subscribers),
    (
      <header id="header">
        <h3 id="session-title">{sessionId}</h3>
        <div className="nav-buttons-container">
          <IconButton
            color="inherit"
            className="nav-btn"
            onClick={handleMicClick}
          >
            {isMicOn ? <Mic /> : <MicOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="nav-btn"
            onClick={handleCamClick}
          >
            {isCameraOn ? <Videocam /> : <VideocamOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="nav-btn"
            onClick={handleFullscreenClick}
          >
            {stream && fullscreen ? <FullscreenExit /> : <Fullscreen />}
          </IconButton>

          <IconButton
            color="secondary"
            className="nav-btn"
            onClick={handleLeaveClick}
          >
            <PowerSettingsNew />
          </IconButton>
          <Button variant="contained" color="primary" onClick={togglePinVideos}>
            Pin Videos
          </Button>
          {pinningVideos && (
            <PinVideoDialog
              open={pinningVideos}
              subscriber_list={subscribers}
              onClose={handleClose}
            />
          )}
        </div>
      </header>
    )
  );
}
