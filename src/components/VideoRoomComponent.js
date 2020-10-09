import React from "react";
import { LocalRecorder, OpenVidu } from "openvidu-browser";
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
  const [connectError, setConnectError] = useState("");
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

    // CHANGE DOCUMENT.getelementbyid
    this.layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );

    window.addEventListener("beforeunload", this.onbeforeunload);
    window.addEventListener("resize", this.updateLayout);
    window.addEventListener("resize", this.checkSize);

    return () => {
      window.removeEventListener("beforeunload", this.onbeforeunload);
      window.removeEventListener("resize", this.updateLayout);
      window.removeEventListener("resize", this.checkSize);
    };
  }, []);

  onbeforeunload = (event) => {
    this.leaveSession();
  };

  joinSession = () => {
    this.OV = new OpenVidu();
    this.setState(
      {
        session: this.OV.initSession(),
      },
      () => {
        this.subscribeToStreamCreated();
        this.connectToSession();
      }
    );
  };

  connectToSession = () => {
    if (token !== undefined) {
      console.log("token received: ", token);
      connect(token); // v. this.connect()
    } else {
      getToken()
        .then((token) => {
          console.log(token);
          connect(token);
        })
        .catch((error) => {
          if (error) {
            setConnectError(
              error.error + error.message + error.code + error.status
            );
          }
          console.log(
            "There was an error getting the token:",
            error.code,
            error.message
          );
          alert("There was an error getting the token:", error.message);
        }); // v. this.getToken()
    }
  };

  connect = (token) => {
    session
      .connect(token, {
        clientData: myUserName,
      })
      .then(() => {
        connectWebCam();
      })
      .catch((error) => {
        if (connectError) {
          setConnectError(
            error.error + error.message + error.code + error.status
          );
        }
        alert("There was an error connecting to the session:", error.message);
        console.log(
          "There was an error connecting to the session:",
          error.code,
          error.message
        );
      });
  };

  connectWebCam = () => {
    let publisher = this.OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

    // HMMMMM????????????????????????????????????????????
    if (session.capabilities.publish) {
      session.publish(publisher).then(() => {
        if (joinSession()) {
          joinSession();
        }
      });
    }

    localUser.setNickname(myUserName);
    localUser.setConnectionId(session.connection.connectionId);
    localUser.setScreenShareActive(false);
    localUser.setStreamManager(publisher);
    subscribeToUserChanged(); // had this.
    subscribeToStreamDestroyed(); // had this.
    sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    }); // had this.

    setLocalUser(localUser);
  };
};
