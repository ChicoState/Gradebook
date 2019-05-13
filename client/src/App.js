import React from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import axios from 'axios'

import Signup from './Signup.js'
import Login from './Login.js'

import StudentCourses from './student/Courses.js'
import StudentCourse from './student/Course.js'

import TeacherCourses from './teacher/Courses.js'
import TeacherCourse from './teacher/Course.js'
import TeacherGrades from './teacher/Grades.js'

import Rubric from './user/Rubric.js'

import './App.css';

import { isLoggedIn, logout, getHeader } from './auth'

function PrivateRoute ({component: Component, ...rest}) {
  return (
    <Route
      {...rest}
      render={(props) => isLoggedIn() === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}

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
        <div className="App container">

          <nav className="navbar pb-0">
            <div className="navbar-brand">
              { !isLoggedIn() && 
                <Link to="/"> GradeBook </Link>
              }
              { isLoggedIn() && !this.state.user.student && 
                <Link to="/teacher/courses"> GradeBook </Link>
              } 
              { isLoggedIn() && this.state.user.student && 
                <Link to="/student/courses"> GradeBook </Link>
              }       
            </div> 
            <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
              { !isLoggedIn() &&  
                <div> 
                  <li className="nav-item">
                    <Link to="/signup">Sign Up</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/login">Log In</Link>
                  </li>
                </div>
              }
              { isLoggedIn() && 
                <div> 
                  <li className="nav-item mr-0 logout">
                    <a href="#" onClick={logout}>Log Out</a>
                  </li>
                </div>
              }
            </ul>
          </nav> 

          <div className="container">

              <Route exact path="/" component={Home} />
              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />

              <PrivateRoute path='/student/courses' component={StudentCourses} />
              <PrivateRoute path='/student/course/:custom_id' component={StudentCourse} />

              <PrivateRoute path='/teacher/courses' component={TeacherCourses} />
              <PrivateRoute path='/teacher/course/:custom_id' component={TeacherCourse} />
              <PrivateRoute path='/teacher/assignment/:assignment_id' component={TeacherGrades} />
      
              <Route path="/experimental/rubric" component={Rubric} />

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
