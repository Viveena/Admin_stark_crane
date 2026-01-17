const db = require('./server/config/db');

async function testFetch() {
    try {
        const [users] = await db.query(
            `SELECT u.id, u.full_name, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.created_at, u.updated_at, r.name as role
             FROM users u
             LEFT JOIN roles r ON u.role_id = r.id
             ORDER BY u.created_at DESC`
        );
        console.log('Successfully fetched users:', users.length);
        process.exit(0);
    } catch (error) {
        console.error('Error fetching users:', error);
        process.exit(1);
    }
}

testFetch();
