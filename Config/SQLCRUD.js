
const db = require('./Database');

export class database {

    pool = db.pool;

    constructor() { }

    async createTable(table, createTableQuery) {
        const connection = await pool.getConnection();
        try {
            // Check if table exists
            const checkTableExistsQuery = `SELECT COUNT(*) AS count FROM information_schema.tables WHERE table_schema = ? AND  table_name = ?`;
            const [results] = await connection.execute(checkTableExistsQuery, [db.dbName, table]);
            const tableExists = results[0].count > 0;

            if (!tableExists) {
                console.log(`Table ${table} does not exist, creating...`);
                await connection.execute(createTableQuery); // Ensure createTableQuery is properly defined
                console.log(`Table ${table} created successfully`);
            }
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }

    async insertData(table, data) {
        const connection = await pool.getConnection();
        try {
            // Extract column names and values from the data object
            const columns = Object.keys(data);
            const values = Object.values(data);

            // Handle INET6_ATON for IP address if included in data
            const insertColumns = columns.map(col => col).join(', ');
            const placeholders = columns.map(col => col === 'ip' ? `INET6_ATON(${col})` : col).join(', ');
            // const placeholders = columns.map(col => '?').join(', ');

            // Build the complete insert query string
            const insertQuery = `INSERT INTO ${table} (${insertColumns}) VALUES (${placeholders})`;

            // Execute the insert query with the values array
            const [result] = await connection.execute(insertQuery, values);

            console.log('Data inserted successfully', result);
            const newId = result.insertId;
            return { id: newId, ...data };
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }

    async readBy(table, columns = ['*'], conditions, logic = 'AND') {
        const connection = await pool.getConnection();
        try {
            // Validate the logic type
            if (logic !== 'AND' && logic !== 'OR') {
                throw new Error("Invalid logic type. Use 'AND' or 'OR'.");
            }

            // Extract column names and values from the conditions object
            const conditionColumns = Object.keys(conditions);
            const conditionValues = Object.values(conditions);

            // Construct the WHERE clause dynamically
            const whereClause = conditionColumns.map((column) => `${column} = ?`).join(` ${logic} `);

            // Handle INET6_NTOA for IP address if included in columns
            const selectColumns = columns.map(col => col === 'ip' ? 'INET6_NTOA(ip) AS ip' : col).join(', ');

            // Build the complete query string
            const query = `SELECT ${selectColumns} FROM ${table} WHERE ${whereClause}`;

            // Execute the query with the values array
            const [rows] = await connection.execute(query, conditionValues);

            // Return the rows found, or an empty array if no rows are found
            return rows;
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }

    async updateBy(table, updateValues, conditions, logic = 'AND') {
        const connection = await pool.getConnection();
        try {
            // Validate the logic type
            if (logic !== 'AND' && logic !== 'OR') {
                throw new Error("Invalid logic type. Use 'AND' or 'OR'.");
            }

            // Extract column names and values from the updateValues object
            const updateColumns = Object.keys(updateValues);
            const updateVals = Object.values(updateValues);

            // Construct the SET clause dynamically
            const setClause = updateColumns.map((column) => `${column} = ?`).join(', ');

            // Extract column names and values from the conditions object
            const conditionColumns = Object.keys(conditions);
            const conditionVals = Object.values(conditions);

            // Construct the WHERE clause dynamically
            const whereClause = conditionColumns.map((column) => `${column} = ?`).join(` ${logic} `);

            // Combine update values and condition values for parameterized query
            const values = [...updateVals, ...conditionVals];

            // Build the complete query string
            const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

            // Execute the query with the combined values array
            const [result] = await connection.execute(query, values);

            // Return the result
            return result;
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }

    async countRowsBy(table, column = '*', conditions, logic = 'AND', returns = 'number') {
        const connection = await pool.getConnection();
        try {
            // Validate the logic type
            if (logic !== 'AND' && logic !== 'OR') {
                throw new Error("Invalid logic type. Use 'AND' or 'OR'.");
            }

            // Extract column names and values from the conditions object
            const conditionColumns = Object.keys(conditions);
            const conditionValues = Object.values(conditions);

            // Construct the WHERE clause dynamically
            const whereClause = conditionColumns.map((col) => `${col} = ?`).join(` ${logic} `);

            // Build the complete query string
            const query = `SELECT COUNT(${column}) AS count FROM ${table} WHERE ${whereClause}`;

            // Execute the query with the values array
            const [rows] = await connection.execute(query, conditionValues);

            // Return the count or a boolean value
            if (returns === 'boolean') {
                return rows[0].count > 0;
            } else {
                return rows[0].count;
            }
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }

    async deleteRowsBy(table, conditions, logic = 'AND') {
        const connection = await pool.getConnection();
        try {
            // Validate the logic type
            if (logic !== 'AND' && logic !== 'OR') {
                throw new Error("Invalid logic type. Use 'AND' or 'OR'.");
            }

            // Extract column names and values from the conditions object
            const columns = Object.keys(conditions);
            const values = Object.values(conditions);

            // Construct the WHERE clause dynamically
            const whereClause = columns.map((column) => `${column} = ?`).join(` ${logic} `);

            // Build the complete query string
            const query = `DELETE FROM ${table} WHERE ${whereClause}`;

            // Execute the query with the values array
            const [result] = await connection.execute(query, values);

            // Return the result object containing affectedRows
            return { affectedRows: result.affectedRows };
        } catch (err) {
            throw err;
        } finally {
            connection.release();
        }
    }
}
