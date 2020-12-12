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
  makeStyles,
  colors,
} from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import AddIcon from "@material-ui/icons/Add";

export default function PinVideoDialog({ onClose, subscribers, open }) {
  const [pinnedVideos, setPinnedVideos] = useState(subscribers);
  const subscribersCt = Object.keys(subscribers).length;

  // Update pinned videos in videoroom
  const syncPinnedVideos = () => {
    onClose(pinnedVideos); // on close hierarchy pinvideodialog => toolbar => videoroom
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

  // TODO: Add a function that takes in a subscriber and pins their video

  return (
    <Dialog
      onClose={syncPinnedVideos}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">Pin Videos To Screen</DialogTitle>
      <List>
        {subscribersCt &&
          Object.entries(subscribers).map(([key, value]) => (
            <ListItem key={key}>
              <ListItemAvatar>
                <Avatar>
                  <PersonIcon />
                </Avatar>
                <div>{`User: ${key}`}</div>
              </ListItemAvatar>
              {
                (console.log("======PINVIDEOSDIALOG subscriber=======", key),
                console.log("==================isPinned==", value.isPinned))
              }
              <Checkbox
                checked={value.isPinned}
                onChange={() => handleCheck(key, value.isPinned)} // index subscriber by streamId in videroom
                name={value.stream.streamId}
              />
              {console.log("Dialog")}
            </ListItem>
          ))}

        <ListItem autoFocus button onClick={syncPinnedVideos}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Update Pins" />
        </ListItem>
      </List>
    </Dialog>
  );
}
