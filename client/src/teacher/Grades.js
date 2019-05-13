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
        course: {},
        grades: [], 
        roster: [], 
        loading: true,
        gradeStyles: ['aplus', 'a', 'b', 'c', 'd', 'f']
      }

      this.handleInputChange = this.handleInputChange.bind(this)
      this.createGrade = this.createGrade.bind(this)
    }

    async componentDidMount() {
      const assignment_id = this.props.match.params.assignment_id
      let assignment = (await axios.get('assignment/' + assignment_id, { headers: getHeader() })).data
      this.setState({ assignment: assignment })

      const roster = await axios.get('course/' + assignment.class_id + '/roster', { headers: getHeader() })
      const course = await axios.get('course/' + assignment.class_id, { headers: getHeader() })

      var grades = (await axios.get('grade/assignment/' + assignment_id, { headers: getHeader() })).data

      for (const student of roster.data) {
        try {
          student.grade = grades.length > 0 ?  grades.find((grade) => {
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
      this.setState({ course: course.data })

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

    async createGrades() {
      var grades = []
      for (const student of this.state.roster) {
        var grade = {        
          score: student.grade, 
          student_id: student._id, 
          assignment_id: this.state.assignment._id, 
          total: this.state.assignment.pointsPossible
        }
        grades.push(grade)
      }
      let res = await axios.post('/grade/list/' + this.state.assignment.class_id, { grades: grades }, { headers: getHeader() })
    }

    render () {
      return (
        <div> 
          <div className="d-flex align-items-center">

            <div> 
              <h2 className="assignment-name"> { this.state.assignment.name } </h2> 
              <div className="d-flex align-items-center">
                <div className="course-title mr-3">{ this.state.course.name }</div>
                { this.state.assignment.class_id }
              </div>
            </div>

            <div className="ml-auto points-possible"> 
              <div className="points">{ this.state.assignment.pointsPossible }</div>
              <div className="label">points</div>
            </div>

          </div>

          <div className="roster mt-3"> 
            <div className="container">
              <div className="row mt-4">
                <h4 className="small">Students</h4> 
                <h4 className="small ml-auto">Score</h4> 
                <h4 className="small grade-label ml-4">Grade</h4> 
              </div> 
              { !this.state.loading && this.state.roster.map((s, i) => {
                  return (
                  <div className="row my-2 align-items-center" key={i}> 
                    <div className="studentName d-flex"> 
                      <div className="mr-2">{ s.name }</div>
                      <div className="id">({ s.custom_id })</div>
                     </div>
                    <div className="score ml-auto"> 
                      <div className="d-flex align-items-center">
                        <input 
                          type="number" 
                          className="form-control gradeInput ml-auto w-50" 
                          name="grade"
                          value={s.grade} 
                          onChange={this.handleInputChange(i)} 
                        />
                      </div>
                    </div> 
                    {  }
                    <div className={ "percentage badge badge-primary ml-4 " + this.state.gradeStyles[Math.min(Math.abs(10 - Math.floor(10 * (s.grade / this.state.assignment.pointsPossible))), 5)]}> 
                      { 100 * s.grade / this.state.assignment.pointsPossible || 0}% 
                    </div> 
                  </div>
                  )
              })}
            </div>
          </div> 

          <div className="d-flex mt-3">
            <button className="btn btn-primary btn-small ml-auto" onClick={() => this.createGrades() }> Save </button>
          </div> 

        </div>
      )
  }
}

export default Grades
