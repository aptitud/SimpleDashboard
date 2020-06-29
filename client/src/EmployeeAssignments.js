import React from 'react';
import './App.css';

export default class EmployeeAssignments extends React.Component {
  render() {
    return this.props.employee.assignments.length ?
      <tbody>
        <tr>
          <th scope="row"><a href={this.props.employee.cardUrl} target="_blank">{this.props.employee.name}</a></th>
          {this.props.employee.assignments.map((assignment, index) =>
            <td key={assignment.customer?.name + index} colSpan={assignment.colSpan} className={assignment.className}>{assignment.customer?.name ?? ''}</td>
          )}
        </tr>
      </tbody>
      : null
  }
}
