'use strict';

const http = require('http');

const host = 'api.worldweatheronline.com';
const wwoApiKey = 'ddfe5eea5dd8443dadd220345183105';

exports.callWeatherApi = (city, date) => {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = `/premium/v1/weather.ashx?format=json&num_of_days=1` +
    `&q=${encodeURIComponent(city)}&key=${wwoApiKey}&date=${date}`;
    
    console.log('API Request: ' + host + path);

    // Make the HTTP request to get the weather
    http.get({ host, path }, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        try {
            // After all the data has been received parse the JSON for desired data
            let response = JSON.parse(body);
            let forecast = response['data']['weather'][0];
            let location = response['data']['request'][0];
            let conditions = response['data']['current_condition'][0];
            let currentConditions = conditions['weatherDesc'][0]['value'];
    
            // Create response
            let output = `Current conditions in the ${location['type']} 
            ${location['query']} are ${currentConditions} with a projected high of
            ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
            ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
            ${forecast['date']}.`;
    
            // Resolve the promise with the output text
            resolve(output);
        } catch(error) {
            reject(new Error(`Error calling the weather API: ${error}`))
        }
      });
      res.on('error', (error) => {
        console.log(`Error calling the weather API: ${error}`)
        reject(new Error(`I don't know the weather but I hope it's good!`));
      });
    });
  });
};
    
