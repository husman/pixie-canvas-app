import React, { useState } from "react";
import Stream from "./Stream";
import {
  DEFAULT_MIN_VIDEOS,
  DEFAULT_MID_MAX_VIDEOS,
  DEFAULT_MAX_VIDEOS,
} from "./constants/video";

const Videos = ({ stream, isMicOn, isCameraOn, pinnedVideos, subscribers }) => {
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

  // TODO: Video/Audio is unpublished when pinned
  return (
    <div className={`video-container video-${videoLayout}-col`}>
      <div className="video-centering">
        <Stream
          stream={stream}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          className="user-stream"
        />
        {pinnedVideos &&
          Object.entries(pinnedVideos).map(([key, value]) => {
            console.log("pinned", value);
            return (
              <Stream
                key={key}
                stream={value.stream}
                className="user-stream"
                isMicOn={value.isMicOn}
                isCameraOn={value.isCameraOn}
              />
            );
          })}
      </div>
    </div>
  );
};

export default Videos;
