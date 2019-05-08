import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { getHeader, isLoggedIn } from '../auth';
import axios from 'axios';

class Roster extends Component {

  constructor(props) {
    super(props)
    this.state = {
      roster: []
    }
  }

  async componentDidMount() {
    const id = await this.props.course_id

    const roster = await axios.get('course/' + id + '/roster', { headers: getHeader() })
    this.setState({ roster: roster.data })
  }

  render() {
    return (
      <div className="roster mt-3"> 
        <h4> Roster </h4> 
        { this.state.roster.map((s) => {
            return (
            <div className="d-flex align-items-center"> 
              <div className="mr-2"> { s.name } </div>
              <div> ({ s.custom_id }) </div> 
            </div>
            )
        })}
      </div>
    )
  }

}

export default Roster