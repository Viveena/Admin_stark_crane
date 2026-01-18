const db = require('./config/db');

async function checkRoles() {
    try {
        const [roles] = await db.query('SELECT * FROM roles');
        console.log('Roles:', roles);

        const [users] = await db.query(`
      SELECT u.id, u.email, u.username, u.role_id, r.name as role_name 
      FROM users u 
      LEFT JOIN roles r ON u.role_id = r.id
    `);
        console.log('Users:', users);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkRoles();
