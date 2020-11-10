const api = require('./src/services/api');

api.get('/inventory', { ids: [] }).then(response => console.log(response.data), e => console.log(e))