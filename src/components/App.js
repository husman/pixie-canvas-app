import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from 'react-router-dom';
import VideoRoom from './videoroom/VideoRoom';
import Canvas from './Canvas';

export default function App() {
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
          <VideoRoom />
        </Route>
        <Route path="/canvas">
          <Canvas />
        </Route>
      </Switch>
    </Router>
  );
}