const { validationResult } = require('express-validator');
const db = require('../config/db');

/**
 * Get all available roles
 * GET /api/roles
 */
/**
 * Create a new role with permissions
 * POST /api/roles
 */
exports.createRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { roleName, permissions } = req.body;

  try {
    // 1. Check if role already exists
    const [existingRoles] = await db.query('SELECT id FROM roles WHERE name = ?', [roleName]);
    if (existingRoles.length > 0) {
      return res.status(400).json({ msg: 'Role with this name already exists' });
    }

    // 2. Create Role
    const [roleResult] = await db.query('INSERT INTO roles (name) VALUES (?)', [roleName]);
    const roleId = roleResult.insertId;

    // 3. Insert Permissions
    if (permissions && permissions.length > 0) {
      const permissionValues = permissions.map(p => [
        roleId,
        p.page_key || p.page_name, // Support both but prefer page_key (slug)
        p.read === true || p.read === 'true' ? 1 : 0,
        p.create === true || p.create === 'true' ? 1 : 0
      ]);

      await db.query(
        'INSERT INTO role_permissions (role_id, page_key, can_read, can_create) VALUES ?',
        [permissionValues]
      );
    }

    res.status(201).json({
      msg: 'Role created successfully',
      role: {
        id: roleId,
        name: roleName,
        permissions_count: permissions ? permissions.length : 0
      }
    });

  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ msg: 'Server error while creating role' });
  }
};

/**
 * Get all available roles
 * GET /api/roles
 */
exports.getRoles = async (req, res) => {
  try {
    const [roles] = await db.query(
      'SELECT id, name, created_at, updated_at FROM roles ORDER BY id ASC'
    );

    res.status(200).json({
      roles,
      count: roles.length,
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ msg: 'Server error while fetching roles' });
  }
};

/**
 * Get full permission matrix for a specific role
 * GET /api/permissions/:roleId
 */
exports.getRolePermissions = async (req, res) => {
  try {
    const roleId = parseInt(req.params.roleId);

    // Validate roleId
    if (isNaN(roleId) || roleId < 1) {
      return res.status(400).json({ msg: 'Invalid role ID' });
    }

    // Check if role exists
    const [roles] = await db.query('SELECT id, name FROM roles WHERE id = ?', [roleId]);
    if (roles.length === 0) {
      return res.status(404).json({ msg: 'Role not found' });
    }

    const role = roles[0];

    // Get permissions for this role from NEW schema
    const [permissions] = await db.query(
      'SELECT page_key, can_read, can_create FROM role_permissions WHERE role_id = ?',
      [roleId]
    );

    res.status(200).json({
      role: {
        id: role.id,
        name: role.name,
      },
      permissions: permissions.map(p => ({
        page_name: p.page_key, // Mapping page_key to page_name for frontend compatibility if expected
        page_key: p.page_key,
        can_read: Boolean(p.can_read),
        can_create: Boolean(p.can_create)
      }))
    });
  } catch (error) {
    console.error('Error fetching role permissions:', error);
    res.status(500).json({ msg: 'Server error while fetching role permissions' });
  }
};

/**
 * Update role permissions
 * PUT /api/permissions/:roleId
 */
exports.updateRolePermissions = async (req, res) => {
  // Logic remains similar but needs to handle page_name and new specific columns
  // For brevity/focus on solving the user's immediate POST error, I'm focusing on createRole and getRolePermissions.
  // Full update implementation might be needed later.
  res.status(501).json({ msg: 'Update not fully implemented for new schema yet' });
};
