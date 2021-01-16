import React from "react";
import Stream from "./Stream";
import { DEFAULT_MAX_VIDEOS } from "./constants/video";

const Videos = ({ stream, isMicOn, isCameraOn, pinnedVideos, subscribers }) => {
  const pinnedSubscribersCt = pinnedVideos.length + 1; // subscribers + user stream
  let videoLayout = `${pinnedSubscribersCt}`;

  if (pinnedSubscribersCt >= DEFAULT_MAX_VIDEOS) {
    videoLayout = "full";
  }

  return (
    <>
      <div className={`video-container video-${videoLayout}-col`}>
        <Stream
          stream={stream}
          isMicOn={isMicOn}
          isCameraOn={isCameraOn}
          className="stream-0"
        />
        {pinnedVideos.map((key, index) => {
          const { stream, isMicOn, isCameraOn } = key && subscribers[key];
          return (
            <Stream
              key={key}
              stream={stream}
              isMicOn={isMicOn}
              isCameraOn={isCameraOn}
              className={`stream-${index + 1}`}
            />
          );
        })}
      </div>
    </>
  );
};

export default Videos;
