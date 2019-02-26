import React, { Component } from 'react'
import { Route, Redirect } from 'react-router'
import axios from 'axios'
import { getHeader, isLoggedIn } from './auth'

class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
  }

  async componentDidMount() {
    let user = await axios.get('http://localhost:3993/api/me', { headers: getHeader() })
    this.setState({ user: user.data })
  }

  render () {
    return !isLoggedIn() ? <Redirect to="/login" /> : 
    (
      <div> 
        <div> {this.state.user.name} </div>
        <div> Your email: {this.state.user.email} </div>
        <div> You're a { this.state.user.student ? "student" : "teacher" } </div>
      </div>
    )
  }
}

export default Account