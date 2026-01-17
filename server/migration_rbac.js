const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');

const migrate = async () => {
    try {
        console.log('Starting migration...');

        // Drop user_permissions if it exists (cleanup)
        // Drop role_permissions table
        console.log('Dropping role_permissions table...');
        await db.query('DROP TABLE IF EXISTS role_permissions');

        // Recreate role_permissions table
        console.log('Creating role_permissions table...');
        await db.query(`
      CREATE TABLE role_permissions (
        role_id INT NOT NULL,
        page_key VARCHAR(100) NOT NULL,
        can_read BOOLEAN DEFAULT FALSE,
        can_create BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (role_id, page_key),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        INDEX idx_role_id (role_id),
        INDEX idx_page_key (page_key)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

        // Seed SUPER_ADMIN permissions (Optional but helpful)
        // Tagging all known pages for Super Admin ID 1 (Assuming ID 1 is Super Admin)
        const pages = [
            'Home Page', 'Products', 'Service', 'Location', 'Industry', 'Parts',
            'Blogs', 'News', 'Events', 'Case Study', 'About Us', 'Career',
            'Contact', 'FAQ', 'Crane Selector', 'Other Pages'
        ];

        // Slugify function
        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')     // Replace spaces with -
                .replace(/[^\w\-]+/g, '') // Remove all non-word chars
                .replace(/\-\-+/g, '-');  // Replace multiple - with single -
        };

        console.log('Seeding SUPER_ADMIN permissions...');
        const superAdminId = 1;
        // Check if role 1 exists
        const [roles] = await db.query('SELECT id FROM roles WHERE id = ?', [superAdminId]);
        if (roles.length > 0) {
            const values = pages.map(page => [superAdminId, slugify(page), true, true]);
            await db.query(
                'INSERT INTO role_permissions (role_id, page_key, can_read, can_create) VALUES ?',
                [values]
            );
        }

        console.log('Migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrate();
