import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import VideoRoom from "./VideoRoom";
import JoinMeetingForm from "./JoinMeetingForm";
import Canvas from "./Canvas";

export default function App() {
  const [sessionId, setSessionId] = useState("");
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <h3>Pixie Canvas Development</h3>

          <ul>
            <li>
              <Link to="/video">Video</Link>
            </li>
            <li>
              <Link to="/canvas">Canvas</Link>
            </li>
          </ul>
        </Route>
        <Route path="/video">
          {!sessionId && (
            <JoinMeetingForm
              onSubmit={(newSessionId) => {
                setSessionId(newSessionId);
              }}
            />
          )}
          {sessionId && <VideoRoom sessionId={sessionId} />}
        </Route>
        <Route path="/canvas">
          <Canvas />
        </Route>
      </Switch>
    </Router>
  );
}
