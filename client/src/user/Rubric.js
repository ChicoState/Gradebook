import React, { Component, PropTypes } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import './Classes.css';

const dd = "Default Description"


class Description extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    scratch: 'Example description',
	    edit: false
	}

	this.edit = this.edit.bind(this);
	this.save = this.save.bind(this);
	this.discard = this.discard.bind(this);
	this.handleEdit = this.handleEdit.bind(this);
    }

    edit() {
	this.setState({edit: true});
    }

    save() {
	this.setState({edit: false});
	this.props.updateDescription(this.state.scratch);
    }

    discard() {
	this.setState({edit: false, scratch: this.props.description});
    }

    handleEdit(event) {
	const value = event.target.value;
	this.setState({scratch: value});
    }    

    render() {
	return (
		<div>
		{!this.state.edit &&
		 (
			 <div>
			 <p>{this.props.description}</p>
			 <button type="button" onClick={this.edit}>edit</button>
			 </div>
		 )
		}
	        {this.state.edit &&
		 ( 
			 <div>
			 <textarea onChange={this.handleEdit}>{this.props.description}</textarea>
			 <span>
			 <button type="button" onClick={this.save}>save</button>
			 <button type="button" onClick={this.discard}>discard</button>
			 </span>
			 </div>
		 )
		}
	        </div>
	)
    }	

}

class Level extends Component {

    constructor(props) {
	super(props);

	this.add = this.add.bind(this);
	this.sub = this.sub.bind(this);
	this.remove = this.remove.bind(this);
    }

    add() {
	this.props.updateLevel(this.props.index, this.props.points + 1);
    }

    sub() {
	this.props.updateLevel(this.props.index, this.props.points - 1);
    }

    remove() {
	this.props.removeLevel(this.props.index);
    }
    
    render() {
	return (
		<div>
		<h5>{this.props.level}</h5>
		<button type="button" onClick={this.add}>+</button>
		<button type="button" onClick={this.sub}>-</button>
		<p>points: {this.props.points}</p>
		<button type="button" onClick={this.remove}>remove</button>
		</div>
	)
    }
    
}

class Criteria extends Component {

    constructor(props) {
	super(props);

	this.getStandards = this.getStandards.bind(this);
	this.updateDescription = this.updateDescription.bind(this);
	this.updateStandard = this.updateStandard.bind(this);
	this.removeCriteria = this.removeCriteria.bind(this);
    }
    
    getStandards() {
	let s = [];
	for (let i = 0; i < this.props.standards.length; i++) {
	    s.push(<Standard
		   description={this.props.standards[i]}
		   updateStandard={this.updateStandard}
		   index={i} />);
	}
	return s;
    }

    updateDescription(value) {
	this.props.updateDescription(this.props.index, value);
    }

    updateStandard(index, value) {
	this.props.updateStandard(this.props.index, index, value);
    }

    removeCriteria() {
	this.props.removeCriteria(this.props.index);
    }

    render() {
	return (
		<tr>
		<td>
		<h5>{this.props.criteria}</h5>
		<Description description={this.props.description} updateDescription={this.updateDescription} />
		<button type="button" onClick={this.removeCriteria}>remove</button>		
		</td>
		{this.getStandards()}
		</tr>
	)
    }

}

class Standard extends Component {

    constructor(props) {
	super(props);

	this.updateDescription = this.updateDescription.bind(this);
    }
    
    updateDescription(value) {
	this.props.updateStandard(this.props.index, value);
    }

    render() {
	return (
		<td>
		<Description description={this.props.description} updateDescription={this.updateDescription} />
		</td>
	)
    }
    
}

class Rubric extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    levels: [1, 3, 5],
	    criteria: [dd, dd, dd],
	    standards: [[dd, dd, dd], [dd, dd, dd], [dd, dd, dd]]
	}

	this.getLevels = this.getLevels.bind(this);
	this.getCriteria = this.getCriteria.bind(this);
	this.updateLevel = this.updateLevel.bind(this);
	this.updateCriteria = this.updateCriteria.bind(this);
	this.updateStandard = this.updateStandard.bind(this);
	this.removeLevel = this.removeLevel.bind(this);
	this.removeCriteria = this.removeCriteria.bind(this);
	this.addLevel = this.addLevel.bind(this);
	this.addCriteria = this.addCriteria.bind(this);
    }
    
    getLevels() {
	let l = [<th></th>];
	for (let i = 0; i < this.state.levels.length; i++) {
	    l.push(<th><Level
		   level={"Level " + (i + 1).toString()}
		   points={this.state.levels[i]}
		   index={i}
		   updateLevel={this.updateLevel}
		   removeLevel={this.removeLevel} /></th>);
	}
	return l;
    }

    getCriteria() {
	let c = [];
	for (let i = 0; i < this.state.criteria.length; i++) {
	    c.push(<Criteria
		   criteria={"Criteria " + (i + 1).toString()}
		   standards={this.state.standards[i]}
		   index={i}
		   description={this.state.criteria[i]}
		   updateDescription={this.updateCriteria}
		   updateStandard={this.updateStandard}
		   removeCriteria={this.removeCriteria} />);
	}
	return c;
    }
    
    updateLevel(index, points) {
	let l = this.state.levels;
	l[index] = points;
	this.setState({levels: l});
    }

    updateCriteria(index, value) {
	let c = this.state.criteria;
	c[index] = value;
	this.setState({criteria: c});
    };

    updateStandard(index_one, index_two, value) {
	let s = this.state.standards;
	s[index_one][index_two] = value;
	this.setState({standards: s});
    }

    removeLevel(index) {
	let l = [];
	let s = [];
	let tmp;
	for (let i = 0; i < this.state.levels.length; i++) {
	    if (i != index) l.push(this.state.levels[i]);
	}	    
	for (let i = 0; i < this.state.criteria.length; i++) {
	    tmp = [];
	    for (let j = 0; j < this.state.levels.length; j++) {
		if (j != index) tmp.push(this.state.standards[i][j]);
	    }
	    s.push(tmp);
	}
	this.setState({levels: l, standards: s});
    }

    removeCriteria(index) {
	let c = [];
	let s = [];
	for (let i = 0; i < this.state.criteria.length; i++) {
	    if (i != index) {
		c.push(this.state.criteria[i]);
		s.push(this.state.standards[i]);
	    }
	}
	this.setState({criteria: c, standards: s});
    }

    addLevel() {
	let l = this.state.levels;
	let s = this.state.standards;
	l.push(1);
	for (let i = 0; i < this.state.criteria.length; i++) {
	    s[i].push(dd);
	}
	this.setState({levels: l, standards: s});
    }
    
    addCriteria() {
	let c = this.state.criteria;
	let s = this.state.standards;
	let tmp = [];
	c.push(dd);
	for (let i = 0; i < this.state.levels.length; i++) {
	    tmp.push(dd);
	}
	s.push(tmp);
	this.setState({criteria: c, standards: s});
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
		<button type="button" onClick={this.addLevel}>Add Level</button>
		<button type="button" onClick={this.addCriteria}>Add Criteria</button>
		</div>
	)
    }

}

export default Rubric;
