const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stark_admin_db',
};

async function fixAllPermissions() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        console.log('Updating permissions for ALL pages...');
        // Set can_read and can_create to 1 for ALL rows in role_permissions
        const [result] = await connection.query(
            'UPDATE role_permissions SET can_read = 1, can_create = 1'
        );
        console.log(`Updated ${result.changedRows} rows. All pages should now be accessible.`);

        // Verification step
        const [rows] = await connection.query('SELECT DISTINCT page_key, can_read, can_create FROM role_permissions LIMIT 10');
        console.log('Sample of updated permissions:', rows);

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

fixAllPermissions();
