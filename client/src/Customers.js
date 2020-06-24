import React from 'react';
import CustomerAssignments from './CustomerAssignments';

export default class Customers extends React.Component {
  constructor(props) {
    super(props);
    var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
      months = [],
      index = (new Date()).getMonth();
    for (var i = 0; i < 12; i++) {
      months.push(monthNames[index]);
      index = index + 1 === 12 ? 0 : index + 1;
    }
    
    this.state =  { months };
  };

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th></th>
            {this.state.months.map(month => <th key={month} scope="col">{month}</th>)}
          </tr>
        </thead>
        {this.props.data.map(customer => <CustomerAssignments key={customer.name} customer={customer} />)}
      </table>
    );
  }
}