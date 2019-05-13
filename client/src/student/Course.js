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
        assignments: [],
        courseData: {}, 
        grades: {},
        courseId: "", 
        loading: true, 
        gradeStyles: ['aplus', 'a', 'b', 'c', 'd', 'f']
      }
    }

    async componentDidMount() {
      const courseId = this.props.match.params.custom_id
      this.setState({ courseId: courseId })

      let c = await axios.get('course/student/' + courseId, { headers: getHeader() })
      this.setState({ courseData: c.data })
      
      const assignments = await axios.get('course/' + courseId + '/assignments', { headers: getHeader() })
      this.setState({ assignments: assignments.data })

      const grades = await axios.get('course/' + courseId + '/grades', { headers: getHeader() })
      console.log(grades.data)
      if (grades.data) this.setState({ grades: grades.data })

      this.setState({ loading: false })
    }

    render () {
      return (
        <div> 

          <div className="d-flex align-items-center">
            <div> 
              <h2 className="mt-2 mb-2"> { this.state.courseData.name } </h2>
              <h3 className="mr-2"> { this.state.courseData.custom_id } </h3> 
            </div>
            <div className="ml-auto"> 
              <h4 className="joinCode">90%</h4>
              <div className="joinCode-label">Grade</div>
            </div> 
          </div>

          <div className="container">

            <div className="row">

              <div className="assignments mt-3 col-md-5 col-12 pl-0"> 
                <h4 className="small"> Assignments </h4>

                { !this.state.loading && this.state.assignments.map((c) => {
                    return (
                      <div className="row py-2" key={c._id}>
                        <div className="d-flex col-12">
                          <div className="assignmentName">
                            <Link to={'/teacher/assignment/' + c._id }>{ c.name }</Link>
                          </div>
                          <div className="ml-auto avg">
                            avg 
                            <div className={ "ml-2 badge badge-primary " + (this.state.grades[c._id] == null ? "f" : this.state.gradeStyles[ Math.min( Math.floor(10 - (10 * this.state.grades[c._id].score / this.state.grades[c._id].total)) , 5) ]) }>
                              { this.state.grades[c._id] == null ? 0 : Math.round((this.state.grades[c._id].score / this.state.grades[c._id].total) * 1000) / 10 || 0 }%
                            </div>
                          </div>
                        </div>
                        <div className="d-flex col-12">
                          <div className=""> { c.type } </div>
                          <div className="ml-auto points"> { c.pointsPossible } points </div> 
                        </div>
                      </div>
                    )
                })}
              </div>

              <div className="col-md-5 offset-md-2 col-12 pr-0 pl-4 d-flex mt-3">
              </div>

            </div>

          </div>
    
        </div>
      )
  }
}

export default Course
