import React, { useRef, useState } from "react";
import OvVideo from "./OvVideo";
import { DEFAULT_MAX_VIDEOS } from "./constants/video";
import {
  PIN_DIALOG_TITLE,
  PIN_DIALOG_EMPTY_MEETING,
  PIN_VIDEOS_BUTTON,
} from "./constants/translation";
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
import PersonIcon from "@material-ui/icons/Person";

export default function PinVideoDialog({
  onCancel,
  onClose,
  subscribers,
  currentPinnedVideos,
  open,
}) {
  const [proposedPinnedVideos, setProposedPinnedVideos] = useState(
    currentPinnedVideos
  );
  const subscribersCt = Object.keys(subscribers).length;
  const handlePinnedSubscribersVideoroom = () => {
    onClose(
      proposedPinnedVideos
    ); /* Update pinned videos and close dialog box */
  };

  const handleCancelPinnedSubscribers = () => {
    onCancel(); /* close dialog box and do nothing */
  };

  /* Manage Subscribers to be Pinned on the Screen */
  const handlePinnedSubscribersList = (key) => {
    /* Includes user stream video */
    if (
      !proposedPinnedVideos.includes(key) &&
      proposedPinnedVideos.length + 1 < DEFAULT_MAX_VIDEOS
    ) {
      setProposedPinnedVideos((prev) => {
        prev.push(key);
        return [...prev];
      });
    } else if (proposedPinnedVideos.includes(key)) {
      setProposedPinnedVideos((prev) =>
        prev.filter((subscriberId) => subscriberId !== key)
      );
    }
  };

  return (
    <Dialog onClose={handleCancelPinnedSubscribers} open={open}>
      <DialogTitle>{PIN_DIALOG_TITLE}</DialogTitle>
      <List>
        {subscribersCt > 0 ? (
          Object.entries(subscribers).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar variant="square" className="dialog-video-icon">
                  {value.isCameraOn ? (
                    <OvVideo
                      stream={value.stream}
                      isCameraOn={value.isCameraOn}
                    />
                  ) : (
                    <PersonIcon />
                  )}
                </Avatar>
              </ListItemAvatar>
              <div className="dialog-username">{`USER: ${key}`}</div>
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
          <ListItemText>{PIN_DIALOG_EMPTY_MEETING}</ListItemText>
        )}
        <Button
          className="dialog-submit"
          onClick={handlePinnedSubscribersVideoroom}
          variant="outlined"
          color="secondary"
        >
          {PIN_VIDEOS_BUTTON}
        </Button>
      </List>
    </Dialog>
  );
}
