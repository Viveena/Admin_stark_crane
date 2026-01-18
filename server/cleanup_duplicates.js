
const db = require('./config/db');
require('dotenv').config();

async function cleanupDuplicates() {
    try {
        console.log('Cleaning up duplicate pages...');

        // Delete 'home-page' (ID 1) directly, keep 'home' (ID 17)
        // Delete 'about-us' (ID 11) directly, keep 'about' (ID 18)

        const [delResult] = await db.query("DELETE FROM pages WHERE page_key IN ('home-page', 'about-us')");
        console.log(`Deleted ${delResult.affectedRows} pages (home-page, about-us).`);

        // Verify
        const [rows] = await db.query('SELECT id, page_key, title FROM pages ORDER BY title');
        rows.forEach(r => console.log(`${r.id}: ${r.page_key} | ${r.title}`));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

cleanupDuplicates();
