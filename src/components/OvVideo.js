import React, { useEffect, useRef } from "react";

export default function OvVideo({ stream, isCameraOn }) {
  const videoRef = useRef();
  useEffect(() => {
    if (stream && !!videoRef && isCameraOn) {
      stream.addVideoElement(videoRef.current);
    }
  }, [stream, isCameraOn]);

  return <video ref={videoRef} autoPlay />;
}
