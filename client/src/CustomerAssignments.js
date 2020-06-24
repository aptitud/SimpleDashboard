import React from 'react';
import './App.css';

export default class CustomerAssignments extends React.Component {

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
    return (
      <tbody>
        <tr>
          <td className="customerSeparator" colSpan="13"></td>
        </tr>
        {this.props.customer.assignments && this.props.customer.assignments.map((assignment, index) =>
            <tr key={assignment.employee.name}>
              <th scope="row">{index === 0 ? <a href={this.props.customer.cardUrl} target="_blank">{this.props.customer.name}</a> : ''}</th>
              {this.arrangeMonthView(assignment.monthViewAssignment, assignment.alert).map((monthView, index) =>
                <td key={assignment.employee.name + index} colSpan={monthView.colSpan} className={monthView.className}>{monthView.hasAssignment ? assignment.employee.name : ''}</td>
              )}
            </tr>
        )}
      </tbody>
    );
  }
}
