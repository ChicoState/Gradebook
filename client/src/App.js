import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Signup from './Signup.js'
import Login from './Login.js'
import Student from './student.js'
import Classes from './teacher/Classes.js'
import Assignments from './teacher/Assignments.js'
import Grades from './teacher/Grades.js'
import Account from './Account.js'
import './App.css';

import { isLoggedIn, logout } from './auth'

class App extends React.Component {

  constructor(props) {
    super(props)
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
              <Link to="/"> GradeBook <i className="fas fa-book-open"></i></Link>
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
                  <li className="nav-item">
                    <a href="#" onClick={logout}>Log Out</a>
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
              <Route path="/teacher/classes" component={Classes} />
              <Route path="/teacher/class/:custom_id" component={Assignments} />
	      <Route exact path="/student" component={Student} />
              <Route path="/student/classes" component={Classes} />
              <Route path="/teacher/assignment/:assignment_id" component={Grades} />
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
