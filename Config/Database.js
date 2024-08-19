const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

class Database {
    constructor() {
        this.pool = mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
            waitForConnections: true,
            connectionLimit: process.env.CONNECTION_LIMIT, // Adjust based on traffic and load testing
            queueLimit: 0,
            // acquireTimeout: process.env.ACQUIRED_TIMEOUT, // 30 seconds
            // connectionTimeout: process.env.CONNECTION_TIMEOUT, // 10 seconds
            // ssl: {
            //   rejectUnauthorized: true,
            //   ca: fs.readFileSync(__dirname + '/mysql-ca-cert.pem') // Adjust the path to the SSL certificate
            // }
        });

        this.pool.on('connection', (connection) => {
            console.log('New connection established with ID:', connection.threadId);
        });

        this.pool.on('acquire', (connection) => {
            console.log('Connection %d acquired', connection.threadId);
        });

        this.pool.on('release', (connection) => {
            console.log('Connection %d released', connection.threadId);
        });
    }

    async query(sql, params) {
        const [rows, fields] = await this.pool.execute(sql, params);
        return rows;
    }
}

module.exports = new Database();
