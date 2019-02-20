import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from './Signup.js'
import Login from './Login.js'
import './App.css';

const App = () => (
  <Router> 
    <div className="App">

      <nav className="mb-3 navbar navbar-dark bg-dark">
        <div className="navbar-brand"> GradeBook </div> 
        <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
          <li className="nav-item">
            <Link to="/signup">Sign Up</Link>
          </li>
          <li className="nav-item">
            <Link to="/login">Log In</Link>
          </li>
        </ul>
      </nav> 

      <div className="container">
        <div className="row">
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
        </div>
      </div>

    </div>

  </Router>
)

const Home = () => {
  return (
    <div> Hello world! </div>
  )
}

export default App;
