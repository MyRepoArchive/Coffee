const ActivitiesController = require('./src/controllers/ActivitiesController');

ActivitiesController.activities().then(response => {
  console.log(response);
});