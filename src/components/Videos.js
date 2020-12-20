import React, { useState } from "react";
import Stream from "./Stream";
import {
  DEFAULT_MIN_VIDEOS,
  DEFAULT_MID_MAX_VIDEOS,
  DEFAULT_MAX_VIDEOS,
} from "./constants/video";

const Videos = ({ stream, isMicOn, isCameraOn, pinnedVideos, subscribers }) => {
  const pinnedSubscribersCt = pinnedVideos.size + 1; // subscribers + user stream
  let videoLayout = "two";
  // let videoLayout = "one"; // TODO: Fix single video sizing bug

  if (
    pinnedSubscribersCt >= DEFAULT_MIN_VIDEOS &&
    pinnedSubscribersCt < DEFAULT_MID_MAX_VIDEOS
  ) {
    videoLayout = "two";
  } else if (
    pinnedSubscribersCt >= DEFAULT_MID_MAX_VIDEOS &&
    pinnedSubscribersCt <= DEFAULT_MAX_VIDEOS
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
        {pinnedVideos.forEach((key) => {
          console.log("Looping", key);
          const { stream, isMicOn, isCameraOn } = subscribers[key];
          console.log("Looping", stream, isMicOn, isCameraOn);

          return (
            <Stream
              key={key}
              stream={stream}
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              className="subscriber-stream"
            />
          );
        })}
      </div>
    </div>
  );
};

export default Videos;
