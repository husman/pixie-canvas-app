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
import { IconButton } from "@material-ui/core";

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

  return (
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
      </div>
    </header>
  );
}
