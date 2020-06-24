import React from 'react';
// import logo from './logo.svg';
import Customers from './Customers';
import Employees from './Employees';
import axios from 'axios';
import './App.css';

export default class App extends React.Component {
  state = {
    employees: [],
    customers: [],
    activeViewId: 'customers'
  }

  setActiveViewId(activeViewId) {
    this.setState({activeViewId});
  }

  componentDidMount() {
    axios.get('http://localhost:5000/assignments').then((result) => {
      this.setState(result.data);
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
          <a href="#" onClick={() => this.setActiveViewId('customers')} className="btn"><i className="icon-building"></i></a>
          <a href="#" onClick={() => this.setActiveViewId('employees')} className="btn"><i className="icon-user"></i></a>
        </div>

        {activeView()}
      </div>
    );
  }
}