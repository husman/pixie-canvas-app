import React, { useEffect, useRef } from "react";

export default function OvVideo({ user, mutedSound }) {
  const videoRef = useRef();
  const stream = user.getStreamManager();
  useEffect(() => {
    if (stream && !!videoRef) {
      stream.addVideoElement(videoRef.current);
      if (user.streamManager.session) {
        user.streamManager.session.on("signal:userChanged", (event) => {
          const data = JSON.parse(event.data);
          if (data.isScreenShareActive !== undefined) {
            stream.addVideoElement(videoRef.current);
          }
        });
      }
    }
  });

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      id={"video-" + stream.stream.streamId}
      muted={mutedSound}
    />
  );
}
