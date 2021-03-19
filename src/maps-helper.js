const axios = require('axios');

const config = {
    KEY: 'AIzaSyDwChmJ8Y45tMxQ27HNhLyc7SeohwRqIT8',
};

module.exports.getPositionsFromAddresses = async (employees) => {
    await employees.forEach((employee, i) => {
        if(employee.address && i === 0) {
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(employee.address)}&key=${config.KEY}`).then((result) => {
                console.log(result.data.results[0]);
                
                if(result.data?.results[0]?.geometry?.location) {
                    console.log(result.data.results[0].geometry.location)
                        employee.position = result.data.results[0].geometry.location
                }
            }).catch((error) => {
                console.log(error);
            });
        }
    });

    return employees;
}