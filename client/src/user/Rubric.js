import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import './Classes.css';

class Standard extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    description: 'Example description'
	}

	this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleUpdate() {
	const p = this.props.points;
	this.props.updatePoints(p);
    }     

    render () {
	return (
		<td>
		<p>{ this.state.description }</p>
		<p>points: { this.props.points}</p>
		<input type="radio" name={this.props.criteria} onChange={this.handleUpdate} />
		</td>
	)
    }
    
}

class Criteria extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    description: "Example description",
	    points: 0
	}

	this.updatePoints = this.updatePoints.bind(this);
    }

    updatePoints(value) {
	this.setState({points: value});
    } 

    render () {
	return (
		<tr>
		<td>
		<h5>{this.props.criteria}</h5>
		<p>{this.state.description}</p>
		<p>points: {this.state.points}</p>
		</td>
		<Standard criteria={this.props.criteria} points="1" updatePoints={this.updatePoints} />
		<Standard criteria={this.props.criteria} points="3" updatePoints={this.updatePoints} />
		<Standard criteria={this.props.criteria} points="5" updatePoints={this.updatePoints} />
		</tr>
	)
    }

}

class Rubric extends Component {

    constructor(props) {
	super(props);

	// this.something = this.something.bind(this)
    }

    render() {
	return (
		<table>
		<Criteria criteria="Criteria 1" />
		<Criteria criteria="Criteria 2" />
		<Criteria criteria="Criteria 3" />
		</table>
	)
    }
}

export default Rubric;
