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

    render() {
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
	let delta = value - this.state.points;
	this.setState({points: value});
	this.props.updateTotal(delta);
    } 

    render() {
	return (
		<tr>
		<td>
		<h5>{this.props.criteria}</h5>
		<p>{this.state.description}</p>
		<p>points: {this.state.points}</p>
		</td>
		{this.props.levels.map(l => {return(<Standard criteria={this.props.criteria} points={l} updatePoints={this.updatePoints} />)})}
		</tr>
	)
    }

}

class Level extends Component {

    constructor(props) {
	super(props);

	this.add = this.add.bind(this);
	this.sub = this.sub.bind(this);
    }

    add() {
	this.props.updateLevel(this.props.index, this.props.points + 1);
    }

    sub() {
	this.props.updateLevel(this.props.index, this.props.points - 1);
    }
    
    render() {
	return (
		<div>
		<button type="button" onClick={this.add}>+</button>
		<p>points: {this.props.points}</p>
		<button type="button" onClick={this.sub}>-</button>
		</div>
	)
    }
    
}

class Rubric extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    total: 0,
	    levels: [1, 3, 5],
	    criteria: 3
	}

	this.updateTotal = this.updateTotal.bind(this);
	this.updateLevel = this.updateLevel.bind(this);
	this.getLevels = this.getLevels.bind(this);
	this.getCriteria = this.getCriteria.bind(this);
    }

    updateTotal(delta) {
	this.setState({total: this.state.total + delta});
    }

    updateLevel(index, points) {
	let l = this.state.levels;
	l[index] = points;
	this.setState({levels: l});
    }

    getLevels() {
	let l = [<th></th>];
	for (let i = 0; i < this.state.levels.length; i++) {
	    l.push(<th><Level points={this.state.levels[i]} index={i} updateLevel={this.updateLevel} /></th>);
	}
	return l;
    }

    getCriteria() {
	let c = [];
	for (let i = 0; i < this.state.criteria; i++) {
	    c.push(<Criteria criteria={"Criteria " + (i + 1).toString()} levels={this.state.levels} updateTotal={this.updateTotal} />);
	}
	return c;
    }

    render() {
	return (
		<div>
		<table>
		<thead>
		<tr>{this.getLevels()}</tr>
		</thead>
		<tbody>{this.getCriteria()}</tbody>
		</table>
		<p>Total: {this.state.total}</p>
		</div>
	)
    }

}

export default Rubric;
