import React, { Component } from 'react'
import { Route, Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import { getHeader, isLoggedIn } from './auth'

class Account extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user: {}
		}
	}

	async componentDidMount() {
		let user = await axios.get('http://localhost:3993/api/me', { headers: getHeader() })
		this.setState({ user: user.data })
	}

	render () {
		return !isLoggedIn() ? <Redirect to="/login" /> : 
			(
				<div> 
				<div> Hello <strong>{this.state.user.name}</strong>! </div>
				<div> Your email: {this.state.user.email} </div>
				<div> 
				{ !this.state.user.student && ( 
					<Link to="/user/classes">Your Classes <i class="fas fa-chalkboard-teacher"></i> </Link>
				)}
				{this.state.user.student && ( 
					<Link to="/user/classes">Your Class Grades<i class="fas fa-chalkboard-student"></i> </Link>
				)}
				</div>
				</div>
			)
				
				}

	}

	export default Account
