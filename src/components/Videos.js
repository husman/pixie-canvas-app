import React from "react";
import Stream from "./Stream";
import {
  DEFAULT_MIN_VIDEOS,
  DEFAULT_MID_MAX_VIDEOS,
  DEFAULT_MAX_VIDEOS,
} from "./constants/video";

const Videos = ({ stream, isMicOn, isCameraOn, subscribers }) => {
  const subscribersCt = Object.keys(subscribers).length;
  let videoLayout = "one";

  if (
    subscribersCt >= DEFAULT_MIN_VIDEOS &&
    subscribersCt < DEFAULT_MID_MAX_VIDEOS
  ) {
    videoLayout = "two";
  } else if (
    subscribersCt >= DEFAULT_MID_MAX_VIDEOS &&
    subscribersCt <= DEFAULT_MAX_VIDEOS
  ) {
    videoLayout = "three";
  }

  return (
    <div className={`video-container video-${videoLayout}-col`}>
      <div className="video-centering">
        <Stream
          stream={stream}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          className="user-stream"
        />
        {Object.entries(subscribers).map(([key, value]) => (
          <Stream
            stream={value.stream}
            className="user-stream"
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
