import React from 'react';
import './App.css';

export default class CustomerAssignments extends React.Component {
  render() {
    return (
      <tbody>
        <tr>
          <td className="tableRowSeparator" colSpan="13"></td>
        </tr>
        {this.props.customer.assignments && this.props.customer.assignments.filter((assignment) => assignment.overview.length).map((assignment, index) =>
            <tr key={assignment.employee.name}>
              <th scope="row">{index === 0 ? <a href={this.props.customer.cardUrl} target="_blank">{this.props.customer.name}</a> : ''}</th>
              {assignment.overview.map((item, index) =>
                <td key={assignment.employee.name + index}
                    title={item.hasAssignment ? `${assignment.employee.name} ${assignment.startDate} → ${assignment.endDate}` : '' } 
                    colSpan={item.colSpan} className={item.hasAssignment ? (assignment.alert ? 'needContract' : 'onContract') : 'offContract' }>
                      {item.hasAssignment ? <a href={assignment.employee.cardUrl} target="_blank">{assignment.employee.name}</a> : ''}
                </td>
              )}
            </tr>
        )}
      </tbody>
    );
  }
}
