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
      classes: [],
      user: {}
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.createClass = this.createClass.bind(this)
    this.deleteClass = this.deleteClass.bind(this)
  }

  async componentDidMount() {
    let classes = await axios.get('user/classes', { headers: getHeader() })
    this.setState({ classes: classes.data })  
    let user = await axios.get('http://localhost:3993/api/me', { headers: getHeader() })
    console.log("Await ",user.student)
    this.setState({ user: user.data })
    console.log("This state student", this.state.user.student)
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
    console.log(id)
    let updated = this.state.classes
    updated.splice(i, 1)
    await axios.delete('/class/' + id, { headers: getHeader() })
    this.setState({ classes: updated })
  }

  async createClass() {
    let res = await axios.post('class', {
      name: this.state.name, custom_id: this.state.custom_id
    }, { headers: getHeader() })
    if (res.data._id) {
      let updated = this.state.classes.concat(res.data)
      this.setState({ classes: updated })
      this.setState({ name: "", custom_id: "" })
    }
  }



  render () {
    const isStudent = this.state.user.student;
    console.log(this.state.user, isStudent)
    if (isStudent){
      console.log("IS STUDENT")
    return(
      <div> 
      <h2 className="mt-2 mb-2"> Classes </h2> 
      <div className="classes container mb-2"> 
        <div className="header row py-1">
          <div className="col-4"> Name </div> 
          <div className="col-4"> Identifier </div> 
          <div className="col-4"> Actions </div> 
        </div>
        { this.state.classes.map((c, i) => {
          return (
            <div className="class row py-2" key={c._id}>
              <div className="col-4"> <Link to={ '/user/class/' + c.custom_id }>{ c.name }</Link></div>
              <div className="col-4"> { c.custom_id } </div>  
            </div>
          )
        })}
      </div>
    </div>
    )          
    }
    else if(!isStudent){
      console.log("NOT STUDENT")
      return(
        <div> 
        <h2 className="mt-2 mb-2"> Classes </h2> 
        <div className="classes container mb-2"> 
          <div className="header row py-1">
            <div className="col-4"> Name </div> 
            <div className="col-4"> Identifier </div> 
            <div className="col-4"> Actions </div> 
          </div>
          { this.state.classes.map((c, i) => {
            return (
              <div className="class row py-2" key={c._id}>
                <div className="col-4"> <Link to={ '/user/class/' + c.custom_id }>{ c.name }</Link></div>
                <div className="col-4"> { c.custom_id } </div> 
                <div className="col-4"> 
                  <a href="#" onClick={() => this.deleteClass(c.custom_id, i) }>Delete</a>
                </div> 
              </div>
            )
          })}

          <div className="class row py-2">
            <input 
              className="form-control col-4" 
              name="name"
              type="text" 
              placeholder="New class..."
              value={this.state.name} 
              onChange={this.handleInputChange} 
            />
            <input 
              className="form-control col-4" 
              name="custom_id"
              type="text" 
              placeholder="E.G. CSCI101"
              value={this.state.custom_id} 
              onChange={this.handleInputChange} 
            />
            <div className="col-4">
              <div className="btn btn-primary" onClick={this.createClass}> Create </div>
            </div>
          </div> 
        </div>
      </div>
      )
    }
  }
}

export default Classes
