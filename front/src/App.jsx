import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home"
import Chat from "./pages/Chat";


function App() {
  return (
    <Router>
      <div>
          <Route path="/" exact component={Home} />
          <Route path="/chat" exact component={Chat} />
      </div>
    </Router>
  );
}

export default App;
