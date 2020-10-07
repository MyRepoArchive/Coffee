const ActivitiesController = require('./src/controllers/ActivitiesController');
const cache = require('./src/utils/cache');

let i = 0;
const interval = setInterval(() => {
  ActivitiesController.activities().then(response => {
    console.log(response, cache);
  });
  i++
  if(i >= 3) clearInterval(interval);
}, 1000);