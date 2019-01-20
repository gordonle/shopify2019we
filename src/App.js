import React from 'react';
import { Route } from "react-router-dom";
import HomePage from "./scenes/HomePage";

class App extends React.Component {
  render() {
    return (
      <div style={{ padding: 0 }}>
          <Route exact path="/" component={HomePage} />
      </div>
    );
  }
}

export default App;
