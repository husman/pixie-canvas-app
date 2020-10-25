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
import { AppBar, Toolbar as ToolBar, IconButton } from "@material-ui/core";

export default function Toolbar(props) {
  const [fullscreen, setFullscreen] = useState(false);
  const {
    sessionId: mySessionId,
    user: localUser,
    isMicOn,
    isCameraOn,
  } = props;

  const micStatusChanged = () => {
    props.micStatusChanged();
  };

  const camStatusChanged = () => {
    props.camStatusChanged();
  };

  const toggleFullscreen = () => {
    setFullscreen((prevFullscreen) => !prevFullscreen);
    props.toggleFullscreen();
  };

  const leaveSession = () => {
    props.leaveSession();
  };

  return (
    <AppBar className="toolbar" id="header">
      <ToolBar className="toolbar">
        {mySessionId && <h3 id="session-title">{mySessionId}</h3>}

        <div className="buttonsContent">
          <IconButton
            color="inherit"
            className="navButton"
            id="navMicButton"
            onClick={micStatusChanged}
          >
            {isMicOn ? <Mic /> : <MicOff color="secondary" />}
          </IconButton>

          <IconButton
            color="inherit"
            className="navButton"
            id="navCamButton"
            onClick={camStatusChanged}
          >
            {isCameraOn ? <Videocam /> : <VideocamOff color="secondary" />}
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
