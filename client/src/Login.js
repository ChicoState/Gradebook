import React, { Component } from 'react'
import { Redirect } from 'react-router'
import axios from 'axios'
import './AuthForm.css'
import { setToken, isLoggedIn, getUser } from './auth'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '', 
      password: '', 
      message: "",
      user: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  async componentDidMount() {
    let user = await getUser()
    this.setState({ user: user })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault()
    let res  = await axios.post('http://localhost:3993/api/login', this.state)
    let message = res.data.auth ? "Logged in!" : "Try again!"
    if (res.data.auth) { 
      setToken(res.data.token)
      let route = res.data.student ? '/student/courses' : '/teacher/courses'
      this.props.history.push(route)
      // window.location.reload()
    }
    this.setState({ message: message })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2> Log In </h2>

        <label> Email: </label>
        <input 
          className="form-control" 
          type="text" 
          name="email" 
          placeholder="john@appleseed.com"
          value={this.state.email} 
          onChange={this.handleInputChange} 
        />

        <label> Password: </label>
        <input 
          className="form-control" 
          type="password" 
          name="password" 
          placeholder="Secret"
          value={this.state.password} 
          onChange={this.handleInputChange} 
        />

        <input 
          type="submit" 
          className="btn btn-primary mb-2" 
          value="Log In" 
        />
        { this.state.message && 
          <div className="alert alert-info">
            { this.state.message }
          </div>
        }
      </form>
    );
  }
}

export default Login