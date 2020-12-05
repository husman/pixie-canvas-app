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
  // const [subscribers, setSubscribers] = useState(subscriber_list);
  const [pinnedVideos, setPinnedVideos] = useState(subscriber_list);

  const handleUpdatePins = () => {
    // console.log("Handle Update Pins");
    // setSubscribers(pinVideos);
    // console.log("NEW SUBSCRIBERS", subscribers);
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
            pinnedVideos.map((user, index) => (
              <ListItem key={index}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <Checkbox
                  checked={user.video}
                  onChange={() => handleCheck(index, user)}
                  name={user.name}
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
