import React from "react";
import { render } from "react-dom";
import VideoRoomComponent from "./lib/components/videoroom/VideoRoom";

const App = () => (
  <div style={{ width: "100%", margin: "0" }}>
    <VideoRoomComponent />
  </div>
);

render(<App />, document.getElementById("root"));
