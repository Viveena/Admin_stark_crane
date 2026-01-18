
const db = require('./server/config/db');
const dotenv = require('dotenv');
dotenv.config({ path: './server/.env' });

async function checkDuplicates() {
    try {
        const [rows] = await db.query('SELECT title, page_key, COUNT(*) as count FROM pages GROUP BY title, page_key HAVING count > 1');

        if (rows.length > 0) {
            console.log('Duplicates found:', rows);

            // Fetch all duplicates to see IDs
            for (const row of rows) {
                const [entries] = await db.query('SELECT id, title, page_key FROM pages WHERE page_key = ?', [row.page_key]);
                console.log(`Entries for ${row.page_key}:`, entries);
            }
        } else {
            console.log('No duplicates found.');
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkDuplicates();
