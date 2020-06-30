import React from 'react';
import './App.css';

export default class EmployeeAssignments extends React.Component {
  render() {
    return this.props.employee.assignments.length ?
      <tbody>
        <tr>
          <th scope="row"><a href={this.props.employee.cardUrl} target="_blank">{this.props.employee.name}</a></th>
          {this.props.employee.assignments.map((assignment, index) =>
            <td key={assignment.customer?.name + index} 
              title={assignment.customer ? `${assignment.customer.name} ${assignment.startDate} → ${assignment.endDate}` : '' } 
              colSpan={assignment.colSpan} 
              className={assignment.customer ? (assignment.alert ? 'needContract' : 'onContract') : 'offContract'}>
                {assignment.customer ? <a href={assignment.customer.cardUrl} target="_blank">{assignment.customer.name}</a> : ''}
            </td>
          )}
        </tr>
      </tbody>
      : null
  }
}
