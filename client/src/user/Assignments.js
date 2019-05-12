import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import '../Courses.css';

class Assignments extends Component {

  constructor(props) {
    super(props)
    this.state = {
      name: "",
      type: "",
      points_possible: 0,
      assignments: [],
      roster: [],
      classData: {}
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.createAssignment = this.createAssignment.bind(this)
  }

  async componentDidMount() {
    const classId = this.props.match.params.custom_id
    let c = await axios.get('class/' + classId, { headers: getHeader() })
    this.setState({ classData: c.data })

    const assignments = await axios.get(`user/assignments/${classId}`, { headers: getHeader() })
    this.setState({ assignments: assignments.data })

    const roster = await axios.get(`user/roster/${classId}`, { headers: getHeader() })
    this.setState({ roster: roster.data })
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  async createAssignment() {
    let res = await axios.post('assignment', {
      name: this.state.name,
      type: this.state.type,
      pointsPossible: this.state.points_possible,
      class_id: this.state.classData.custom_id
    }, { headers: getHeader() })
    if (res.data._id) {
      let updated = this.state.assignments.concat(res.data)
      this.setState({ assignments: updated })
      this.setState({ name: "", type: "", points_possible: 0 })
    }
  }

  render() {
    return (
      <div>
        <Link to="/user/classes"> Back to Classes </Link>
        <h2 className="mt-2 mb-2"> {this.state.classData.name} ({this.state.classData.custom_id}) - Assignments </h2>
        <h3> Join Code: {this.state.classData.join_code} </h3>
        <div className="classes container mb-2">
          <div className="header row py-1">
            <div className="col"> Name </div>
            <div className="col"> Type </div>
            <div className="col"> Points </div>
          </div>
          {this.state.assignments.map((c) => {
            return (
              <div className="class row py-2" key={c._id}>
                <div className="col">
                  <Link to={'/user/assignment/' + c._id}>{c.name}</Link>
                </div>
                <div className="col"> {c.type} </div>
                <div className="col"> {c.pointsPossible} </div>
              </div>
            )
          })}

          <div className="class row py-2">
            <input
              className="form-control col"
              name="name"
              type="text"
              placeholder="New assignment..."
              value={this.state.name}
              onChange={this.handleInputChange}
            />
            <input
              className="form-control col"
              name="type"
              type="text"
              placeholder="E.G. Quiz"
              value={this.state.type}
              onChange={this.handleInputChange}
            />
            <input
              className="form-control col"
              name="points_possible"
              type="number"
              value={this.state.points_possible}
              onChange={this.handleInputChange}
            />
          </div>

        </div>

        <div className="btn btn-primary" onClick={this.createAssignment}> Create </div>

        <h2 className="mt-2 mb-2"> Roster </h2>
        <Link to={'/user/roster/' + this.state.classData.custom_id}>edit roster</Link>

        <div className="classes container mb-2">
          <div className="header row py-1">
            <div className="col"> Name </div>
            <div className="col"> Id </div>
          </div>
          {this.state.roster.map((c) => {
            return (
              <div className="class row py-2" key={c._id}>
                <div className="col"> {c.name} </div>
                <div className="col"> {c.custom_id} </div>
              </div>
            )
          })}

        </div>


      </div>
    )
  }
}

export default Assignments
