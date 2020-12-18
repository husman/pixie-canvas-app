import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Checkbox,
  Button,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";
import OvVideo from "./OvVideo";

export default function PinVideoDialog({
  onCancel,
  onClose,
  subscribers,
  open,
}) {
  const [pinnedVideos, setPinnedVideos] = useState(subscribers);
  const subscribersCt = Object.keys(subscribers).length;

  // Update pinned videos in videoroom
  const syncPinnedVideos = (syncVideos) => {
    if (syncVideos) {
      onClose(pinnedVideos); // on close hierarchy pinvideodialog => toolbar => videoroom
    } else {
      onCancel();
    }
  };

  const handleCheck = async (subscriberStreamId, isPinned) => {
    const subscriber = pinnedVideos[subscriberStreamId];
    const pinnedSubscriber = {
      ...subscriber,
      isPinned: !isPinned,
    };
    setPinnedVideos((prevSubscribers) => {
      prevSubscribers[subscriberStreamId] = pinnedSubscriber;
      return { ...prevSubscribers };
    });
  };

  // TODO: Handle checking multiple check boxes at once

  return (
    <Dialog
      onClose={() => syncPinnedVideos(false)}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Pin Videos To Screen</DialogTitle>
      <List>
        {subscribersCt &&
          Object.entries(pinnedVideos).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar>
                  {/* <PersonIcon /> */}
                  <OvVideo
                    stream={value.stream}
                    isCameraOn={value.isCameraOn}
                  />
                </Avatar>
                <div>{`User: ${key}`}</div>
              </ListItemAvatar>
              <Checkbox
                checked={value.isPinned}
                onChange={() => handleCheck(key, value.isPinned)}
                // index subscriber by streamId in videroom
                name={value.stream.streamId}
              />
            </ListItem>
          ))}
        <Button onClick={() => syncPinnedVideos(true)}>Pin Videos</Button>
      </List>
    </Dialog>
  );
}
