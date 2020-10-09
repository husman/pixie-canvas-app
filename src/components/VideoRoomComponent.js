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
};
