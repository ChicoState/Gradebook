import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { getHeader, isLoggedIn, getUser } from '../auth'
import axios from 'axios'
import '../Courses.css';

class Classes extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "", 
      custom_id: "", 
      classes: [],
      user: {}, 
      join_code: "", 
      firstName: "", 
      colors: ['blue', 'red', 'green', 'yellow']
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.createClass = this.createClass.bind(this)
    this.deleteClass = this.deleteClass.bind(this)
    this.joinClass = this.joinClass.bind(this)
  }

  async componentDidMount() {
    let courses = await axios.get('/course/list', { headers: getHeader() })
    this.setState({ classes: courses.data })  
    let user = await axios.get('/user/me', { headers: getHeader() })
    this.setState({ user: user.data })
    this.setState({ firstName: user.data.name.split(' ')[0] })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async deleteClass(id, i) {
    let updated = this.state.classes
    updated.splice(i, 1)
    await axios.delete('/class/' + id, { headers: getHeader() })
    this.setState({ classes: updated })
  }

  async joinClass() {
    await axios.post('/join/' + this.state.join_code, {}, { headers: getHeader() })
    console.log("joined")
  }

  async createClass() {
    let res = await axios.post('course', {
      name: this.state.name, custom_id: this.state.custom_id
    }, { headers: getHeader() })
    if (res.data._id) {
      let updated = this.state.classes.concat(res.data)
      this.setState({ classes: updated })
      this.setState({ name: "", custom_id: "" })
    }
  }

  render () {
    return (
      <div> 
        <h2 className="mt-2 mb-3"> Welcome, {this.state.firstName} </h2> 
        <h4 className="small mb-1"> Your Courses </h4>
        <div className="courses row mb-4"> 
          { this.state.classes.map((c, i) => {
            return (
              <div className="course col-md-6 col-12 d-flex align-items-center p-2" key={c._id}>
                <div className={ "course-container " + this.state.colors[i] }>

                  <div className="d-flex">
                    <div className="courseName">
                		  <Link to={ '/teacher/course/' + c.custom_id }>{ c.name }</Link>
                		</div>
                    <a className="ml-auto" href="#" onClick={() => this.deleteClass(c.custom_id, i) }>
                        <i className="fas fa-times"></i>
                    </a> 
                  </div>
                  <div className="courseId"> { c.custom_id } </div>                   
                </div>
              </div>
            )
          })}
          <h4 className="mt-3 mr-3"> Create Course </h4> 
          <div className="course d-flex py-2">
            <input 
              className="form-control col-4 mr-2" 
              name="name"
              type="text" 
              placeholder="New course..."
              value={this.state.name} 
              onChange={this.handleInputChange} 
            />
            <input 
              className="form-control col-3" 
              name="custom_id"
              type="text" 
              placeholder="E.G. CSCI101"
              value={this.state.custom_id} 
              onChange={this.handleInputChange} 
            />
            <div className="col-3">
      
              <div className="btn btn-primary" onClick={this.createClass}> Create </div> 
      
            </div>
          </div> 
        </div>
      </div>
    )
  }
}

export default Classes
