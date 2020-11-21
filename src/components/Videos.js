import React from "react";
import StreamComponent from "./Stream";

const Videos = ({ stream, isMicOn, isCameraOn, subscribers }) => {
  const subscribersCt = Object.keys(subscribers).length;
  let videoLayout = "one";

  if (subscribersCt >= 1 && subscribersCt < 4) {
    videoLayout = "two";
  } else if (subscribersCt >= 4) {
    videoLayout = "three";
  }

  return (
    <div className={`video-container video-${videoLayout}-col`}>
      <div className="video-centering">
        <StreamComponent
          stream={stream}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          className="user-stream"
        />
        {Object.entries(subscribers).map(([key, value]) => (
          <StreamComponent
            stream={value.stream}
            className="subscriber-stream"
            key={key}
            isMicOn={value.isMicOn}
            isCameraOn={value.isCameraOn}
          />
        ))}
      </div>
    </div>
  );
};

export default Videos;
