
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

async function reproduce() {
    let connection;
    try {
        console.log('Connecting to database...');
        // Log env vars (partial secure)
        console.log('DB Config:', {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            database: process.env.DB_NAME
        });

        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'stark_crane_admin',
        });

        console.log('Connected.');

        // Check current ENUM values via query if possible, or just try insert
        // SHOW COLUMNS FROM users LIKE 'status'
        const [columns] = await connection.query("SHOW COLUMNS FROM users LIKE 'status'");
        console.log('Current Status Column Type:', columns[0].Type);

        const user = {
            full_name: 'Test Pending User',
            username: 'testpending_' + Date.now(),
            email: 'testpending_' + Date.now() + '@example.com',
            password: 'password123',
            role_id: 2,
            status: 'pending'
        };

        console.log('Attempting to insert user with status: pending');

        await connection.execute(
            `INSERT INTO users (full_name, username, email, password, role_id, status) 
       VALUES (?, ?, ?, ?, ?, ?)`,
            [user.full_name, user.username, user.email, user.password, user.role_id, user.status]
        );

        console.log('User inserted successfully (Unexpected if bug exists).');

    } catch (error) {
        console.log('Caught expected error:');
        console.error(error.message);
        if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || error.message.includes('pending') || error.message.includes('enums')) {
            console.log('SUCCESS: Issue Reproduced.');
        } else {
            console.log('FAILURE: Different error occurred.');
        }
    } finally {
        if (connection) await connection.end();
    }
}

reproduce();
