import React, { useState } from "react";
import PinVideoDialog from "./PinVideoDialog";
import { PIN_VIDEOS_BUTTON } from "./constants/translation";
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

export default function Toolbar({
  stream,
  isMicOn,
  isCameraOn,
  sessionId,
  micStatusChanged,
  camStatusChanged,
  toggleFullscreen,
  leaveSession,
  subscribers,
  pinnedVideos,
  updatePinnedVideos,
}) {
  const [fullscreen, setFullscreen] = useState(false);
  const [isPinningVideos, setPinningVideos] = useState(false);

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

  const togglePinnedVideos = () => {
    setPinningVideos((prev) => !prev);
  };

  const handleUpdatePinnedVideos = (pinnedVideos) => {
    updatePinnedVideos(pinnedVideos);
    setPinningVideos(false);
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
        <Button
          variant="contained"
          color="secondary"
          className="nav-btn"
          onClick={togglePinnedVideos}
        >
          {PIN_VIDEOS_BUTTON}
        </Button>
        {subscribers && (
          <PinVideoDialog
            open={isPinningVideos}
            subscribers={subscribers}
            currentPinnedVideos={pinnedVideos}
            onClose={handleUpdatePinnedVideos}
            onCancel={togglePinnedVideos}
          />
        )}
      </div>
    </header>
  );
}
