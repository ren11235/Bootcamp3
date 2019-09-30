var config = require('../config/config'), 
    request = require('request');

const opencage = require('opencage-api-client');



module.exports = function(req, res, next) {
  if(req.body.address) {
      //This code just formats the address so that it doesn't have space and commas using escape characters
      var addressTemp = req.body.address;
      var addressTemp2 = addressTemp.toLowerCase();
      var addressTemp3 = addressTemp2.replace(/\s/g, "%20");
      var addressTemp4 = addressTemp3.replace(/,/g , "%2C");
      
    //Setup your options q and key are provided. Feel free to add others to make the JSON response less verbose and easier to read 
    var options = { 
      q: addressTemp4,
      key: config.openCage.key,  
    }

    //Setup your request using URL and options - see ? for format
    request({
      url: 'https://api.opencagedata.com/geocode/v1/json', 
      qs: options
      }, 
      function(error, response, body) {
        return new Promise(function (resolve, reject) {
          setTimeout(()=>{
          console.log(req.body);
          opencage.geocode(options).then(data => {
            if (data.status.code == 200) {
              if (data.results.length > 0) {
                var place = data.results[0];
                req.results = place.geometry;
                console.log(req.results);
              }
            } else if (data.status.code == 402) {
              console.log('hit free-trial daily limit');
              console.log('become a customer: https://opencagedata.com/pricing'); 
            } else {
              // other possible response codes:
              // https://opencagedata.com/api#codes
              console.log('error', data.status.message);
            }
          }).catch(error => {
            console.log('error', error.message);
          });
          resolve(req.results)

          //For ideas about response and error processing see https://opencagedata.com/tutorials/geocode-in-nodejs
          
          //JSON.parse to get contents. Remember to look at the response's JSON format in open cage data
          
          /*Save the coordinates in req.results -> 
            this information will be accessed by listings.server.model.js 
            to add the coordinates to the listing request to be saved to the database.

            Assumption: if we get a result we will take the coordinates from the first result returned
          */
          //  req.results = stores you coordinates
          next();
        }, 2000);
      });
      });
    
  } else {
    next();
  }
};  