const axios = require('axios');

const config = {
    KEY: 'f0bc8bfd0f2215a643266ab274148cff',
    TOKEN: 'f14018afff82af6ac254e1876464524f1c140e8db188327db90af7eee8332af9',
//    EMPLOYEES_BOARD_ID: '9B3W8QYa',
    EMPLOYEES_LIST_ID: '4facbfa881997b1a500469ee',
    STATUS_BOARD_ID: 'IyKmEaxe',
    ASSIGNMENTS_LIST_ID: '54b39b033116e865c9a4a3f1'
};

const urlOf = resource => {
    return `https://trello.com/1/${resource}?key=${config.KEY}&token=${config.TOKEN}`;
};

module.exports.getCustomerCards = async () => {
    let customerCards;

    await axios.get(urlOf(`lists/${config.ASSIGNMENTS_LIST_ID}/cards`)).then((result) => {
        customerCards = result.data;
    }).catch((error) => {
        console.log(error);
    });

    return customerCards;
}

module.exports.getEmployeeCards = async () => {
    let employeeCards;

    await axios.get(urlOf(`lists/${config.EMPLOYEES_LIST_ID}/cards`)).then((result) => {
        employeeCards = result.data;
    }).catch((error) => {
        console.log(error);
    });

    return employeeCards;
}