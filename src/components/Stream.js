import React from "react";
import OvVideo from "./OvVideo";
import { VideocamOff, MicOff } from "@material-ui/icons";
import Person from "@material-ui/icons/Person";

export default function StreamComponent({
  stream,
  isMicOn,
  isCameraOn,
  className = "",
}) {
  return (
    <div className={`stream-container ${className}`}>
      {/* {isCameraOn ? ( */}
      <OvVideo stream={stream} isCameraOn={isCameraOn} />
      {/* ) : (
        // Todo: Fix Styling
        <Person id="person-no-video" />
      )} */}

      <div className="video-status-icons">
        {!isCameraOn && <VideocamOff className="cam-off-icon" />}
        {!isMicOn && <MicOff className="mic-off-icon" />}
      </div>
    </div>
  );
}
