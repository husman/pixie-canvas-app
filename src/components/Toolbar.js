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
    /*  TOOD: Enforce contract that pinned videos can never remove subscribers from the stream, only alters their pinned state */
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
          onClick={togglePinnedVideos}
        >
          Pin Videos
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
