const axios = require('axios');

const config = {
    KEY: 'AIzaSyDwChmJ8Y45tMxQ27HNhLyc7SeohwRqIT8',
};

module.exports.getPositionsFromAddresses = async (employees = []) => {
	const promises = [];
	const employeesWithAddress = employees.filter((employee) => employee.address);

	employeesWithAddress.forEach((employee) => {
		promises.push(axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(employee.address)}&key=${config.KEY}`));
	});

	await Promise.all(promises).then((results) => {
		results.forEach((result, i) => {
			if(result.data?.results[0]?.geometry?.location) {
				employeesWithAddress[i].position = result.data.results[0].geometry.location;
			}
		});

	}).catch((error) => {
		console.log(error);
	});

	return employees;
}