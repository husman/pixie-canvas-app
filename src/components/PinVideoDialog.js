import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  Checkbox,
  Button,
} from "@material-ui/core";
import OvVideo from "./OvVideo";
import PersonIcon from "@material-ui/icons/Person";

export default function PinVideoDialog({
  onCancel,
  onClose,
  subscribers,
  open,
}) {
  const [pinnedVideos, setPinnedVideos] = useState(subscribers);
  const subscribersCt = Object.keys(subscribers).length;

  /* Update pinned videos in videoroom */
  const syncPinnedVideos = (syncVideos) => {
    if (syncVideos) {
      onClose(pinnedVideos);
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
                <Avatar variant="square">
                  {value.isCameraOn ? (
                    <OvVideo
                      // TODO: Fix display in dialog stream
                      className="dialog-stream"
                      stream={value.stream}
                      isCameraOn={value.isCameraOn}
                    />
                  ) : (
                    <PersonIcon />
                  )}
                </Avatar>
                <div>{`User: ${key}`}</div>
              </ListItemAvatar>
              <Checkbox
                checked={value.isPinned}
                onChange={() => handleCheck(key, value.isPinned)}
                name={value.stream.streamId}
              />
            </ListItem>
          ))}
        <Button onClick={() => syncPinnedVideos(true)}>Pin Videos</Button>
      </List>
    </Dialog>
  );
}
