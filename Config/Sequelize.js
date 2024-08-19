// Sequelize.js
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: 3308,
    dialect: 'mysql',
    pool: {
        max: parseInt(process.env.CONNECTION_LIMIT, 10) || 10, // Use your connection limit from environment variables
        min: 0,
        acquire: parseInt(process.env.ACQUIRE_TIMEOUT, 10) || 30000, // 30 seconds
        idle: 10000 // 10 seconds
    },
    logging: false, // Disable logging; default: console.log
    // dialectOptions: {
    //     ssl: {
    //         rejectUnauthorized: true,
    //         ca: fs.readFileSync(__dirname + '/mysql-ca-cert.pem') // Path to your SSL certificate
    //     }
    // }
});

const connectDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

const syncDb = async () => {
    sequelize.sync({ force: false })
        .then(() => {
            console.log('Database & tables created!');
        })
        .catch(error => console.error('Error syncing database:', error));    
}
module.exports = { sequelize, connectDb, syncDb };
