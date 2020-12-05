import React, { useEffect, useRef } from "react";
import Person from "@material-ui/icons/Person";

export default function OvVideo({ stream, isCameraOn }) {
  const videoRef = useRef();

  useEffect(() => {
    if (stream && !!videoRef) {
      stream.addVideoElement(videoRef.current);
    }
  }, [stream]);

  // TODO: If video not published, display default profile pic

  return <video ref={videoRef} autoPlay />;
  // return <>{isCameraOn ? <video ref={videoRef} autoPlay /> : <Person />}</>;
}
