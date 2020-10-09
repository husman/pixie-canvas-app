import React, { useEffect } from "react";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "./stream/StreamComponent";
import OpenViduLayout from "../layout/openvidu-layout";
import UserModel from "../models/user-model";
import ToolbarComponent from "./toolbar/Toolbar";

export default VideoRoom = () => {
  const layout = new OpenViduLayout();

  /* Server Side Variables */
  const [openviduServerUrl, setOpenviduServerUrl] = useState(
    "https://" + window.location.hostname + ":4443"
  );
  const [openviduServerSecret, setOpenviduServerSecret] = useState("MY_SECRET");

  /* Client Variables */
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
  const [sessionName, setSessionName] = useState("SessionA");
  const [userName, setUserName] = useState(
    "OpenVidu_User" + Math.floor(Math.random() * 100)
  );
  const [mySessionId, setMySessionId] = useState(sessionName);
  const [myUserName, setMyUserName] = useState(userName);
  const [session, setSession] = useState(undefined);
  const [localUser, setLocalUser] = useState(new UserModel());
  const [subscribers, setSubscribers] = useState([]);
  const [token, setToken] = useState(undefined);
  const [connectError, setConnectError] = useState("");

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
    sendSignalUserChanged({
      isScreenShareActive: localUser.isScreenShareActive(),
    });
  }, [localUser]);

  onbeforeunload = (event) => {
    leaveSession();
  };

  const joinSession = () => {
    OV = new OpenVidu();
    setSession(OV.initSession());
  };

  const connectToSession = () => {
    if (token !== undefined) {
      console.log("token received: ", token);
      connect(token);
    } else {
      getToken()
        .then((token) => {
          console.log(token);
          setToken(token);
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

  const connect = (token) => {
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

  const connectWebCam = () => {
    let publisher = OV.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: localUser.isAudioActive(),
      publishVideo: localUser.isVideoActive(),
      resolution: "640x480",
      frameRate: 30,
      insertMode: "APPEND",
    });

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

  const leaveSession = () => {
    const mySession = session;
    if (mySession) {
      mySession.disconnect();
    }

    // Clear Properties
    OV = null;
    setSession(undefined);
    setSubscribers([]);
    setMySessionId("SessionA");
    setMyUserName("OpenVidu_User" + Math.floor(Math.random() * 100));
    setLocalUser(undefined);

    if (leaveSession) {
      leaveSession();
    }
  };

  const camStatusChanged = () => {
    localUser.setVideoActive(!localUser.isVideoActive());
    localUser.getStreamManager().publishVideo(localUser.isVideoActive());
    sendSignalUserChanged({ isVideoActive: localUser.isVideoActive() });
    setLocalUser(localUser);
  };

  const micStatusChanged = () => {
    localUser.setAudioActive(!localUser.isAudioActive());
    localUser.getStreamManager().publishAudio(localUser.isAudioActive());
    sendSignalUserChanged({ isAudioActive: localUser.isAudioActive() });
    setLocalUser(localUser);
  };

  const nicknameChanged = (nickname) => {
    let myLocalUser = localUser;
    myLocalUser.setNickname(nickname);
    setLocalUser(myLocalUser);
    sendSignalUserChanged({ nickname: myLocalUser.getNickname() });
  };

  const deleteSubscriber = (stream) => {
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

  const subscribeToStreamCreated = () => {
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

  const subscribeToStreamDestroyed = () => {
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

  const subscribeToUserChanged = () => {
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

  const updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout();
    }, timeout);
  };

  const sendSignalUserChanged = (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    session.signal(signalOptions);
  };

  const toggleFullscreen = () => {
    const document = window.document;
    const fs = document.getElementById("container");
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (fs.requestFullscreen) {
        fs.requestFullscreen();
      } else if (fs.msRequestFullscreen) {
        fs.msRequestFullscreen();
      } else if (fs.mozRequestFullScreen) {
        fs.mozRequestFullScreen();
      } else if (fs.webkitRequestFullscreen) {
        fs.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  };

  /**
   * Omitted Screen Share Fcns
   */
  /**
   * Omitted Chat Fcns
   */

  const checkSize = () => {
    if (
      document.getElementById("layout").offsetWidth <= 700 &&
      !hasBeenUpdated
    ) {
      setHasBeenUpdated(true);
    }
    if (document.getElementById("layout").offsetWidth > 700 && hasBeenUpdated) {
      setHasBeenUpdated(false);
    }
  };

  return (
    <div className="container" id="container">
      <ToolbarComponent
        sessionId={mySessionId}
        user={localUser}
        camStatusChanged={camStatusChanged}
        micStatusChanged={micStatusChanged}
        toggleFullscreen={toggleFullscreen}
        leaveSession={leaveSession}
      />
      <div id="layout" className="bounds">
        {localUser !== undefined && localUser.getStreamManager() !== undefined && (
          <div className="OT_root OT_publisher custom-class" id="localUser">
            <StreamComponent
              user={localUser}
              handleNickname={nicknameChanged}
            />
          </div>
        )}
        {subscribers.map((sub, i) => (
          <div
            key={i}
            className="OT_root OT_publisher custom-class"
            id="remoteUsers"
          >
            <StreamComponent
              user={sub}
              streamId={sub.streamManager.stream.streamId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
