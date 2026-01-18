
const db = require('./config/db');
require('dotenv').config();

async function checkDuplicates() {
    try {
        const [rows] = await db.query('SELECT id, page_key, title FROM pages ORDER BY title');
        // Print all rows compactly
        rows.forEach(r => console.log(`${r.id}: ${r.page_key} | ${r.title}`));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
