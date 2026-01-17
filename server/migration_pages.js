const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');

const migratePages = async () => {
    try {
        console.log('Starting pages migration...');

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

        for (const pageTitle of pages) {
            const pageKey = slugify(pageTitle);

            // Check if page exists
            const [existing] = await db.query('SELECT id FROM pages WHERE page_key = ?', [pageKey]);

            if (existing.length === 0) {
                console.log(`Seeding page: ${pageTitle} (${pageKey})`);
                await db.query(
                    'INSERT INTO pages (page_key, title) VALUES (?, ?)',
                    [pageKey, pageTitle]
                );
            } else {
                console.log(`Page already exists: ${pageTitle}`);
            }
        }

        console.log('Pages migration completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Pages migration failed:', error);
        process.exit(1);
    }
};

migratePages();
