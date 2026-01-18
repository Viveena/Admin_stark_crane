const db = require('./config/db');

async function debugSave() {
    try {
        const pageKey = 'home';
        const tableName = `${pageKey}_pages`;
        const userId = 1; // Super Admin

        console.log('Fetching user...');
        const [users] = await db.query(
            `SELECT u.username, r.name as role_name 
         FROM users u 
         JOIN roles r ON u.role_id = r.id 
         WHERE u.id = ?`,
            [userId]
        );
        console.log('User found:', users[0]);
        const { username, role_name } = users[0];

        const content_json = {
            "hero": {
                "title": "Debug Title",
                "isVisible": true
            }
        };
        const jsonContentString = JSON.stringify(content_json);

        const actionType = 'UPDATE';
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().split(' ')[0];

        console.log(`Attempting INSERT into ${tableName}...`);
        console.log('Values:', {
            page_section: 'main',
            content_data: jsonContentString,
            action_type: actionType,
            edited_by_user_id: userId,
            edited_by_username: username,
            edited_by_role: role_name,
            edited_at_date: dateStr,
            edited_at_time: timeStr
        });

        const [result] = await db.query(
            `INSERT INTO ${tableName} 
      (page_section, content_data, action_type, edited_by_user_id, edited_by_username, edited_by_role, edited_at_date, edited_at_time)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                'main',
                jsonContentString,
                actionType,
                userId,
                username,
                role_name,
                dateStr,
                timeStr
            ]
        );

        console.log('Insert Success! ID:', result.insertId);
        process.exit(0);
    } catch (error) {
        console.error('DEBUG ERROR:', error);
        process.exit(1);
    }
}

debugSave();
