const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');

async function seedAllPagesAndPermissions() {
    let connection;
    try {
        connection = await db.getConnection();
        console.log('Connected to database...');

        // Full list from USER REQUEST
        const pagesToSeed = [
            { key: 'home', title: 'Home' },
            { key: 'product', title: 'Product' },
            // { key: 'products', title: 'Products' }, // Consolidated to 'product' usually, but 'products' might be used for list? Checking code later.
            { key: 'service', title: 'Service' },
            { key: 'location', title: 'Location' },
            { key: 'industry', title: 'Industry' },
            { key: 'parts', title: 'Parts' },
            { key: 'blogs', title: 'Blogs' }, // Code often uses 'blog' (singular) or 'blogs' (plural). Seed 'blogs' based on file structure keys usually plural for apps?
            // Wait, file path is apps/blog. Page key might be 'blog'.
            // Let's seed both singular and plural common variants to be safe and avoid 403s.
            { key: 'blog', title: 'Blog' },
            { key: 'events', title: 'Events' },
            { key: 'news', title: 'News' },
            { key: 'case-study', title: 'Case Study' },
            { key: 'about', title: 'About Us' },
            { key: 'career', title: 'Career' },
            { key: 'contact', title: 'Contact' },
            { key: 'faq', title: 'FAQ' }
        ];

        // Get USER role ID
        const [userRoles] = await connection.query('SELECT id FROM roles WHERE name = ?', ['USER']);
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
                // console.log(`= Page already exists: ${page.title} (${page.key})`);
            }

            // 2. Seed Permissions for USER role (Read=1, Create=0)
            // Note: Admin/SuperAdmin have automatic access via middleware bypass.
            if (userRoleId) {
                const [existingPerm] = await connection.query(
                    'SELECT * FROM role_permissions WHERE role_id = ? AND page_key = ?',
                    [userRoleId, page.key]
                );

                if (existingPerm.length === 0) {
                    await connection.query(
                        'INSERT INTO role_permissions (role_id, page_key, can_read, can_create) VALUES (?, ?, ?, ?)',
                        [userRoleId, page.key, 1, 0]
                    );
                    console.log(`  + Granted READ permission to USER for ${page.key}`);
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

seedAllPagesAndPermissions();
