import React, { useEffect, useRef } from "react";
import "./StreamComponent.css";

export default function OvVideo({
  user,
  mutedSound,
}) {
  const videoRef = useRef();
  const stream = user.getStreamManager();

  useEffect(() => {
    if (stream && user && user.streamManager && !!videoRef) {
      console.log("PROPS: ", user.streamManager);
      stream.addVideoElement(videoRef.current);

      if (user && user.streamManager.session) {
        user.streamManager.session.on("signal:userChanged", (event) => {
          const data = JSON.parse(event.data);
          if (data.isScreenShareActive !== undefined) {
            stream.addVideoElement(videoRef.current);
          }
        });
      }
    } else if (stream && !!videoRef) {
      stream.addVideoElement(videoRef.current);
    }
  });

  console.log("FDTMH", user);

  if (!stream) {
    return null;
  }

  return (
    <video
      ref={videoRef}
      autoPlay={true}
      id={"video-" + stream.streamId}
      muted={mutedSound}
    />
  );
}
