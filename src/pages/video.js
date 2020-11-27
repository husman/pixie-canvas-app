import React, { useEffect, useState } from 'react';
import VideoRoom from '../components/videoroom/VideoRoom';
import OvContext from '../context/openVidu';

export default function Video() {
  const [openVidu, setOpenVidu] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('openvidu-browser').then(ov => setOpenVidu(new ov.OpenVidu()));
    }
  }, []);

  if (!openVidu) {
    return <div>Loading...</div>;
  }

  return (
    <OvContext.Provider value={openVidu}>
      <VideoRoom />
    </OvContext.Provider>
  );
}