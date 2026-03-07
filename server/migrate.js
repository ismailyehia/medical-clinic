const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { sequelize } = require('./models');

sequelize.sync({ alter: true })
    .then(() => { console.log('Tables updated!'); process.exit(0); })
    .catch(e => { console.error(e.message); process.exit(1); });
