const db = require('./config/db');

async function checkPermissions() {
    try {
        // Check permissions for role_id 38 (Editor)
        const [perms] = await db.query('SELECT * FROM role_permissions WHERE role_id = 38');
        console.log('Editor Permissions:', perms);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkPermissions();
