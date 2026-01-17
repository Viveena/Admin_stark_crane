
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

// Fallback if .env in server/ isn't sufficient or if running from root
if (!process.env.DB_HOST) {
    dotenv.config({ path: path.join(__dirname, '.env') });
}

async function reproduce() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'stark_crane_admin',
    });

    console.log('Connected.');
    
    const user = {
        full_name: 'Test Pending User',
        username: 'testpending_' + Date.now(),
        email: 'testpending_' + Date.now() + '@example.com',
        password: 'password123',
        role_id: 2, // Admin usually
        status: 'pending' // This triggers the error
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
    if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD' || error.message.includes('pending')) {
        console.log('SUCCESS: Issue Reproduced.');
    } else {
        console.log('FAILURE: Different error occurred.');
    }
  } finally {
    if (connection) await connection.end();
  }
}

reproduce();
