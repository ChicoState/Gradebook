import React, { Component } from 'react'
import { Redirect } from 'react-router'
import { getHeader, isLoggedIn } from '../auth'
import axios from 'axios'

class Classes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "", 
      custom_id: "", 
      classes: []
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.createClass = this.createClass.bind(this)
  }

  async componentDidMount() {
    let classes = await axios.get('teacher/classes', { headers: getHeader() })
    this.setState({ classes: classes.data })  
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async createClass() {
    let res = await axios.post('class', {
      name: this.state.name, custom_id: this.state.custom_id
    }, { headers: getHeader() })
    if (res.data._id) {
      let updated = this.state.classes.concat(res.data)
      this.setState({ classes: updated })
    }
  }

  render () {
    return (
      <div>  
        <input 
          className="form-control" 
          name="name"
          type="text" 
          placeholder="Class Name"
          value={this.state.name} 
          onChange={this.handleInputChange} 
        />
        <input 
          className="form-control" 
          name="custom_id"
          type="text" 
          placeholder="Custom Identifier (E.G. CSCI101)"
          value={this.state.custom_id} 
          onChange={this.handleInputChange} 
        />
        <div className="btn btn-primary" onClick={this.createClass}> Create </div>

        <h2 className="mt-2 mb-2"> Classes </h2> 
        <div className="classes"> 
          { this.state.classes.map((c) => {
            return <div key={c._id}>{ c.name } : { c.custom_id }</div>
          })}
        </div>

      </div>
    )
  }
}

export default Classes