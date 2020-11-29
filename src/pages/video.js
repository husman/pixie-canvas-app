import React, { useEffect, useState } from "react";
import VideoRoom from "../components/VideoRoom";
import JoinMeetingForm from "../components/JoinMeetingForm";
import OvContext from "../context/openVidu";

export default function Video() {
  const [sessionId, setSessionId] = useState("");
  const [openVidu, setOpenVidu] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("openvidu-browser").then((ov) => setOpenVidu(new ov.OpenVidu()));
    }
  }, []);

  if (!openVidu) {
    return <div>Loading...</div>;
  }

  return (
    <OvContext.Provider value={openVidu}>
      {!sessionId ? (
        <JoinMeetingForm onSubmit={setSessionId} />
      ) : (
        <VideoRoom sessionId={sessionId} />
      )}
    </OvContext.Provider>
  );
}
