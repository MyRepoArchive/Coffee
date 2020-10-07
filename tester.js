const activities = require('./src/controllers/activities');

activities().then(response => {
  console.log(response);
});