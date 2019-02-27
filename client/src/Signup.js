import React, { Component } from 'react'
import axios from 'axios'
import './AuthForm.css'
import { Redirect } from 'react-router'

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      email: '', 
      password: '',
      student: true, 
      message: "", 
      signedUp: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
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
    let res  = await axios.post('http://localhost:3993/api/user', this.state)
    if (res.data.auth) this.setState({ signedUp: true })
    else this.setState({ message: "Something went wrong" })
  }

  render() {
    if (this.state.signedUp) return (<Redirect to="/account" />)
    return (
      <form onSubmit={this.handleSubmit}>
        <h2> Sign Up </h2>
        <label> Name: </label>
        <input 
          className="form-control" 
          type="text" 
          name="name" 
          placeholder="John Appleseed"
          value={this.state.name} 
          onChange={this.handleInputChange} 
        />

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

        <div className="d-flex align-items-center mb-2">
          <label className="mr-2 mb-0">Are you a student?</label>
          <input 
            type="checkbox"
            value={this.state.student}
          />
        </div>

        <input 
          type="submit" 
          className="btn btn-primary mb-2" 
          value="Sign Up" 
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

export default Signup