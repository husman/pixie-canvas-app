import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Button,
  ListItemText,
} from "@material-ui/core";
import OvVideo from "./OvVideo";
import { DEFAULT_MAX_VIDEOS } from "./constants/video";

export default function PinVideoDialog({
  onCancel,
  onClose,
  subscribers,
  currentPinnedVideos,
  open,
}) {
  const [proposedPinnedVideos, setPPinnedVideos] = useState(
    currentPinnedVideos
  );
  const subscribersCt = Object.keys(subscribers).length;
  const handlePinnedSubscribersVideoroom = () => {
    onClose(proposedPinnedVideos); // update pinned videos and close dialog box
  };

  const handleCancelPinnedSubscribers = () => {
    onCancel(); // close dialog box and do nothing
  };

  /* Manage Subscribers to be Pinned on the Screen */
  const handlePinnedSubscribersList = (key) => {
    if (
      !proposedPinnedVideos.includes(key) &&
      proposedPinnedVideos.length + 1 <= DEFAULT_MAX_VIDEOS
    ) {
      setPPinnedVideos((prev) => {
        prev.push(key);
        return [...prev];
      });
    } else {
      setPPinnedVideos((prev) => prev.filter((item) => item !== key));
    }
  };

  return (
    <Dialog
      onClose={handleCancelPinnedSubscribers}
      aria-labelledby="simple-dialog-title"
      className="pin-video-dialog"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Pin up to 6 videos</DialogTitle>
      <List>
        {subscribersCt > 0 ? (
          Object.entries(subscribers).map(([key, value]) => (
            <ListItem key={key}>
              <OvVideo
                stream={value.stream}
                isCameraOn={value.isCameraOn}
                isIcon={true}
              />
              <div>{`User: ${key}`}</div>
              <Checkbox
                onChange={() => {
                  handlePinnedSubscribersList(key);
                }}
                checked={proposedPinnedVideos.includes(key)}
                name={key}
              />
            </ListItem>
          ))
        ) : (
          <ListItemText>You are the only one in this meeting</ListItemText>
        )}
        <Button
          className="pin-dialog"
          onClick={handlePinnedSubscribersVideoroom}
          variant="outlined"
          color="secondary"
        >
          Pin Videos
        </Button>
      </List>
    </Dialog>
  );
}
