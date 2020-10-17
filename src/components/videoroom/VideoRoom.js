import React, { useEffect, useState, useRef } from "react";
import { OpenVidu } from "openvidu-browser";
import { v4 as uuidv4 } from "uuid";
import StreamComponent from "../stream/Stream";
import ToolbarComponent from "../toolbar/Toolbar";
import UserModel from "../../models/UserModels";
import "./VideoRoom.css";

export default function VideoRoom(props) {
  let OV = useRef(new OpenVidu());
  const [mySessionId, setMySessionId] = useState("SessionA");
  const [localUser, setLocalUser] = useState(new UserModel());
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [subscribers, setSubscribers] = useState([]);
  const [publisher, setPublisher] = useState(
    OV.current.initPublisher(undefined, {
      audioSource: undefined,
      videoSource: undefined,
      publishAudio: isMicOn,
      publishVideo: isCameraOn,
      resolution: "640x480",
      frameRate: 30,
      insertMode: "REPLACE",
    })
  );
  const [showVideoContainer, setShowVideoContainer] = useState(false);
  const myUserName = useRef("OpenVidu_User" + Math.floor(Math.random() * 100));
  const videoContainerRef = useRef();
  const mainContainerRef = useRef();
  const session = useRef(OV.current.initSession());

  const init = async () => {
    setIsMicOn(localUser.isAudioActive());
    setIsCameraOn(localUser.isVideoActive());

    session.current
      .on("streamCreated", handleSessionStreamCreated)
      .on("signal:userChanged", handleSessionSignalUserChanged)
      .on("streamDestroyed", handleSessionStreamDestroy);

    await connect();

    setShowVideoContainer(true);
  };

  useEffect(() => {
    init();

    window.addEventListener("beforeunload", leaveSession);
    return () => {
      window.removeEventListener("beforeunload", leaveSession);
    };
  }, []);

  useEffect(() => {
    if (localUser && localUser.connectionId.length) {
      connectWebCam();
    }
  }, [localUser, subscribers]);

  useEffect(() => {
    if (localUser.connectionId.length) {
      setLocalUser((prevLocalUser) => {
        prevLocalUser.setVideoActive(isCameraOn);
        prevLocalUser.setAudioActive(isMicOn);
        return prevLocalUser;
      });

      localUser.streamManager.publishAudio(isMicOn);
      localUser.streamManager.publishVideo(isCameraOn);
      sendSignalUserChanged({
        isAudioActive: isMicOn,
        isVideoActive: isCameraOn,
      });
    }
  }, [isCameraOn, isMicOn]);

  const handleSessionStreamCreated = ({ stream }) => {
    const subscriber = session.current.subscribe(stream, undefined);
    const newUser = new UserModel();

    newUser.setStreamManager(subscriber);
    newUser.setConnectionId(stream.connection.connectionId);
    newUser.setType("remote");

    setSubscribers((prevSubscribers) => [...prevSubscribers, newUser]);
  };
  const handleSessionSignalUserChanged = (event) => {
    setSubscribers((prevSubscribers) => {
      prevSubscribers.forEach((subscriber) => {
        if (subscriber.getConnectionId() === event.from.connectionId) {
          const data = JSON.parse(event.data);

          if (data.isAudioActive !== subscriber.getAudioActive()) {
            subscriber.setAudioActive(data.isAudioActive);
          }
          if (data.isVideoActive !== subscriber.getVideoActive()) {
            subscriber.setVideoActive(data.isVideoActive);
          }
        }
      });
      return prevSubscribers;
    });
  };
  const handleSessionStreamDestroy = (event) => {
    deleteSubscriber(event.stream);
    event.preventDefault();
  };

  const getToken = async () => {
    const meetingUrl = uuidv4();

    const host =
      process.env.NODE_ENV && false === "development"
        ? "http://localhost:4000"
        : "http://pixie.neetos.com";

    try {
      const response = await fetch(`${host}/token?meetingUrl=${meetingUrl}`);
      const { token } = await response.json();
      return token;
    } catch (e) {
      throw e;
    }
  };

  const connect = async () => {
    const myToken = await getToken();
    try {
      await session.current.connect(myToken, {
        clientData: myUserName.current,
      });
      await connectWebCam();
    } catch (e) {
      alert("There was an error connecting to the session:", e.message);
      throw e;
    }
  };

  const connectWebCam = async () => {
    session.current.unpublish(publisher);
    setPublisher(
      OV.current.initPublisher(undefined, {
        audioSource: undefined,
        videoSource: undefined,
        publishAudio: isMicOn,
        publishVideo: isCameraOn,
        resolution: "640x480",
        frameRate: 30,
        insertMode: "REPLACE",
      })
    );

    try {
      /* **Important**
      Need a check for if the camera/mic is on, this promise doesn't seem to resolve when camera & mic permissions are blocked */
      await session.current.publish(publisher);
    } catch (e) {
      throw e;
    }

    setLocalUser((prevLocalUser) => {
      prevLocalUser.setConnectionId(session.current.connection.connectionId);
      prevLocalUser.setStreamManager(publisher);
      return prevLocalUser;
    });
  };

  const sendSignalUserChanged = async (data) => {
    const signalOptions = {
      data: JSON.stringify(data),
      type: "userChanged",
    };
    await session.current.signal(signalOptions);
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

  const toggleFullscreen = () => {
    const document = window.document;
    if (
      !document.fullscreenElement &&
      !document.mozFullScreenElement &&
      !document.webkitFullscreenElement &&
      !document.msFullscreenElement
    ) {
      if (mainContainerRef.current.requestFullscreen) {
        mainContainerRef.current.requestFullscreen();
      } else if (mainContainerRef.current.msRequestFullscreen) {
        mainContainerRef.current.msRequestFullscreen();
      } else if (mainContainerRef.current.mozRequestFullScreen) {
        mainContainerRef.current.mozRequestFullScreen();
      } else if (mainContainerRef.current.webkitRequestFullscreen) {
        mainContainerRef.current.webkitRequestFullscreen();
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

  const camStatusChanged = () => {
    setIsCameraOn((prev) => !prev);
  };

  const micStatusChanged = () => {
    setIsMicOn((prev) => !prev);
  };

  const leaveSession = () => {
    session && session.current.disconnect();
    // Clear Properties
    // OV.current = null;
    // session.current = undefined;
    setSubscribers([]);
    setMySessionId("SessionA");
    setLocalUser(undefined);
  };

  return (
    <div className="container" id="main-container" ref={mainContainerRef}>
      {localUser && (
        <>
          <ToolbarComponent
            sessionId={mySessionId}
            user={localUser}
            camStatusChanged={camStatusChanged}
            micStatusChanged={micStatusChanged}
            toggleFullscreen={toggleFullscreen}
            leaveSession={leaveSession}
            isMicOn={isMicOn}
            isCameraOn={isCameraOn}
          />
          {showVideoContainer && (
            <div
              id="video-container"
              className="bounds"
              ref={videoContainerRef}
            >
              <div className="publisher" id="localUser">
                <StreamComponent
                  user={localUser}
                  isMicOn={isMicOn}
                  isCameraOn={isCameraOn}
                />
              </div>
              {subscribers.map((sub, i) => (
                <div key={i} className="subscribers" id="remoteUsers">
                  <StreamComponent
                    user={sub}
                    streamId={sub.streamManager.stream.streamId}
                  />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
