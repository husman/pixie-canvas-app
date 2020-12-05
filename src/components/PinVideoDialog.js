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

const subscribers_list = [
  { name: "Bob", video: true },
  { name: "Mary", video: false },
  { name: "Joel", video: true },
];

const useStyles = makeStyles({
  avatar: {
    backgroundColor: colors.blue[100],
    color: colors.blue[600],
  },
});

export default function PinVideoDialog(props) {
  const classes = useStyles();
  const { onClose, selectedValue, open } = props;
  const [subscribers, setSubscribers] = useState(subscribers_list);

  const handleClose = () => {
    console.log("Selected Value", selectedValue);
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const handleCheck = (index, value) => {
    const newPins = [...subscribers];
    newPins[index] = { name: value.name, video: !value.video };
    setSubscribers(newPins);
  };

  // TODO: Add a function that takes in a subscriber and pins their video

  return (
    console.log("RENDER MY SUBSCRIBERS", subscribers),
    (
      <Dialog
        onClose={handleClose}
        aria-labelledby="simple-dialog-title"
        open={open}
      >
        <DialogTitle id="simple-dialog-title">Pin Videos To Screen</DialogTitle>
        <List>
          {subscribers &&
            subscribers.map((user, index) => (
              <ListItem
                button
                onClick={() => handleListItemClick(user.name)}
                key={index}
              >
                <ListItemAvatar>
                  <Avatar className={classes.avatar}>
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

          <ListItem
            autoFocus
            button
            onClick={() => handleListItemClick("Update Pins")}
          >
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
