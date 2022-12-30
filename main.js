const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const getCityNames = async () => {
	try {
		const { data } = await axios.get(
			'http://www.citymayors.com/statistics/largest-cities-alphabetical.html'
		);
		
		// jQuery like syntax
		const $ = cheerio.load(data);
		let cityNames = [];

		$('html body div font table tbody tr td table tbody tr td font b').each((_idx, el) => {
			const name = $(el).text()
			cityNames.push(name)
		});

		// filter out strings that contain a number 
		cityNames = cityNames.filter((el) => /\d/.test(el) ? false : true)
		
		// deleting the column names
		cityNames.splice(3,1);
		cityNames.splice(2,1);
		cityNames.splice(0,1);
		cityNames.splice(0,1);

		cityNames = cityNames.map(el => {
			let idx = el.indexOf('(')
			if(idx != -1){
				let newStr = el.replace('(', '/ ')
				newStr = newStr.replace(')', '')
				return newStr[0].toUpperCase() + newStr.substring(1, idx).toLowerCase() + newStr.substring(idx)
			} else {
				return el[0].toUpperCase() + el.substring(1).toLowerCase()				
			}
		})
		return cityNames;

	} catch (error) {
		throw error;
	}
};

getCityNames()
    .then((cityNames) => {
    	let json = JSON.stringify(cityNames)
    	fs.writeFile('cities.json', json, 'utf8', function (err) {
		    if (err) {
				console.log("An error occured while writing JSON Object to File.");
		        return console.log(err);
	        } 
	        console.log("JSON file has been saved.");
		});
	});
