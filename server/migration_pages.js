const dotenv = require('dotenv');
dotenv.config();
const db = require('./config/db');

const migratePages = async () => {
    try {
        console.log('Starting pages migration...');

        const pages = [
            { title: 'Home Page', key: 'home' },
            { title: 'Products', key: 'products' }, // Note: Controller says 'product', but DB has 'products'. Keeping 'products' for now to match DB ID 2.
            { title: 'Service', key: 'service' },
            { title: 'Location', key: 'location' },
            { title: 'Industry', key: 'industry' },
            { title: 'Parts', key: 'parts' },
            { title: 'Blogs', key: 'blogs' },
            { title: 'News', key: 'news' },
            { title: 'Events', key: 'events' },
            { title: 'Case Study', key: 'case-study' }, // Keeping case-study to match DB ID 10
            { title: 'About Us', key: 'about' },
            { title: 'Career', key: 'career' },
            { title: 'Contact', key: 'contact' },
            { title: 'FAQ', key: 'faq' },
            { title: 'Crane Selector', key: 'crane-selector' },
            { title: 'Other Pages', key: 'other-pages' }
        ];

        // Slugify function (kept for reference or fallback if needed, but not used for key generation anymore)
        const slugify = (text) => {
            return text
                .toString()
                .toLowerCase()
                .trim()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-');
        };

        for (const page of pages) {
            // Use explicit key if provided, else slugify title (for legacy/future flexibility)
            const pageKey = page.key || slugify(page.title);
            const pageTitle = page.title;

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
