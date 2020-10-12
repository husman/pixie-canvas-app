import React, { useEffect, useState } from "react";
import { OpenVidu } from "openvidu-browser";
import StreamComponent from "../stream/StreamComponent";
import ToolbarComponent from "../toolbar/Toolbar";
import OpenViduLayout from "../../layout/openvidu-layout";
import UserModel from "../../models/UserModels";

var localUser = new UserModel();

export default function VideoRoom(props) {
  const { sessionName, error } = props;
  const OV = new OpenVidu();
  const layout = new OpenViduLayout();

  /* States */
  const [hasBeenUpdated, setHasBeenUpdated] = useState(false);
  const [mySessionId, setMySessionId] = useState(
    sessionName ? sessionName : "SessionA"
  );
  const [myUserName, setMyUserName] = useState(
    "OpenVidu_User" + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState(OV.initSession());
  const [localUser, setLocalUser] = useState(new UserModel());
  const [subscribers, setSubscribers] = useState([]);
  const [webcamPublisher, setWebcamPublisher] = useState();
  // const [token, setToken] = useState();
  // const [openviduServerSecret, setOpenviduServerSecret] = useState(props.openviduServerSecret ? props.openviduSeverSecret : "MY_SECRET");

  useEffect(() => {
    const openViduLayoutOptions = {
      maxRatio: 3 / 2,
      minRatio: 9 / 16,
      fixedRatio: false,
      bigClass: "OV_big",
      bigPercentage: 0.8,
      bigFixedRatio: false,
      bigMaxRatio: 3 / 2,
      bigMinRatio: 9 / 16,
      bigFirst: true,
      animate: true,
    };

    layout.initLayoutContainer(
      document.getElementById("layout"), // TO-DO: Move to useRef
      openViduLayoutOptions
    );

    window.addEventListener("beforeunload", onbeforeunload);
    window.addEventListener("resize", updateLayout);
    window.addEventListener("resize", checkSize);
    // joinSession();

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("resize", checkSize);
    };
  }, []);

  useEffect(() => {
    subscribeToStreamCreated();
    // connectToSession();
    connect();
  }, [session]);

  useEffect(() => {
    if (localUser) {
      sendSignalUserChanged({
        isAudioActive: localUser.isAudioActive(),
        isVideoActive: localUser.isVideoActive(),
        nickname: localUser.getNickname(),
      });
    }
    updateLayout();
  }, [subscribers]);

  useEffect(() => {
    // TO-DO: Fix publisher callback
    // localUser.getStreamManager().on("streamPlaying", (e) => {
    //   updateLayout();
    //   webcamPublisher.videos[0].video.parentElement.classList.remove(
    //     "custom-class"
    //   );
    // });
  }, [localUser, webcamPublisher]);

  const getToken = async () => {
    const meetingUrl = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      (c) => {
        var r = (Math.random() * 16) | 0,
          v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );


    const host = process.env.NODE_ENV && false === 'development' ? 'http://localhost:4000' : 'http://pixie.neetos.com';

    try {
      const response = await fetch(
        `${host}/token?meetingUrl=${meetingUrl}`,
      );

      const { token } = await response.json();
      console.log('token', token);

      return token;
    } catch (err) {
      console.error(err);
    }
  };

  onbeforeunload = (event) => {
    leaveSession();
  };

  const connect = async () => {
    const myToken = await getToken();

    session
      .connect(myToken, {
        clientData: myUserName,
      })
      .then(() => {
        connectWebCam();
      })
      .catch((e) => {
        if (error) {
          error({
            error: e.error,
            messgae: e.message,
            code: e.code,
            status: e.status,
          });
        }
        alert("There was an error connecting to the session:", e.message);
        console.log(
          "There was an error connecting to the session:",
          e.code,
          e.message
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
        if (props.joinSession) {
          props.joinSession();
        }
      });
    }

    localUser.setNickname(myUserName);
    localUser.setConnectionId(session.connection.connectionId);
    localUser.setStreamManager(publisher);
    subscribeToUserChanged();
    subscribeToStreamDestroyed();
    setWebcamPublisher(publisher);
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

    if (props.leaveSession) {
      props.leaveSession();
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
          if (data.isAudioActive !== undefined) {
            user.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== undefined) {
            user.setVideoActive(data.isVideoActive);
          }
          if (data.nickname !== undefined) {
            user.setNickname(data.nickname);
          }
        }
      });
      setSubscribers(remoteUsers);
    });
  };

  const updateLayout = () => {
    setTimeout(() => {
      layout.updateLayout();
    }, 20);
  };

  const sendSignalUserChanged = async (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    // TO-DO: Fix session.signal error
    // await session.signal(signalOptions);
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
}
