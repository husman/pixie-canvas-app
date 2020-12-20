import React, { useRef } from "react";
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
  const pinnedSubscriberVideos = useRef(new Set());
  const subscribersCt = Object.keys(subscribers).length;

  /* Update pinned videos in videoroom */
  const handlePinnedSubscribersVideoroom = () => {
    onClose(pinnedSubscriberVideos.current); // update pinned videos and close dialog box
  };

  const handleCancelPinnedSubscribers = () => {
    onCancel(); // close dialog box and do nothing
  };

  const handlePinnedSubscribersList = (key) => {
    if (pinnedSubscriberVideos.current.has(key)) {
      pinnedSubscriberVideos.current.delete(key);
    } else {
      pinnedSubscriberVideos.current.add(key);
    }
    console.log(
      "UPDATE PINNED SUBSCRIBER LIST",
      pinnedSubscriberVideos.current
    );
  };

  console.log("******************PINNED");
  return (
    <Dialog
      onClose={handleCancelPinnedSubscribers}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Pin Videos To Screen</DialogTitle>
      <List>
        {subscribersCt &&
          Object.entries(subscribers).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemAvatar key={key}>
                <Avatar variant="square" key={key}>
                  {value.isCameraOn ? (
                    <OvVideo
                      // TODO: Fix display in dialog stream
                      className="dialog-stream"
                      stream={value.stream}
                      isCameraOn={value.isCameraOn}
                    />
                  ) : (
                    <PersonIcon key={key} />
                  )}
                </Avatar>
                <div>{`User: ${key}`}</div>
              </ListItemAvatar>
              <Checkbox
                onChange={() => {
                  handlePinnedSubscribersList(key);
                }}
                name={key}
              />
            </ListItem>
          ))}
        <Button onClick={handlePinnedSubscribersVideoroom}>Pin Videos</Button>
      </List>
    </Dialog>
  );
}
