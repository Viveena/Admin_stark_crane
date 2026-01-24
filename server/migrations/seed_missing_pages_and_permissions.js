const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');

async function seedMissingPagesAndPermissions() {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Connected to database...');

        const pagesToSeed = [
            { key: 'product', title: 'Product' },
            { key: 'products', title: 'Products' }, // adding plural just in case
            { key: 'blogs', title: 'Blogs' },
            { key: 'events', title: 'Events' },
            { key: 'news', title: 'News' },
            { key: 'case-study', title: 'Case Study' }
        ];

        // Get USER role ID
        const [userRoles] = await connection.query('SELECT id FROM roles WHERE name = ?', ['USER']);
        if (userRoles.length === 0) {
            console.warn('USER role not found, skipping permission seeding for USER');
        }
        const userRoleId = userRoles.length > 0 ? userRoles[0].id : null;

        console.log('Seeding pages and permissions...');

        for (const page of pagesToSeed) {
            // 1. Seed Page
            const [existingPage] = await connection.query(
                'SELECT id FROM pages WHERE page_key = ?',
                [page.key]
            );

            if (existingPage.length === 0) {
                await connection.query(
                    'INSERT INTO pages (page_key, title) VALUES (?, ?)',
                    [page.key, page.title]
                );
                console.log(`+ Created page: ${page.title} (${page.key})`);
            } else {
                console.log(`= Page already exists: ${page.title} (${page.key})`);
            }

            // 2. Seed Permissions for USER role (View only)
            if (userRoleId) {
                const [existingPerm] = await connection.query(
                    'SELECT * FROM role_permissions WHERE role_id = ? AND page_key = ?',
                    [userRoleId, page.key]
                );

                if (existingPerm.length === 0) {
                    // Default to can_read=1, can_create=0 for USER
                    await connection.query(
                        'INSERT INTO role_permissions (role_id, page_key, can_read, can_create) VALUES (?, ?, ?, ?)',
                        [userRoleId, page.key, 1, 0]
                    );
                    console.log(`  + Granted READ permission to USER for ${page.key}`);
                } else {
                    console.log(`  = Permission already exists for USER on ${page.key}`);
                }
            }
        }

        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding pages/permissions:', error);
    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}

seedMissingPagesAndPermissions();
