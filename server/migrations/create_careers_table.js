
const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');

async function createCareersTable() {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Connected to database...');

        console.log('Creating careers table...');

        // Table for Job Postings
        await connection.query(`
      CREATE TABLE IF NOT EXISTS careers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        job_title VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        salary VARCHAR(100),
        category VARCHAR(100),
        job_type VARCHAR(100),
        description TEXT,
        status ENUM('Active', 'Inactive') DEFAULT 'Active',
        slug VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_status (status),
        INDEX idx_category (category)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        console.log('✓ Table careers created/verified.');

    } catch (error) {
        console.error('Error creating table:', error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

createCareersTable();
