import React, { useEffect, useRef } from "react";

export default function OvVideo({ stream }) {
  const videoRef = useRef();

  useEffect(() => {
    if (stream && !!videoRef) {
      stream.addVideoElement(videoRef.current);
    }
  }, [stream]);

  return (
    <video ref={videoRef} autoPlay id={`video-${stream.stream.streamId}`} />
  );
}
