import React, { useState } from "react";
import OvVideo from "./OvVideo";
import { VideocamOff, MicOff, VolumeUp, VolumeOff } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";

export default function StreamComponent({ user, isMicOn, isCameraOn }) {
  const [mutedSound, setMutedSound] = useState(false);

  const toggleSound = () => {
    setMutedSound((prevMutedSound) => !prevMutedSound);
  };

  return (
    <div className="stream-component">
      <OvVideo user={user} mutedSound={mutedSound} />

      <div id="statusIcons">
        {!isCameraOn && <VideocamOff id="statusCam" />}
        {!isMicOn && <MicOff id="statusMic" />}
      </div>

      <div className="volume-btn-container">
        {!user.isLocal() && (
          <IconButton id="volumeButton" onClick={toggleSound}>
            {mutedSound ? <VolumeOff color="secondary" /> : <VolumeUp />}
          </IconButton>
        )}
      </div>
    </div>
  );
}
