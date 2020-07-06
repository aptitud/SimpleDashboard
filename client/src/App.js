import React from 'react';
import Customers from './Customers';
import Employees from './Employees';
import axios from 'axios';
import './App.css';

import { faBuilding, faUser, faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const BASE_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:5000' : '';

export default class App extends React.Component {
  state = {
    employees: [],
    customers: [],
    activeViewId: 'customers'
  }

  setActiveViewId(activeViewId) {
    this.setState({ activeViewId });
  }

  componentDidMount() {
    axios.get(`${BASE_URL}/assignments`).then((result) => {
      this.setState(result.data);
    });
  }

  resetCache() {
    axios.get(`${BASE_URL}/resetcache`).then((result) => {
      window.location.reload();
    });
  }

  render() {
    const activeView = () => {
      switch (this.state.activeViewId) {
        case 'customers':
          return <Customers data={this.state.customers} />
        case 'employees':
          return <Employees data={this.state.employees} />
        default:
          return null
      }
    }

    return (
      <div className="App">
        <div id="Menu" className="btn-group">
          <span onClick={() => this.setActiveViewId('customers')} className="btn" title="customer dashboard"><FontAwesomeIcon icon={faBuilding} /></span>
          <span onClick={() => this.setActiveViewId('employees')} className="btn" title="employee dashboard"><FontAwesomeIcon icon={faUser} /></span>
          <span onClick={this.resetCache} className="btn" title="reset cache"><FontAwesomeIcon icon={faSync} /></span>
        </div>

        {activeView()}
      </div>
    );
  }
}