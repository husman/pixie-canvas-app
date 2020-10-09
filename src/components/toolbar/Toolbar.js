import React from "react";
import "./ToolbarComponent.css";
import AppBar from "material-ui/core/AppBar";
import Toolbar from "material-ui/core/Toolbar";

import Mic from "material-ui/svg-icons/av/mic";
import MicOff from "material-ui/svg-icons/av/mic-off";
import Videocam from "material-ui/svg-icons/av/videocam";
import Fullscreen from "material-ui/svg-icons/navigation/fullscreen";
import FullscreenExit from "material-ui/svg-icons/navigation/fullscreen-exit";
import PictureInPicture from "material-ui/svg-icons/action/picture-in-picture";
import PowerSettingsNew from "material-ui/svg-icons/action/power-settings-new";

import IconButton from "material-ui/core/IconButton";
import { render } from "@testing-library/react";

export default Toolbar = (mySessionId, localUser) => {
  const [fullscreen, setFullscreen] = useState(false);

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
      <Toolbar className="toolbar">
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
      </Toolbar>
    </AppBar>
  );
};
