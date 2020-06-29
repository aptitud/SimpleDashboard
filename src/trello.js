const trelloHelper = require('./trello-helper.js');

module.exports.getTrelloData = async () => {
    const employeeCards = await trelloHelper.getEmployeeCards(),
        customerCards = await trelloHelper.getCustomerCards();

    return parseData(employeeCards, customerCards);
}

const parseData = (employeeCards, customerCards) => {
    let trelloData = {
        employees: [],
        customers: []
    };

    customerCards.forEach((customerCard) => {
        let customer = {
            name: customerCard.name,
            cardUrl: customerCard.shortUrl,
            assignments: []
        };
        const customerCardDescriptions = parseCardDescription(customerCard.desc);

        customerCard.idMembers.forEach((memberId) => {
            const employee = employeeCards.find((employee) => employee.idMembers[0] === memberId);
            const descriptionForEmployee = (employee && customerCardDescriptions[employee.name]) || [];

            descriptionForEmployee.forEach((description) => {
                customer.assignments.push({
                    employee: {
                        id: employee.idMembers[0],
                        name: employee.name,
                        cardUrl: employee.shortUrl
                    },
                    startDate: description.startDate,
                    endDate: description.endDate,
                    alert: (customer.name === 'Behöver uppdrag')
                });
            });
        });

        customer.maxEndDate = maxEndDate(customer);
        setMonthlyView(customer.assignments);

        trelloData.customers.push(customer);
    });

    employeeCards.forEach((employeeCard) => {
        let employee = {
            id: employeeCard.idMembers[0],
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
                        name: customer.name,
                        cardUrl: customer.cardUrl
                    },
                    startDate: item.startDate,
                    endDate: item.endDate,
                    alert: item.alert
                }))
            );
        });

        employee.assignments.sort(sortByStartDate);

        employee.assignments = setEmployeeAssignmentOverview(employee.assignments);

        trelloData.employees.push(employee);
    });

    trelloData.customers.sort(sortByNoAssignmentThenEndDate);

    return trelloData;
}

const setEmployeeAssignmentOverview = (assignments) => {
    const arrangedAssignments = [];
    let filledCols = 0;

    assignments.forEach((assignment, index) => {
        const monthlyDate = new Date(),
            startMonth = monthlyDate.getMonth();

        let year = undefined;
        assignment.colSpan = 0;

        let preAssignmentCols = 0;

        for (let i = 0; i < 12; i++) {
            let month = i + startMonth;
            if (month > 11) {
                if (!year) {
                    year = monthlyDate.getFullYear() + 1;
                }
                monthlyDate.setFullYear(year, month - 12);
            } else {
                monthlyDate.setMonth(month);
            }

            if (getEmployeeAssignmentColSpan(assignment, monthlyDate)) {
                assignment.colSpan++;
            } else if (assignment.colSpan === 0) {
                preAssignmentCols++;
            }
        }

        if (preAssignmentCols - filledCols > 0) {
            arrangedAssignments.push({
                colSpan: preAssignmentCols - filledCols,
                alert: false
            });
        }

        arrangedAssignments.push(assignment);

        filledCols = assignment.colSpan + preAssignmentCols;
    });

    if (filledCols > 0 && filledCols < 12) {
        arrangedAssignments.push({
            colSpan: 12 - filledCols,
            alert: false
        });
    }

    return arrangedAssignments;
}

const getEmployeeAssignmentColSpan = (assignment, monthlyDate) => {
    let hasAssignment = false;

    const start = assignment.startDate && new Date(assignment.startDate);
    const end = assignment.endDate && new Date(assignment.endDate);

    if (start && end) {
        hasAssignment = monthlyDate.getTime() >= start.getTime() && monthlyDate.getTime() <= end.getTime();
    } else if (start) {
        hasAssignment = monthlyDate.getTime() >= start.getTime();
    } else if (end) {
        hasAssignment = monthlyDate.getTime() <= end.getTime();
    } else {
        // both start and end is null means forever
        hasAssignment = true;
    }

    return hasAssignment;
};

const setMonthlyView = (assignments) => {
    assignments.forEach((assignment) => {
        const monthlyDate = new Date(),
            startMonth = monthlyDate.getMonth();

        let year = undefined;

        assignment.monthViewAssignment = [];

        for (var i = 0; i < 12; i++) {
            let month = i + startMonth;
            if (month > 11) {
                if (!year) {
                    year = monthlyDate.getFullYear() + 1;
                }
                monthlyDate.setFullYear(year, month - 12);
            } else {
                monthlyDate.setMonth(month);
            }
            assignment.monthViewAssignment.push(getMonthView(assignment, monthlyDate));
        }
    });
}

const getMonthView = (assignment, monthlyDate) => {
    const monthView = { hasAssignment: false };

    const start = assignment.startDate && new Date(assignment.startDate);
    const end = assignment.endDate && new Date(assignment.endDate);

    if (start && end) {
        monthView.hasAssignment = monthlyDate.getTime() >= start.getTime() && monthlyDate.getTime() <= end.getTime();
    } else if (start) {
        monthView.hasAssignment = monthlyDate.getTime() >= start.getTime();
    } else if (end) {
        monthView.hasAssignment = monthlyDate.getTime() <= end.getTime();
    } else {
        // both start and end is null means forever
        monthView.hasAssignment = true;
    }

    return monthView;
};

const sortByStartDate = (a, b) => {
    return new Date(a.startDate) > new Date(b.startDate) ? 1 : -1;
};

const sortByNoAssignmentThenEndDate = (a, b) => {
    if (a.name === 'Behöver uppdrag') {
        return -1;
    }
    if (b.name === 'Behöver uppdrag') {
        return 1;
    }
    if (a.maxEndDate) {
        return b.maxEndDate ? a.maxEndDate.getTime() - b.maxEndDate.getTime() : -1;
    }
    return 1;
};

const maxEndDate = (customer) => {
    var max;
    customer.assignments.forEach(function (p) {
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

const parseCardDescription = (text) => {
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