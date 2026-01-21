const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'stark_admin_db',
};

async function checkBlogs() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check permissions
        console.log('Checking permissions for "blogs"...');
        const [perms] = await connection.query('SELECT * FROM role_permissions WHERE page_key = "blogs"');
        console.log('Permissions:', perms);

        // Check table
        console.log('Checking table "blogs_pages"...');
        try {
            const [rows] = await connection.query('DESCRIBE blogs_pages');
            console.log('Table structure:', rows);
        } catch (e) {
            console.log('Table blogs_pages does not exist or error:', e.message);
        }

        await connection.end();
    } catch (error) {
        console.error('Error:', error);
    }
}

checkBlogs();
