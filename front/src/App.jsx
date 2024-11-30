import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./pages/Home"
import Chat from "./pages/Chat";


function App() {
  return (
    <Router>
      <div className="App">
          <Route path="/" exact component={Home} />
          <Route path="/chat" exact component={Chat} />
      </div>
    </Router>
  );
}

export default App;
