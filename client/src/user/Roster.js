import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import './Classes.css'; 

class Assignments extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        id: "",
        roster: [], 
        classData: {}
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.addStudent = this.addStudent.bind(this)
    }

    async componentDidMount() {
      const classId = this.props.match.params.custom_id
	let c = await axios.get('class/' + classId, { headers: getHeader() })
      this.setState({ classData: c.data })
      
      const roster = await axios.get(`user/roster/${classId}`, { headers: getHeader() })
      this.setState({ roster: roster.data })
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.value;

      this.setState( { id: value } );
    }

    async addStudent() {
      const classId = this.props.match.params.custom_id
      let res = await axios.post(`roster/`, {
        id: this.state.id,
        class_id: this.state.classData.custom_id
      }, { headers: getHeader() })
	if (res) {
        this.setState({ roster: res.data })
        this.setState({ id: "" })
      }
    }

    render () {
      return (
        <div> 
          <Link to="/user/classes"> Back to Classes </Link>
	  <Link to={ '/user/class/' + this.state.classData.custom_id }> Assignments </Link>
          <h2 className="mt-2 mb-2"> { this.state.classData.name } ({ this.state.classData.custom_id }) - Roster </h2> 

          <div className="classes container mb-2"> 
            <div className="header row py-1">
            <div className="col"> Name </div>
            <div className="col"> Id </div>
            </div>
            { this.state.roster.map((c) => {
                return (
                  <div className="class row py-2" key={c._id}>
                  <div className="col"> { c.name } </div>
                  <div className="col"> { c.custom_id } </div> 
                  </div>
                )
            })}

            <div className="class row py-2">
              <input 
                className="form-control col" 
                name="name"
                type="text" 
                placeholder="Enter Name or ID"
                value={this.state.name} 
                onChange={this.handleInputChange} 
              />
	    </div>

          </div>

          <div className="btn btn-primary" onClick={this.addStudent}> Add </div>

        </div>
      )
  }
}

export default Assignments
