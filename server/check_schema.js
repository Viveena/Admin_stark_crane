const db = require('./config/db');

async function checkSchema() {
    try {
        const [columns] = await db.query('DESCRIBE home_pages');
        console.log('home_pages columns:', columns.map(c => c.Field));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
