const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stark_admin_db',
};

async function checkPermissions() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check roles
        const [roles] = await connection.query('SELECT * FROM roles');
        console.log('Roles:', roles);

        // Check permissions for 'product'
        const [perms] = await connection.query('SELECT * FROM role_permissions WHERE page_key = "product"');
        console.log('Permissions for "product":', perms);

        // Check all page keys to see if "product" exists or maybe it's named differently
        const [keys] = await connection.query('SELECT DISTINCT page_key FROM role_permissions');
        console.log('Available Page Keys:', keys.map(k => k.page_key));

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkPermissions();
