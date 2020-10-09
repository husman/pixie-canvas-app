import React, { useState } from "react";
import "./ToolbarComponent.css";

import {
  AvVideocamOff as VideocamOff,
  AvMicOff as MicOff,
  AvMic as Mic,
  AvVideocam as Videocam,
  NavigationFullscreen as Fullscreen,
  NavigationFullscreenExit as FullscreenExit,
  ActionPowerSettingsNew as PowerSettingsNew,
} from "material-ui/svg-icons";
import { AppBar, Toolbar as ToolBar, IconButton } from "@material-ui/core";

export default function Toolbar(props) {
  const [fullscreen, setFullscreen] = useState(false);
  const mySessionId = props.sessionId;
  const localUser = props.user;

  const micStatusChanged = () => {
    micStatusChanged();
  };

  const camStatusChanged = () => {
    camStatusChanged();
  };

  const toggleFullscreen = () => {
    setFullscreen((prevFullscreen) => !prevFullscreen);
    toggleFullscreen();
  };

  const leaveSession = () => {
    leaveSession();
  };

  return (
    <AppBar className="toolbar" id="header">
      <ToolBar className="toolbar">
        <div id="navSessionInfo">
          {mySessionId && (
            <div id="titleContent">
              <span id="session-title">{mySessionId}</span>
            </div>
          )}
        </div>
        <div className="buttonsContent">
          <IconButton
            color="inherit"
            className="navButton"
            id="navMicButton"
            onClick={micStatusChanged}
          >
            {localUser !== undefined && localUser.isAudioActive() ? (
              <Mic />
            ) : (
              <MicOff color="secondary" />
            )}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navCamButton"
            onClick={camStatusChanged}
          >
            {localUser !== undefined && localUser.isVideoActive() ? (
              <Videocam />
            ) : (
              <VideocamOff color="secondary" />
            )}
          </IconButton>
          <IconButton
            color="inherit"
            className="navButton"
            onClick={toggleFullscreen}
          >
            {localUser !== undefined && fullscreen ? (
              <FullscreenExit />
            ) : (
              <Fullscreen />
            )}
          </IconButton>
          <IconButton
            color="secondary"
            className="navButton"
            onClick={leaveSession}
            id="navLeaveButton"
          >
            <PowerSettingsNew />
          </IconButton>
        </div>
      </ToolBar>
    </AppBar>
  );
}
