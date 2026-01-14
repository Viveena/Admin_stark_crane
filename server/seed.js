const bcrypt = require('bcryptjs');
const db = require('./config/db');
const dotenv = require('dotenv');

dotenv.config();

async function seedDatabase() {
  let connection;
  
  try {
    connection = await db.getConnection();
    console.log('Connected to database for seeding...');

    // Start transaction
    await connection.beginTransaction();

    // 1. Seed Roles
    console.log('Seeding roles...');
    const roles = [
      { name: 'SUPER_ADMIN' },
      { name: 'ADMIN' },
      { name: 'USER' }
    ];

    for (const role of roles) {
      await connection.query(
        'INSERT INTO roles (name) VALUES (?) ON DUPLICATE KEY UPDATE name = name',
        [role.name]
      );
      console.log(`✓ Role ${role.name} seeded`);
    }

    // 2. Get SUPER_ADMIN role_id
    const [roleRows] = await connection.query(
      'SELECT id FROM roles WHERE name = ?',
      ['SUPER_ADMIN']
    );
    
    if (roleRows.length === 0) {
      throw new Error('SUPER_ADMIN role not found');
    }
    
    const superAdminRoleId = roleRows[0].id;

    // 3. Create SUPER_ADMIN user
    console.log('Creating SUPER_ADMIN user...');
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminUsername = process.env.SUPER_ADMIN_USERNAME ;
    const superAdminFullName = process.env.SUPER_ADMIN_FULL_NAME;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(superAdminPassword, salt);

    // Check if user already exists
    const [existingUsers] = await connection.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [superAdminEmail, superAdminUsername]
    );

    if (existingUsers.length > 0) {
      // Update existing user
      await connection.query(
        `UPDATE users 
         SET full_name = ?, password = ?, role_id = ?, status = 'active'
         WHERE email = ? OR username = ?`,
        [superAdminFullName, hashedPassword, superAdminRoleId, superAdminEmail, superAdminUsername]
      );
      console.log(`✓ SUPER_ADMIN user updated (email: ${superAdminEmail})`);
    } else {
      // Create new user
      await connection.query(
        `INSERT INTO users (full_name, username, email, password, role_id, status) 
         VALUES (?, ?, ?, ?, ?, 'active')`,
        [superAdminFullName, superAdminUsername, superAdminEmail, hashedPassword, superAdminRoleId]
      );
      console.log(`✓ SUPER_ADMIN user created (email: ${superAdminEmail})`);
    }

    // Commit transaction
    await connection.commit();
    console.log('\n✓ Database seeding completed successfully!');
    console.log(`\nSuper Admin Credentials:`);
    console.log(`Email: ${superAdminEmail}`);
    console.log(`Username: ${superAdminUsername}`);
    console.log(`Password: ${superAdminPassword}`);
    console.log(`\n⚠️  Please change the default password after first login!`);

  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit(0);
  }
}

// Run seed
seedDatabase();
