
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

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

        // Get an existing user ID (admin/superadmin)
        const [users] = await connection.query('SELECT id, username FROM users LIMIT 1');
        let creatorId = null;
        if (users.length > 0) {
            creatorId = users[0].id;
            console.log(`Found existing user with ID: ${creatorId} (${users[0].username})`);
        } else {
            console.log('No users found in DB per se. This might be the issue if created_by is used.');
        }

        const user = {
            full_name: 'Test Creator User',
            username: 'testcreate_' + Date.now(),
            email: 'testcreate_' + Date.now() + '@example.com',
            password: 'password123',
            role_id: 2, // Assuming role_id 2 exists
            status: 'pending',
            created_by: creatorId
        };

        console.log('Attempting to insert user with created_by:', creatorId);

        await connection.execute(
            `INSERT INTO users (full_name, username, email, password, role_id, status, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [user.full_name, user.username, user.email, user.password, user.role_id, user.status, user.created_by]
        );

        console.log('User inserted successfully with created_by.');

        // Now try with non-existent creator ID
        const fakeCreatorId = 999999;
        console.log(`Attempting to insert with NON-EXISTENT created_by: ${fakeCreatorId}`);

        const user2 = {
            ...user,
            username: user.username + '_fail',
            email: user.email + '_fail',
            created_by: fakeCreatorId
        };

        try {
            await connection.execute(
                `INSERT INTO users (full_name, username, email, password, role_id, status, created_by) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user2.full_name, user2.username, user2.email, user2.password, user2.role_id, user2.status, user2.created_by]
            );
            console.log('WARNING: Insert with non-existent created_by SUCCESS (This means FK constraint is missing or not enforced!)');
        } catch (err) {
            console.log('Caught EXPECTED error for non-existent created_by:');
            console.log(err.message);
        }

    } catch (error) {
        console.error('Unexpected error:');
        console.error(error);
    } finally {
        if (connection) await connection.end();
    }
}

reproduce();
