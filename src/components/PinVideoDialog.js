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
} from "@material-ui/core";
import OvVideo from "./OvVideo";
import PersonIcon from "@material-ui/icons/Person";

export default function PinVideoDialog({
  onCancel,
  onClose,
  subscribers,
  pinnedVideos: currentPinnedVideos,
  open,
}) {
  // const proposedPinnedVideos = useRef(new Set(currentPinnedVideos));
  const [pPinnedVideos, setPPinnedVideos] = useState(currentPinnedVideos);
  const subscribersCt = Object.keys(subscribers).length;

  /* Update pinned videos in videoroom */
  const handlePinnedSubscribersVideoroom = () => {
    console.log("Submitting with info", pPinnedVideos);
    onClose(pPinnedVideos); // update pinned videos and close dialog box
  };

  const handleCancelPinnedSubscribers = () => {
    onCancel(); // close dialog box and do nothing
  };

  /* Manage Subscribers to be Pinned on the Screen */
  const handlePinnedSubscribersList = (key) => {
    if (!pPinnedVideos.includes(key)) {
      setPPinnedVideos((prev) => {
        prev.push(key);
        return [...prev];
      });
    } else {
      setPPinnedVideos((prev) => prev.filter((item) => item !== key));
      console.log("delete");
    }
    console.log("Pins have changed", pPinnedVideos);
  };

  /* TODO: Add Constraint for 6 Videos */
  return (
    console.log("subscribers", pPinnedVideos),
    (
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
                    <OvVideo
                      // TODO: Fix display in dialog stream
                      className="dialog-stream"
                      stream={value.stream}
                      isCameraOn={value.isCameraOn} /* ListItemText */
                    />
                  </Avatar>
                  <div>{`User: ${key}`}</div>
                </ListItemAvatar>
                <Checkbox
                  onChange={() => {
                    handlePinnedSubscribersList(key);
                  }}
                  checked={pPinnedVideos.includes(key)}
                  name={key}
                />
              </ListItem>
            ))}
          <Button onClick={handlePinnedSubscribersVideoroom}>Pin Videos</Button>
        </List>
      </Dialog>
    )
  );
}
