import React from "react";
import { LocalRecorder, OpenVidu } from "openvidu-browser";
import { useEffect } from "react";

export default VideoRoomComponent = () => {
  const [openviduServerUrl, setOpenviduServerUrl] = useState(
    "https://" + window.location.hostname + ":4443"
  ); // OPENVIDU_SERVER_URL; double check ternary
  const [openviduServerSecret, setOpenviduServerSecret] = useState("MY_SECRET"); // OPENVIDU SERVER SECRET; double check ternary
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
  const [layout, setLayout] = useState(new OpenViduLayout());
  const [sessionName, setSessionName] = useState("SessionA");
  const [userName, setUserName] = useState(
    "OpenVidu_User" + Math.floor(Math.random() * 100)
  );
  const [mySessionId, setMySessionId] = useState(sessionName);
  const [myUserName, setMyUserName] = useState(userName);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);
  const [token, setToken] = useState(undefined);
  const [connectError, setConnectError] = useState("");
  const [chatDisplay, setChatDisplay] = useState("none"); // not video/audio reqs

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
    layout.initLayoutContainer(
      document.getElementById("layout"),
      openViduLayoutOptions
    );

    window.addEventListener("beforeunload", onbeforeunload);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("resize", checkSize);

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    subscribeToStreamCreated();
    connectToSession();
  }, [session]);

  useEffect(() => {
    if (localUser) {
      sendSignalUserChanged({
        isAudioActive: localUser.isAudioActive(),
        isVideoActive: localUser.isVideoActive(),
        nickname: localUser.getNickname(),
        isScreenShareActive: localUser.isScreenShareActive(),
      });
    }
    updateLayout();
    checkSomeoneShareScreen();
  }, [subscribers]);

  useEffect(() => {
    localUser.getStreamManager().on("streamPlaying", (e) => {
      updateLayout();
      publisher.videos[0].video.parentElement.classList.remove("custom-class");
    });
  }, [localUser]);

  onbeforeunload = (event) => {
    leaveSession();
  };

  joinSession = () => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  };

  connectToSession = () => {
    if (token !== undefined) {
      console.log("token received: ", token);
      connect(token);
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
        });
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
    let publisher = OV.initPublisher(undefined, {
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
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    });
    setLocalUser(localUser);
  };

  leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }

    // Empty all properties... Leave session
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA"); // hardcoded session A, needs to be a state !!!!!!!
    setMyUserName("OpenVidu_User" + Math.floor(Math.random() * 100));
    setLocalUser(undefined);

    // DOUBLE CHECK DIFF BT FUNCTION AND STATE VARIABLE!!!!!
    if (leaveSession) {
      leaveSession();
    }
  };

  // Can you update local user this way??
  camStatusChanged = () => {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    setLocalUser(localUser);
  };

  micStatusChanged = () => {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    //?????????????? passing in part object is AudioActive
    sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    setLocalUser(localUser);
  };

  nicknameChanged = (nickname) => {
    let myLocalUser = localUser; // same name error??????
    myLocalUser.setNickname(nickname);
    setLocalUser(myLocalUser);
    sendSignalUserChanged({ nickname: myLocalUser.getNickname() });
  };

  deleteSubscriber = (stream) => {
    const remoteUsers = subscribers;
    const userStream = remoteUsers.filter(
      (user) => user.getStreamManager().stream === stream
    )[0];
    let index = remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      remoteUsers.splice(index, 1);
      setSubscribers(remoteUsers);
    }
  };

  subscribeToStreamCreated = () => {
    session.on("streamCreated", (event) => {
      const subscriber = session.subscribe(event.stream, undefined);
      const mySubscribers = subscribers;
      subscriber.on("streamPlaying", (e) => {
        checkSomeoneShareScreen();
        subscriber.videos[0].video.parentElement.classList.remove(
          "custom-class"
        );
      });
      const newUser = new UserModel();
      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      newUser.setType("remote");
      const nickname = event.stream.connection.data.split("%")[0];
      newUser.setNickname(JSON.parse(nickname).clientData);
      mySubscribers.push(newUser);
      setSubscribers(mySubscribers);
    });
  };

  subscribeToStreamDestroyed = () => {
    // On every Stream destroyed...
    session.on("streamDestroyed", (event) => {
      // Remove the stream from 'subscribers' array
      deleteSubscriber(event.stream);
      setTimeout(() => {
        checkSomeoneShareScreen();
      }, 20);
      event.preventDefault();
      updateLayout();
    });
  };

  subscribeToUserChanged = () => {
    session.on("signal:userChanged", (event) => {
      let remoteUsers = subscribers;

      remoteUsers.forEach((user) => {
        if (user.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);
          console.log("EVENT REMOTE: ", event.data);
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
          if (data.isScreenShareActive !== undefined) {
            user.setScreenShareActive(data.isScreenShareActive);
          }
        }
      });
    });
    setSubscribers(remoteUsers);
  };

  updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout();
    }, timeout);
  };
};
