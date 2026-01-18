const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');

async function createHistoryTables() {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Connected to database for history tables migration...');

        const pages = [
            'home', 'product', 'service', 'location', 'industry',
            'parts', 'blogs', 'events', 'news', 'case_study',
            'about', 'career', 'contact', 'faq'
        ];

        for (const page of pages) {
            const tableName = `${page}_pages`; // e.g. home_pages, about_pages
            console.log(`Creating table: ${tableName}...`);

            const query = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          page_section VARCHAR(100),
          content_data JSON,
          action_type VARCHAR(20) DEFAULT 'UPDATE',
          edited_by_user_id INT,
          edited_by_username VARCHAR(100),
          edited_by_role VARCHAR(50),
          edited_at_date DATE,
          edited_at_time TIME,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (edited_by_user_id) REFERENCES users(id) ON DELETE SET NULL,
          INDEX idx_edited_at (edited_at_date, edited_at_time)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `;

            await connection.query(query);
            console.log(`✓ Table ${tableName} created/verified.`);
        }

        console.log('All history tables created successfully.');
    } catch (error) {
        console.error('Error creating history tables:', error);
        process.exit(1);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

createHistoryTables();
