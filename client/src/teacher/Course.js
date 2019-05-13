import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { getHeader, isLoggedIn } from '../auth'
import axios from 'axios'
import '../Course.css'

class Course extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        name: "",
        type: "",
        points_possible: undefined,
        assignments: [],
        roster: [],
        courseData: {}, 
        courseId: ""
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.createAssignment = this.createAssignment.bind(this)
    }

    async componentDidMount() {
      const courseId = this.props.match.params.custom_id
      this.setState({ courseId: courseId })

      let c = await axios.get('course/' + courseId, { headers: getHeader() })
      this.setState({ courseData: c.data })
      
      const assignments = await axios.get('course/' + courseId + '/assignments', { headers: getHeader() })
      this.setState({ assignments: assignments.data })
  
      const roster = await axios.get('course/' + courseId + '/roster', { headers: getHeader() })
      this.setState({ roster: roster.data })
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState( { [name]: value } );
    }

    async createAssignment() {
      let res = await axios.post('course/' + this.state.courseId + '/assignment', {
        name: this.state.name,
        type: this.state.type,
        pointsPossible: this.state.points_possible,
        class_id: this.state.courseData.custom_id
      }, { headers: getHeader() })
      if (res.data._id) {
        let updated = this.state.assignments.concat(res.data)
        this.setState({ assignments: updated })
        this.setState({ name: "", type: "", points_possible: 0 })
      }
    }

    render () {
      return (
        <div> 
          <h2 className="mt-2 mb-2"> { this.state.courseData.name } </h2>
          <div class="d-flex align-items-center">
            <h3 className="mr-2"> { this.state.courseData.custom_id } </h3>  
            <h4 className="joinCode"> Join Code: { this.state.courseData.join_code } </h4>
          </div>

          <h4> Assignments </h4>

          <div className="assignments"> 

            { this.state.assignments.map((c) => {
                return (
                  <div className="row py-2" key={c._id}>
                    <div className="d-flex col-12">
                      <div className="assignmentName">
                        <Link to={'/teacher/assignment/' + c._id }>{ c.name }</Link>
                      </div>
                      <div className="ml-auto avg">
                        avg <div className="ml-2 badge badge-primary">90%</div>
                      </div>
                    </div>
                    <div className="d-flex col-12">
                      <div className=""> { c.type } </div>
                      <div className="ml-auto points"> { c.pointsPossible } points </div> 
                    </div>
                  </div>
                )
            })}

            <div className="class d-flex py-2">
              <input 
                className="form-control col-4 mr-2" 
                name="name"
                type="text" 
                placeholder="New assignment..."
                value={this.state.name} 
                onChange={this.handleInputChange} 
              />
              <input 
                className="form-control col-3 mr-2" 
                name="type"
                type="text" 
                placeholder="E.G. Quiz"
                value={this.state.type} 
                onChange={this.handleInputChange} 
              />
              <input 
                className="form-control col-2" 
                name="points_possible"
                type="number"
                placeholder="Points"
                value={this.state.points_possible} 
                onChange={this.handleInputChange} 
              />
            </div> 

          </div>

          <div className="btn btn-primary btn-small" onClick={this.createAssignment}> Create </div>
    
        </div>
      )
  }
}

export default Course
