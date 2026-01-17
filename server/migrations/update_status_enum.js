
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function migrate() {
    let connection;
    try {
        console.log('Connecting to database...');
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'stark_crane_admin',
        });

        console.log('Connected to ' + process.env.DB_NAME);

        console.log("Updating 'users' table 'status' column to include 'pending'...");

        // Check if pending is already there? No harm in running ALTER again usually, but better safe.
        // However, ENUM changes replace the whole definition.

        await connection.query("ALTER TABLE users MODIFY COLUMN status ENUM('active', 'inactive', 'suspended', 'pending') DEFAULT 'active'");

        console.log('Migration successful: Status ENUM updated.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

migrate();
