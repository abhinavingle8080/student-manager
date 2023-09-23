
const express = require('express');
const sequelize = require('../config/database');
const studentRouter = require('../routes/studentRouter');

const app = express();

sequelize.sync()
    .then(() => {
        console.log('Database synced');
    })
    .catch((error) => {
        console.error('Error syncing database:', error);
    });

app.use(express.json());

app.use('/api', studentRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




