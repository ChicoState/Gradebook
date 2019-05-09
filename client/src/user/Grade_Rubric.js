import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';
import Rubric from './Rubric.js';
import './Classes.css';

const dd = "Default Description";

class Grade_Rubric extends Component {

    constructor(props) {
	super(props);
	this.state = {
	    levels: [1, 3, 5],
	    criteria: [dd, dd, dd],
	    standards: [[dd, dd, dd], [dd, dd, dd], [dd, dd, dd]]
	}

    }

    render () {
	return (
		<div>
		<Rubric grading={true} />
		</div>
	)
    }
}

export default Grade_Rubric
