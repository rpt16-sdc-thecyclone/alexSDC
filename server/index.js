
const PORT = process.env.PORT || 3004;
//const app = require('./app.js');
const app = require('./app1.js');

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
