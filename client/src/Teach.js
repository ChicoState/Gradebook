import React, { Component } from 'react'
import axios from 'axios'
import './AuthForm.css'

class Teacher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      t_name: "Mark Boyko",
      t_id: 0,
      c_name: 0,
      c_id: 0
    }

    // this.handleInputChange = this.handleInputChange.bind(this)
    // this.handleSubmit = this.handleSubmit.bind(this)
  }

  render() {
    return (
     <h1>Welcome {this.state.t_name}</h1>
    );
  }
}

export default Teacher
