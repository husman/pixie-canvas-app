import React, { useState } from "react";
import "./StreamComponent.css";
import OvVideoComponent from "./OvVideo";
import { VideocamOff, MicOff, VolumeUp, VolumeOff } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default function StreamComponent({ user, isMicOn, isCameraOn }) {
  const [mutedSound, setMutedSound] = useState(false);

  const toggleSound = () => {
    setMutedSound((prevMutedSound) => !prevMutedSound);
  };

  return (
    <div className="OT_widget-container">
      <div className="streamComponent">
        <OvVideoComponent user={user} mutedSound={mutedSound} />

        <div id="statusIcons">
          {!isCameraOn && (
            <div id="camIcon">
              <VideocamOff id="statusCam" />
            </div>
          )}

          {!isMicOn && (
            <div id="micIcon">
              <MicOff id="statusMic" />
            </div>
          )}
        </div>
        <div className="volume-btn-container">
          {!user.isLocal() && (
            <IconButton id="volumeButton" onClick={toggleSound}>
              {mutedSound ? <VolumeOff color="secondary" /> : <VolumeUp />}
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}
