import React from "react";
import { OpenVidu } from "openvidu-browser";
import { useEffect } from "react";

export default VideoRoomComponent = () => {
  // PROPS ~~
  // OPENVIDU_SERVER_URL; double check ternary
  const [openviduServerUrl, setOpenviduServerUrl] = useState(
    "https://" + window.location.hostname + ":4443"
  );
  // OPENVIDU SERVER SECRET; double check ternary
  const [openviduServerSecret, setOpenviduServerSecret] = useState("MY_SECRET");
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
  // const layout = new OpenViduLayout();
  const [sessionName, setSessionName] = useState("SessionA");
  const [userName, setUserName] = useState(
    "OpenVidu_User" + Math.floor(Math.random() * 100)
  );
  // PROPS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // STATE ~~
  const [mySessionId, setMySessionId] = useState(sessionName);
  const [myUserName, setMyUserName] = useState(userName);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [token, setToken] = useState(undefined);
  // const [chatDisplay, setChatDisplay] = useState("none"); not video/audio reqs
  // STATE ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // componentDidMount
  useEffect(() => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
      minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
      fixedRatio: false, // If this is true then the aspect ratio of the video is maintained and minRatio and maxRatio are ignored (default false)
      bigClass: "OV_big", // The class to add to elements that should be sized bigger
      bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
      bigFixedRatio: false, // fixedRatio for the big ones
      bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
      bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
      bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
      animate: true, // Whether you want to animate the transitions
    };

};
