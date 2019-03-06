import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import './Classes.css';

class Grades extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        name: "",
        score: 0,
        assignment: {}, 
        grades: []
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.createGrade = this.createGrade.bind(this)
    }

    async componentDidMount() {
      const id = this.props.match.params.assignment_id
      
      const assignment = await axios.get(`teacher/assignment/${id}`, { headers: getHeader() })
      this.setState({ assignment: assignment.data })  

      const grades = await axios.get(`teacher/assignment/${id}/grades`, { headers: getHeader() })
      this.setState({ grades: grades.data })
    }

    handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState( { [name]: value } );
    }

    async createGrade() {
      if (!this.state.name || !this.state.score) return
      let res = await axios.post('assignment/' + this.state.assignment._id + '/grade', {
        student_id: this.state.name,
        score: this.state.score
      }, { headers: getHeader() })
      if (res.data._id) {
        let updated = this.state.grades.concat(res.data)
        this.setState({ grades: updated })
        this.setState({ name: "", score: 0 })
      }
    }

    render () {
      return (
        <div> 
          <Link to="/teacher/classes"> Back to Assignments </Link>
          <h2 className="mt-2 mb-2"> { this.state.assignment.name } ({ this.state.assignment.class_id }) - Grades </h2> 
          <h4> Points Possible: { this.state.assignment.pointsPossible } </h4>
          <div className="classes container mb-2"> 
            <div className="header row py-1">
            <div className="col"> Name </div>
            <div className="col"> Score </div>
            <div className="col"> Percentage </div>
            </div>
            { this.state.grades.map((c) => {
                return (
                  <div className="class row py-2" key={c._id}>
                  <div className="col"> { c.student_id } </div>
                  <div className="col"> { c.score } </div>
                  <div className="col"> { 100 * c.score / this.state.assignment.pointsPossible }% </div> 
                  </div>
                )
            })}

            <div className="class row py-2">
              <input 
                className="form-control col" 
                name="name"
                type="text" 
                placeholder="Student's name"
                value={this.state.name} 
                onChange={this.handleInputChange} 
              />
              <input 
                className="form-control col" 
                name="score"
                type="number" 
                placeholder="Score"
                value={this.state.score} 
                onChange={this.handleInputChange} 
              />
              <div className="col"> { 100 * Number(this.state.score) / Number(this.state.assignment.pointsPossible) }% </div> 
            </div> 

          </div>

          <div className="btn btn-primary" onClick={this.createGrade}> Create </div>

        </div>
      )
  }
}

export default Grades
