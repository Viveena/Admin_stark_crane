const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./server/config/db');

async function inspectTable() {
    try {
        const [columns] = await db.query('DESCRIBE users');
        console.log('Users Table Structure:');
        columns.forEach(col => {
            console.log(`${col.Field} (${col.Type})`);
        });
    } catch (error) {
        console.error('Error inspecting table:', error);
    } finally {
        process.exit(0);
    }
}

inspectTable();
