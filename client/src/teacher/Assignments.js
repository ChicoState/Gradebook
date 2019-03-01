import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import './Classes.css';

class Assignments extends Component {
    constructor(props) {
	super(props)
	this.state = {
	    name: "",
	    type: "",
	    points_possible: 0,
	    assignments: []
	}

	this.handleInputChange = this.handleInputChange.bind(this)
	this.createAssignment = this.createAssignment.bind(this)
    }

    async componentDidMount() {
	const classId = this.props.match.params.classId
	
	const assignments = await axios.get(`teacher/assignments/${classId}`, { headers: getHeader() })
	this.setState({ assignments: assignments.data })  
    }

    handleInputChange(event) {
	const target = event.target;
	const value = target.type === 'checkbox' ? target.checked : target.value;
	const name = target.name;

	this.setState({
	    [name]: value
	});
    }

    async createAssignment() {
	let res = await axios.post('assignment', {
	    name: this.state.name,
	    type: this.state.type,
	    points_possible: this.points_possible,
	    class_id: this.props.match.params.classId
	}, { headers: getHeader() })
	if (res.data._id) {
	    let updated = this.state.assignments.concat(res.data)
	    this.setState({ assignments: updated })
	}
    }

    render () {
	return (
		<div> 
		<h2 className="mt-2 mb-2"> Classes </h2> 
		<div className="classes container mb-2"> 
		<div className="header row py-1">
		<div className="col"> Name </div>
		<div className="col"> Type </div>
		<div className="col"> Points </div>
		</div>
		{ this.state.assignments.map((c) => {
		    return (
			    <div className="class row py-2" key={c._id}>
			    <div className="col"> { c.name } </div>
			    <div className="col"> { c.type } </div>
			    <div className="col"> { c.points_possible } </div> 
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
		<input type="hidden" value="csci100" />
		</div> 

            </div>

		<div className="btn btn-primary" onClick={this.createAssignment}> Create </div>

	    </div>
	)
    }
}

export default Assignments