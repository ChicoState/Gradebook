import React, { Component } from 'react'
import axios from 'axios'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '', 
      email: '', 
      password: '',
      student: true
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
    this.state.message = "Successfully signed up"
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input className="form-control" type="text" name="name" value={this.state.name} onChange={this.handleInputChange} />
        </label>

        <label>
          Email:
          <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
        </label>

        <label>
          password:
          <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
        </label>

        <input type="submit" value="Sign Up" />
        { this.state.message }
      </form>
    );
  }
}

export default Login