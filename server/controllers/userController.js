const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const db = require('../config/db');

/**
 * Create a new user
 * POST /api/users
 */
exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    full_name,
    username,
    email,
    password,
    role_id,
    company,
    country,
    contact,
    status,
  } = req.body;

  // Get the admin ID who is creating this user
  const createdBy = req.user.id;

  try {
    // Check if email already exists
    const [existingEmail] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(400).json({ msg: 'User with this email already exists' });
    }

    // Check if username already exists
    const [existingUsername] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
    if (existingUsername.length > 0) {
      return res.status(400).json({ msg: 'Username already taken' });
    }

    // Verify role_id exists
    const [roles] = await db.query('SELECT id FROM roles WHERE id = ?', [role_id]);
    if (roles.length === 0) {
      return res.status(400).json({ msg: 'Invalid role_id' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert new user
    const [result] = await db.query(
      `INSERT INTO users (full_name, username, email, password, role_id, status, company, country, contact, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [full_name, username, email, hashedPassword, role_id, status || 'active', company || null, country || null, contact || null, createdBy]
    );

    // Fetch the created user with role name
    const [newUsers] = await db.query(
      `SELECT u.id, u.full_name as fullName, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.created_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [result.insertId]
    );

    const newUser = newUsers[0];
    // Remove password from response
    delete newUser.password;

    res.status(201).json({
      msg: 'User created successfully',
      user: newUser,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ msg: 'Server error while creating user' });
  }
};

/**
 * Get all users with their role names and statuses
 * GET /api/users
 */
exports.getUsers = async (req, res) => {
  try {
    const [users] = await db.query(
      `SELECT u.id, u.full_name as fullName, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.created_at, u.updated_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       ORDER BY u.created_at DESC`
    );

    res.status(200).json({
      users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ msg: 'Server error while fetching users', error: error.message });
  }
};

/**
 * Toggle user status (active/inactive)
 * PATCH /api/users/:id/status
 */
exports.toggleUserStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { status } = req.body;

  try {
    // Validate status value
    const validStatuses = ['active', 'inactive', 'suspended', 'pending'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        msg: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Check if user exists
    const [users] = await db.query('SELECT id, status FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const currentStatus = users[0].status;

    // Prevent toggling your own status
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ msg: 'You cannot change your own status' });
    }

    // Prevent changing SUPER_ADMIN status (only if current user is not SUPER_ADMIN)
    if (req.user.role !== 'SUPER_ADMIN') {
      const [targetUser] = await db.query(
        `SELECT u.id, r.name as role_name 
         FROM users u 
         LEFT JOIN roles r ON u.role_id = r.id 
         WHERE u.id = ?`,
        [userId]
      );

      if (targetUser[0] && targetUser[0].role_name === 'SUPER_ADMIN') {
        return res.status(403).json({ msg: 'Cannot modify SUPER_ADMIN status' });
      }
    }

    // Update user status
    await db.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);

    // Fetch updated user with role name
    const [updatedUsers] = await db.query(
      `SELECT u.id, u.full_name as fullName, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.updated_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    res.status(200).json({
      msg: `User status updated from ${currentStatus} to ${status}`,
      user: updatedUsers[0],
    });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ msg: 'Server error while updating user status' });
  }
};

/**
 * Get single user by ID
 * GET /api/users/:id
 */
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch user details with role name
    const [users] = await db.query(
      `SELECT u.id, u.full_name as fullName, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.created_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = users[0];

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ msg: 'Server error while fetching user' });
  }
};

/**
 * Get current user details and permissions
 * GET /api/users/me
 */
exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch user details with role name
    const [users] = await db.query(
      `SELECT u.id, u.full_name as fullName, u.username, u.email, u.role_id, u.status, u.company, u.country, u.contact, u.created_by, u.created_at, r.name as role
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const user = users[0];

    // Fetch permissions for this user's role
    const [permissions] = await db.query(
      'SELECT page_key, can_read, can_create FROM role_permissions WHERE role_id = ?',
      [user.role_id]
    );

    // Format permissions similar to authController
    const permissionsObject = {};
    permissions.forEach((perm) => {
      permissionsObject[perm.page_key] = {
        read: Boolean(perm.can_read),
        create: Boolean(perm.can_create),
      };
    });

    res.status(200).json({
      user,
      permissions: permissionsObject,
    });
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ msg: 'Server error while fetching current user' });
  }
};

/**
 * Delete a user
 * DELETE /api/users/:id
 */
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate userId
    if (!userId) {
      return res.status(400).json({ msg: 'User ID is required' });
    }

    // Check if user exists
    const [existing] = await db.query('SELECT id, full_name, role_id FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Prevent deleting self
    if (parseInt(userId) === req.user.id) {
      return res.status(400).json({ msg: 'You cannot delete yourself' });
    }

    // Check role of the user being deleted
    const [roles] = await db.query('SELECT name FROM roles WHERE id = ?', [existing[0].role_id]);
    const roleName = roles.length > 0 ? roles[0].name.toUpperCase() : '';

    // Prevent deleting SUPER_ADMIN (unless you are one? Assuming even SUPER_ADMIN shouldn't delete other SUPER_ADMINs easily, or just hardcode protection)
    if (roleName === 'SUPER_ADMIN') {
      return res.status(403).json({ msg: 'Cannot delete SUPER_ADMIN users' });
    }

    // Delete user
    await db.query('DELETE FROM users WHERE id = ?', [userId]);

    res.status(200).json({ msg: 'User deleted successfully', userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ msg: 'Server error while deleting user' });
  }
};

/**
 * Update user password
 * PATCH /api/users/:id/password
 */
exports.updateUserPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.params.id;
  const { password } = req.body;

  try {
    // Validate password
    if (!password || password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long' });
    }

    // Check if user exists
    const [existing] = await db.query('SELECT id, role_id FROM users WHERE id = ?', [userId]);
    if (existing.length === 0) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

    res.status(200).json({ msg: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ msg: 'Server error while updating password' });
  }
};
