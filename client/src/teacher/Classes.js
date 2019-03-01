import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getHeader, isLoggedIn } from '../auth'
import axios from 'axios'
import './Classes.css';

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
        <h2 className="mt-2 mb-2"> Classes </h2> 
        <div className="classes container mb-2"> 
          <div className="header row py-1">
            <div className="col"> Name </div> 
            <div className="col"> Identifier </div> 
          </div>
          { this.state.classes.map((c) => {
            return (
              <div className="class row py-2" key={c._id}>
                    <Link to={"/teacher/assignments/" + c.custom_id.toString()} ><div className="col"> { c.name } </div></Link>
                <div className="col"> { c.custom_id } </div> 
              </div>
            )
          })}

          <div className="class row py-2">
            <input 
              className="form-control col" 
              name="name"
              type="text" 
              placeholder="New class..."
              value={this.state.name} 
              onChange={this.handleInputChange} 
            />
            <input 
              className="form-control col" 
              name="custom_id"
              type="text" 
              placeholder="E.G. CSCI101"
              value={this.state.custom_id} 
              onChange={this.handleInputChange} 
            />
          </div> 

        </div>

        <div className="btn btn-primary" onClick={this.createClass}> Create </div>

      </div>
    )
  }
}

export default Classes
