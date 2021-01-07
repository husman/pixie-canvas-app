import React from "react";
import Stream from "./Stream";
import {
  DEFAULT_MIN_VIDEOS,
  DEFAULT_MID_MAX_VIDEOS,
  DEFAULT_MAX_VIDEOS,
} from "./constants/video";

const Videos = ({ stream, isMicOn, isCameraOn, pinnedVideos, subscribers }) => {
  const pinnedSubscribersCt = pinnedVideos.length + 1; // subscribers + user stream
  let videoLayout = "one";

  if (pinnedSubscribersCt === 2) {
    videoLayout = "two";
  } else if (pinnedSubscribersCt === 3) {
    videoLayout = "three";
  } else if (pinnedSubscribersCt === 4) {
    videoLayout = "four";
  } else if (pinnedSubscribersCt >= 5) {
    videoLayout = "full";
  }

  return (
    <>
      <div className={`video-container video-${videoLayout}-col`}>
        <Stream
          stream={stream}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          className="user-stream"
        />
        {pinnedVideos.map((key) => {
          const { stream, isMicOn, isCameraOn } = key && subscribers[key];
          return (
            <Stream
              key={key}
              stream={stream}
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              className={`user-stream`}
            />
          );
        })}
      </div>
    </>
  );
};

export default Videos;
