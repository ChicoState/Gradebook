import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getHeader, isLoggedIn } from '../auth'
import axios from 'axios'
import '../Courses.css'

class Courses extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "", 
      custom_id: "", 
      courses: [],
      user: {}, 
      join_code: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.joinCourse = this.joinCourse.bind(this)
  }

  async componentDidMount() {
    let courses = await axios.get('/course/list', { headers: getHeader() })
    var grades = []
    this.setState({ courses: courses.data })  
    for (const course of courses.data) {
      let grade = await axios.get('/grade/course/' + course.custom_id, { headers: getHeader() })
      course.grade = grade.data.grade
    }
    let user = await axios.get('/user/me', { headers: getHeader() })
    this.setState({ user: user.data })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async joinCourse() {
    await axios.post('/course/join/' + this.state.join_code, {}, { headers: getHeader() })
  }

  render () {
    return(
      <div> 
        <h2 className="mt-2 mb-2"> Welcome, { this.state.user.name }! </h2> 
        <h4 className="mt-3 mb-0"> Your Courses </h4> 
        <div className="courses mb-4"> 
          { this.state.courses.map((c, i) => {
            return (
              <div className="course d-flex align-items-center py-2" key={c._id}>
                <div className="badge badge-primary mr-3">{c.grade * 100}%</div>
                <div className="courseName mr-3"> <Link to={ '/user/class/' + c.custom_id }>{ c.name }</Link> </div> 
                <div className="courseId"> { c.custom_id } </div>  
              </div>
            )
          })}
        </div>
        <div> 
          <h4> Add Courses </h4> 
          <div className="input-group">
            <input className="form-control" type="text" name="join_code" value={this.state.join_code} placeholder="Join Code" onChange={this.handleInputChange}/>
            <div className="input-group-append">
              <div className="btn btn-primary" onClick={this.joinCourse}> Join </div> 
            </div> 
          </div> 
        </div>
      </div>
    )          
  }
}

export default Courses
