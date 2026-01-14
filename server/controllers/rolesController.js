// const { validationResult } = require('express-validator');
// const db = require('../config/db');

// /**
//  * Get all available roles
//  * GET /api/roles
//  */
// exports.getRoles = async (req, res) => {
//   try {
//     const [roles] = await db.query(
//       'SELECT id, name, created_at, updated_at FROM roles ORDER BY id ASC'
//     );

//     res.status(200).json({
//       roles,
//       count: roles.length,
//     });
//   } catch (error) {
//     console.error('Error fetching roles:', error);
//     res.status(500).json({ msg: 'Server error while fetching roles' });
//   }
// };

// /**
//  * Get full permission matrix for a specific role
//  * GET /api/permissions/:roleId
//  */
// exports.getRolePermissions = async (req, res) => {
//   try {
//     const roleId = parseInt(req.params.roleId);

//     // Validate roleId
//     if (isNaN(roleId) || roleId < 1) {
//       return res.status(400).json({ msg: 'Invalid role ID' });
//     }

//     // Check if role exists
//     const [roles] = await db.query('SELECT id, name FROM roles WHERE id = ?', [roleId]);
//     if (roles.length === 0) {
//       return res.status(404).json({ msg: 'Role not found' });
//     }

//     const role = roles[0];

//     // Get all pages
//     const [allPages] = await db.query('SELECT id, page_key, title FROM pages ORDER BY page_key ASC');

//     // Get permissions for this role
//     const [permissions] = await db.query(
//       'SELECT page_key, can_view, can_edit FROM role_permissions WHERE role_id = ?',
//       [roleId]
//     );

//     // Create a map of existing permissions for quick lookup
//     const permissionsMap = {};
//     permissions.forEach((perm) => {
//       permissionsMap[perm.page_key] = {
//         can_view: Boolean(perm.can_view),
//         can_edit: Boolean(perm.can_edit),
//       };
//     });

//     // Build permission matrix with all pages
//     const permissionMatrix = allPages.map((page) => ({
//       page_id: page.id,
//       page_key: page.page_key,
//       title: page.title,
//       can_view: permissionsMap[page.page_key]?.can_view || false,
//       can_edit: permissionsMap[page.page_key]?.can_edit || false,
//     }));

//     res.status(200).json({
//       role: {
//         id: role.id,
//         name: role.name,
//       },
//       permissions: permissionMatrix,
//       total_pages: allPages.length,
//       pages_with_permissions: permissions.length,
//     });
//   } catch (error) {
//     console.error('Error fetching role permissions:', error);
//     res.status(500).json({ msg: 'Server error while fetching role permissions' });
//   }
// };

// /**
//  * Update role permissions
//  * PUT /api/permissions/:roleId
//  */
// exports.updateRolePermissions = async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   try {
//     const roleId = parseInt(req.params.roleId);
//     const { permissions } = req.body;

//     // Validate roleId
//     if (isNaN(roleId) || roleId < 1) {
//       return res.status(400).json({ msg: 'Invalid role ID' });
//     }

//     // Check if role exists
//     const [roles] = await db.query('SELECT id, name FROM roles WHERE id = ?', [roleId]);
//     if (roles.length === 0) {
//       return res.status(404).json({ msg: 'Role not found' });
//     }

//     const role = roles[0];

//     // Prevent modifying SUPER_ADMIN permissions (only SUPER_ADMIN can do this)
//     if (role.name === 'SUPER_ADMIN' && req.user.role !== 'SUPER_ADMIN') {
//       return res.status(403).json({ msg: 'Only SUPER_ADMIN can modify SUPER_ADMIN permissions' });
//     }

//     // Validate permissions array
//     if (!Array.isArray(permissions)) {
//       return res.status(400).json({ msg: 'Permissions must be an array' });
//     }

//     // Validate each permission object
//     for (const perm of permissions) {
//       if (!perm.page_key || typeof perm.page_key !== 'string') {
//         return res.status(400).json({ msg: 'Each permission must have a valid page_key' });
//       }
//       if (typeof perm.can_view !== 'boolean') {
//         return res.status(400).json({ msg: 'can_view must be a boolean' });
//       }
//       if (typeof perm.can_edit !== 'boolean') {
//         return res.status(400).json({ msg: 'can_edit must be a boolean' });
//       }
//     }

//     // Verify all page_keys exist
//     const pageKeys = permissions.map((p) => p.page_key);
//     if (pageKeys.length > 0) {
//       const placeholders = pageKeys.map(() => '?').join(',');
//       const [existingPages] = await db.query(
//         `SELECT page_key FROM pages WHERE page_key IN (${placeholders})`,
//         pageKeys
//       );

//       const existingPageKeys = existingPages.map((p) => p.page_key);
//       const invalidPageKeys = pageKeys.filter((key) => !existingPageKeys.includes(key));

//       if (invalidPageKeys.length > 0) {
//         return res.status(400).json({
//           msg: `Invalid page keys: ${invalidPageKeys.join(', ')}`,
//         });
//       }
//     }

//     // Start transaction for atomic updates
//     const connection = await db.getConnection();
//     await connection.beginTransaction();

//     try {
//       // Delete existing permissions for this role (if we want to replace all)
//       // Or we can update/insert individually - let's do update/insert for flexibility
      
//       // Delete permissions that are not in the new list (optional - comment out if you want to keep existing)
//       // For now, we'll only update/insert the provided permissions

//       // Insert or update each permission
//       for (const perm of permissions) {
//         await connection.query(
//           `INSERT INTO role_permissions (role_id, page_key, can_view, can_edit)
//            VALUES (?, ?, ?, ?)
//            ON DUPLICATE KEY UPDATE
//            can_view = VALUES(can_view),
//            can_edit = VALUES(can_edit)`,
//           [roleId, perm.page_key, perm.can_view, perm.can_edit]
//         );
//       }

//       await connection.commit();

//       // Fetch updated permissions
//       const [updatedPermissions] = await connection.query(
//         `SELECT rp.page_key, rp.can_view, rp.can_edit, p.title
//          FROM role_permissions rp
//          LEFT JOIN pages p ON rp.page_key = p.page_key
//          WHERE rp.role_id = ?
//          ORDER BY rp.page_key ASC`,
//         [roleId]
//       );

//       res.status(200).json({
//         msg: 'Role permissions updated successfully',
//         role: {
//           id: role.id,
//           name: role.name,
//         },
//         permissions: updatedPermissions.map((p) => ({
//           page_key: p.page_key,
//           title: p.title,
//           can_view: Boolean(p.can_view),
//           can_edit: Boolean(p.can_edit),
//         })),
//         updated_count: permissions.length,
//       });
//     } catch (error) {
//       await connection.rollback();
//       throw error;
//     } finally {
//       connection.release();
//     }
//   } catch (error) {
//     console.error('Error updating role permissions:', error);
//     res.status(500).json({ msg: 'Server error while updating role permissions' });
//   }
// };
