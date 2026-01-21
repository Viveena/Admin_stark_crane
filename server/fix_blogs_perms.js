const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stark_admin_db',
};

async function fixBlogsPermissions() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        console.log('Updating permissions for page_key="blogs"...');
        // Setting can_read and can_create to 1 for all roles
        const [result] = await connection.query(
            'UPDATE role_permissions SET can_read = 1, can_create = 1 WHERE page_key = "blogs"'
        );
        console.log(`Updated ${result.changedRows} rows.`);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

fixBlogsPermissions();
