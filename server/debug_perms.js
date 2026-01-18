const db = require('./config/db');

async function debugPerms() {
    try {
        console.log("Fetching distinct page_key from role_permissions...");
        const [keys] = await db.query('SELECT DISTINCT page_key FROM role_permissions');
        console.log('Distinct Page Keys:', keys.map(k => k.page_key));

        const [roles] = await db.query('SELECT * FROM roles');
        console.log('Roles:', roles);
        
        // Also check specific key 'home'
        const [homePerms] = await db.query("SELECT * FROM role_permissions WHERE page_key = 'home'");
        console.log("Permissions for 'home':", homePerms.length);

        const [homePagePerms] = await db.query("SELECT * FROM role_permissions WHERE page_key = 'home-page'");
        console.log("Permissions for 'home-page':", homePagePerms.length);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugPerms();
