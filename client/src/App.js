import React from 'react'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import axios from 'axios'

import Signup from './Signup.js'
import Login from './Login.js'

import StudentCourses from './student/Courses.js'

import TeacherCourses from './teacher/Courses.js'
import TeacherCourse from './teacher/Course.js'
import TeacherGrades from './teacher/Grades.js'

import './App.css';

import { isLoggedIn, logout, getHeader } from './auth'

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      loggedIn: isLoggedIn(), 
      user: {}
    }
  }

  async componentDidMount() {
    let user = await axios.get('/user/me', { headers: getHeader() })
    this.setState({ user: user })
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
              { this.state.loggedIn && !this.state.user.student  && 
                <div> 
                  <li className="nav-item">
                    <Link to="/teacher/courses">Courses</Link>
                  </li>
                </div> 
              }
              { this.state.loggedIn && 
                <div> 
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

              <Route path="/student/courses" component={StudentCourses} />
              <Route path="/teacher/courses" component={TeacherCourses} />

              <Route path="/teacher/course/:custom_id" component={TeacherCourse} />

              <Route path="/teacher/assignment/:assignment_id" component={TeacherGrades} />

            </div>
          </div>

        </div>

      </Router>
    )
  }
}

const Home = () => {
  return (
    <div> 
      <h1> Welcome to GradeBook. </h1>
      <div className="mb-3"> Simple, easy to use grades for students and teachers. </div>
      <Link to="/login" className="btn btn-light mr-3"> Log In </Link>
      <Link to="/signup" className="btn btn-primary"> Sign Up </Link>
    </div>
  )
}

export default App;
