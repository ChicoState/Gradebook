import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from './Signup.js'
import Login from './Login.js'
import Teacher from './Teach.js'
import Account from './Account.js'
import './App.css';

import { isLoggedIn } from './auth'

class App extends React.Component {

  constructor(props) {
    super(props)
    console.log(isLoggedIn())
    this.state = {
      loggedIn: isLoggedIn()
    }
  }

  render() { 
    return (
      <Router> 
        <div className="App">

          <nav className="mb-3 navbar navbar-dark bg-dark">
            <div className="navbar-brand">
              <Link to="/"> GradeBook </Link>
            </div> 
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              { !this.state.loggedIn &&  
                <div> 
                  <li className="nav-item">
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login">Log In</Link>
                  </li>
                </div>
              }
              { this.state.loggedIn && 
                <div> 
                  <li className="nav-item">
                    <Link to="/account">Account</Link>
                  </li>
                </div>
              }
            </ul>
          </nav> 

          <div className="container">
            <div className="row">
              <Route exact path="/" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/teacher" component={Teacher} />
              <Route path="/account" component={Account} />
            </div>
          </div>

        </div>

      </Router>
    )
  }
}

const Home = () => {
  return (
    <div> Hello world! </div>
  )
}

export default App;
