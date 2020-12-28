import React, { useEffect, useRef } from "react";
import Person from "@material-ui/icons/Person";

export default function OvVideo({ stream, isCameraOn, isIcon }) {
  const videoRef = useRef();
  const icon = isIcon ? "icon" : "full";
  useEffect(() => {
    if (stream && !!videoRef && isCameraOn) {
      stream.addVideoElement(videoRef.current);
    }
  }, [stream, isCameraOn]);

  return (
    <>
      {isCameraOn ? (
        <video className={`dialog-stream-${icon}`} ref={videoRef} autoPlay />
      ) : (
        <Person className={`person-${icon}`} />
      )}
    </>
  );
}
