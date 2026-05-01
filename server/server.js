const app = require('./src/app');
require('dotenv').config();

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
    console.log(` Server ${PORT} portunda aktivdir!`);
});