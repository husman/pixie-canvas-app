import React, { useEffect, useRef } from "react";
import "./StreamComponent.css";

export default function OvVideo(props) {
  let videoRef = useRef();

  useEffect(() => {
    if (props && props.user.streamManager && !!videoRef) {
      console.log("PROPS: ", props);
      props.user.getStreamManager().addVideoElement(videoRef.current);
    }

    if (props && props.user.streamManager.session && props.user && !!videoRef) {
      props.user.streamManager.session.on("signal:userChanged", (event) => {
        const data = JSON.parse(event.data);
        if (data.isScreenShareActive !== undefined) {
          props.user.getStreamManager().addVideoElement(videoRef.current);
        }
      });
    }
  });

  if (props && !!videoRef) {
    props.user.getStreamManager().addVideoElement(videoRef.current);
  }

  return (
    <video
      autoPlay={true}
      id={"video-" + props.user.getStreamManager().stream.streamId}
      ref={videoRef}
      muted={props.mutedSound}
    />
  );
}
