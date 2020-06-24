import React from 'react';
import './App.css';

export default class EmployeeAssignments extends React.Component {

  arrangeMonthView(monthViewAssignment, alert) {
    const arrangedMonthView = [];

    if (monthViewAssignment && monthViewAssignment.length) {
      monthViewAssignment.forEach((month, index) => {
        if (index === 0 || arrangedMonthView[arrangedMonthView.length - 1].hasAssignment !== month.hasAssignment) {
          arrangedMonthView.push({
            hasAssignment: month.hasAssignment,
            colSpan: 1,
            className: month.hasAssignment ? (alert ? 'needContract' : 'onContract') : 'offContract'
          });
        } else {
          arrangedMonthView[arrangedMonthView.length - 1].colSpan++;
        }
      });
    }

    return arrangedMonthView;
  }

  render() {
    return this.props.employee.assignments.length ?
        <tbody>
        {this.props.employee.assignments && this.props.employee.assignments.map(assignment =>
          <tr key={assignment.customer.name}>
            <th scope="row"><a href={this.props.employee.cardUrl} target="_blank">{this.props.employee.name}</a></th>
            {this.arrangeMonthView(assignment.monthViewAssignment, assignment.alert).map((monthView, index) =>
              <td key={assignment.customer.name + index} title={assignment.customer.name} colSpan={monthView.colSpan} className={monthView.className}>{monthView.hasAssignment ? assignment.customer.name : ''}</td>
            )}
          </tr>
        )}
      </tbody>
      : null
  }
}
