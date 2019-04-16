import React, { Component } from 'react';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import '../Grades.css'

class Grades extends Component {
  
    constructor(props) {
      super(props)
      this.state = {
        name: "",
        score: 0,
        assignment: {}, 
        grades: [], 
        roster: [], 
        loading: true
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.createGrade = this.createGrade.bind(this)
    }

    async componentDidMount() {
      const assignment_id = this.props.match.params.assignment_id
      let assignment = (await axios.get('assignment/' + assignment_id, { headers: getHeader() })).data
      this.setState({ assignment: assignment })

      const roster = await axios.get('course/' + assignment.class_id + '/roster', { headers: getHeader() })

      var grades = (await axios.get('grade/assignment/' + assignment_id, { headers: getHeader() })).data

      for (const student of roster.data) {
        try {
          student.grade = grades.length > 0 ?  grades.find((grade) => {
            console.log(grade.student_id, student._id)
            if (grade && student)  
              return grade.student_id == student._id; 
            else return false
          }).score : 0
        } catch(e) {
          student.grade = 0
        }
      }

      this.setState({ grades: grades })
      this.setState({ roster: roster.data })
      this.setState({ loading: false })

    }

    handleInputChange = i => event => {
      const roster = this.state.roster.map((student, j) => {
        if (i !== j) return student;
        return { ...student, grade: event.target.value };
      });
      this.setState({ roster: roster })
    }

    async createGrade(s) {
      let res = await axios.post('/grade/' + this.state.assignment.class_id, {
        score: s.grade, 
        student_id: s._id, 
        assignment_id: this.state.assignment._id, 
        total: this.state.assignment.pointsPossible
      }, { headers: getHeader() })
      if (res.data._id) { 
        let roster = this.state.roster       
        let student = roster.find((s) => { return s._id == res.data.student_id })
        if (student) student.grade = res.data.score
        this.setState({ roster: roster })
      }
    }

    render () {
      return (
        <div> 
          <div className="d-flex align-items-center">
            <h2 className="mr-3"> { this.state.assignment.name } </h2> 
            <h4> Points Possible: { this.state.assignment.pointsPossible } </h4>
          </div>

          <h3> { this.state.assignment.class_id } </h3> 
          
          <div className="roster mt-3"> 
            <h4> Grades </h4> 
            { !this.state.loading && this.state.roster.map((s, i) => {
                return (
                <div className="d-flex align-items-center" key={s.custom_id}> 
                  <div className="studentName pl-0"> { s.name } </div>
                  <div className="mr-2 col-1 id"> { s.custom_id } </div> 
                  <div className="score col-4"> 
                    <input 
                      type="number" 
                      className="form-control gradeInput mb-0 col-4" 
                      name="grade"
                      value={s.grade} 
                      onChange={this.handleInputChange(i)} 
                    /> <div className="col-4 gradeTotal"> / { this.state.assignment.pointsPossible} </div> 
                  </div> 
                  <div className="percentage mr-2 col-2"> { 100 * s.grade / this.state.assignment.pointsPossible || 0}% </div> 
                  <div className="col-2"> 
                    <button className="btn btn-primary btn-small" onClick={() => this.createGrade(s) }> Save </button>
                  </div> 
                </div>
                )
            })}
          </div>

        </div>
      )
  }
}

export default Grades
