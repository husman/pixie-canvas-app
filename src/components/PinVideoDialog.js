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

export default function PinVideoDialog(props) {
  const { onClose, subscriber_list, open } = props;
  const [pinnedVideos, setPinnedVideos] = useState(subscriber_list);
  const subscribersCt = Object.keys(subscriber_list).length;

  const handleUpdatePins = () => {
    onClose(pinnedVideos);
  };

  const handleCheck = async (index, value) => {
    const newPins = [...pinnedVideos];
    newPins[index] = { name: value.name, video: !value.video };
    setPinnedVideos(newPins);
  };

  // TODO: Add a function that takes in a subscriber and pins their video

  return (
    console.log("Pinned Videos", pinnedVideos),
    (
      <Dialog
        onClose={handleUpdatePins}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Pin Videos To Screen</DialogTitle>
        <List>
          {pinnedVideos &&
            subscribersCt &&
            Object.entries(pinnedVideos).map(([key, value]) => (
              <ListItem key={key}>
                {console.log("PINVIDEOSDIALOG subscribers", value)}
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <Checkbox
                  // checked={user.isPinned}
                  onChange={() => handleCheck(index, value.stream.streamId)}
                  name={value.stream.streamId}
                />
              </ListItem>
            ))}

          <ListItem autoFocus button onClick={handleUpdatePins}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Update Pins" />
          </ListItem>
        </List>
      </Dialog>
    )
  );
}
