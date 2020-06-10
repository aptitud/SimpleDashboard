const trelloHelper = require('./trello-helper.js');

module.exports.getTrelloData = async () => {
    const employeeCards = await trelloHelper.getEmployeeCards(),
        customerCards = await trelloHelper.getCustomerCards();

    return parseData(employeeCards, customerCards);
}

const parseData = (employeeCards, customerCards) => {
    let trelloData = {
        employees: [
            // id,
            // name,
            // assignments: [{
            //     company,
            //     dateStart,
            //     dateEnd
            // }]
        ],
        customers: [
            // id,
            // name,
            // assignments: [{
            //     employee,
            //     dateStart,
            //     dateEnd
            // }]
        ]
    };

    customerCards.forEach((customerCard) => {
        let customer = {
            name: customerCard.name,
            cardUrl: customerCard.shortUrl,
            assignments: []
        };
        const customerCardDescriptions = parseCardDescription(customerCard.desc);

        customerCard.idMembers.forEach((memberId) => {
            const employee = employeeCards.find((employee) => employee.id === memberId);
            const descriptionForEmployee = customerCardDescriptions[employee.name];

            if (!descriptionForEmployee || descriptionForEmployee.length === 0) {
                customer.assignments.push({ employee: null, startDate: null, endDate: null });
            } else {
                descriptionForEmployee.forEach((description) => {
                    customer.assignments.push({
                        employee: {
                            id: employee.id,
                            name: employee.name,
                            cardUrl: employee.shortUrl
                        },
                        startDate: description.startDate,
                        endDate: description.endDate,
                        alert: (customer.name === 'Behöver uppdrag')
                    });
                });
            }
        });

        trelloData.customers.push(customer);
    });

    trelloData.customers.forEach((customer) => {
        customer.maxEndDate = maxEndDate(customer.assignments);
        var date = new Date();
        var startMonth = date.getMonth();
        var year = undefined;
        customer.monthViewStartDate = new Date();
        customer.monthViewEndDate = new Date();
        customer.monthViewEndDate.setMonth(customer.monthViewEndDate.getMonth() + 11);
        customer.monthViewAssignment = [];

        for (var i = 0; i < 12; i++) {
            var month = i + startMonth;
            if (month > 11) {
                if (!year) {
                    year = date.getFullYear() + 1;
                }
                date.setFullYear(year, month - 12);
            } else {
                date.setMonth(month);
            }
            customer.monthViewAssignment.push(hasAssignment(customer, date));
        }
    });

    trelloData.customers.sort(byNoAssignmentFirstAndEndDate);

    employeeCards.forEach((employeeCard) => {
        let employee = {
            id: employeeCard.id,
            name: employeeCard.name,
            cardUrl: employeeCard.shortUrl,
            assignments: []
        };

        trelloData.customers.forEach((customer) => {
            employee.assignments.push(
                ...customer.assignments.filter(
                    (assignment) => assignment.employee.id === employee.id
                ).map((item) => ({
                    customer: {
                        id: customer.id,
                        name: customer.name,
                        cardUrl: customer.shortUrl
                    },
                    startDate: item.startDate,
                    endDate: item.endDate,
                    alert: item.alert
                }))
            );
        });

        trelloData.employees.push(employee);
    });

    return trelloData;
}

byNoAssignmentFirstAndEndDate = (c1, c2) => {
    if (c1.status == 'Aktiv' && c2.status == 'Aktiv') {
        var m1 = c1.maxEndDate;
        var m2 = c2.maxEndDate;

        if (m1 && m2) {
            return m1.getTime() - m2.getTime();
        }
        if (m1) {
            return -1;
        }
        return 1;
    }
    if (c1.status == 'Aktiv') {
        if (c2.status == 'Tjänstledig') {
            return -1;
        }
        return 1;
    }
    if (c1.status == 'Tjänstledig') {
        return 1;
    }
    return -1;
};

maxEndDate = (projects) => {
    var max;
    projects.forEach(function (p) {
        if (p.endDate) {
            if (!max) {
                max = new Date(p.endDate);
            } else if (max.getTime() < new Date(p.endDate).getTime()) {
                max = new Date(p.endDate);
            }
        }
    });
    return max;
};

prefixZero = (num) => {
    if (num < 10) {
        return '0' + num;
    }
    return '' + num;
};

noAssignment = (date) => {
    return {
        hasAssignment: false,
        yearMonth: date.getFullYear() + '-' + prefixZero(date.getMonth() + 1)
    };
};

hasAssignment = (customer, date) => {
    if (!customer.assignments || customer.assignments.length == 0) {
        return noAssignment(date);
    }
    var hasAssignment = noAssignment(date);
    for (var i = 0; i < customer.assignments.length; i++) {
        var assignment = customer.assignments[i];
        var start = assignment.startDate && new Date(assignment.startDate);
        var end = assignment.endDate && new Date(assignment.endDate);
        if (start && end) {
            hasAssignment.hasAssignment = date.getTime() >= start.getTime() && date.getTime() <= end.getTime();
        } else if (start) {
            hasAssignment.hasAssignment = date.getTime() >= start.getTime();
        } else if (end) {
            hasAssignment.hasAssignment = date.getTime() <= end.getTime();
        } else {
            // both start and end is null means forever
            hasAssignment.hasAssignment = true;
        }
        if (hasAssignment.hasAssignment) {
            hasAssignment.project = assignment;
            hasAssignment.yearMonth = date.getFullYear() + '-' + prefixZero(date.getMonth() + 1);
            break;
        }
    };
    return hasAssignment;
};

parseCardDescription = (text) => {
    var elements = text.split('\n');
    var result = {};

    elements.forEach((e) => {
        var n = e.indexOf('-');

        if (n != -1) {
            var name = e.substring(0, n).trim();
            var dateSpec = e.substring(n + 1).trim();
            var n = dateSpec.indexOf(' - ');

            var endDate = null;
            var startDate = null;

            if (n == -1) {
                endDate = dateSpec;
            } else {
                startDate = dateSpec.substring(0, n).trim();
                endDate = dateSpec.substring(n + 3).trim();
            }

            if (result[name]) {
                result[name].push({ startDate: startDate, endDate: endDate });
            } else {
                result[name] = [{ startDate: startDate, endDate: endDate }];
            }
        }
    })

    return result;
};