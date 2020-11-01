import React from "react";
import StreamComponent from "./Stream";

const Videos = ({ stream, isMicOn, isCameraOn, subscribers }) => {
  return (
    <div className="video-container">
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
  );
};

export default Videos;
