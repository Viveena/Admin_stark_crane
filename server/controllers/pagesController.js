const { validationResult } = require('express-validator');
const db = require('../config/db');


/**
 * Get all pages
 * GET /api/pages
 */
exports.getAllPages = async (req, res) => {
  try {
    const [pages] = await db.query(
      'SELECT id, page_key, title FROM pages ORDER BY title ASC'
    );

    res.status(200).json({
      pages,
      count: pages.length,
    });
  } catch (error) {
    console.error('Error fetching all pages:', error);
    res.status(500).json({ msg: 'Server error while fetching pages' });
  }
};

/**
 * Get page content and visibility
 * GET /api/pages/:pageKey
 */
exports.getPage = async (req, res) => {
  try {
    const { pageKey } = req.params;

    // Fetch page content joined with pages table
    const [pages] = await db.query(
      `SELECT 
        p.id as page_id,
        p.page_key,
        p.title,
        pc.id as content_id,
        pc.content_json,
        pc.image_url,
        pc.is_visible,
        pc.updated_by,
        pc.updated_at,
        pc.created_at,
        u.full_name as updated_by_name
      FROM pages p
      LEFT JOIN page_content pc ON p.id = pc.page_id
      LEFT JOIN users u ON pc.updated_by = u.id
      WHERE p.page_key = ?
      ORDER BY pc.updated_at DESC
      LIMIT 1`,
      [pageKey]
    );

    if (pages.length === 0) {
      return res.status(404).json({ msg: `Page with key '${pageKey}' not found` });
    }

    const page = pages[0];

    // Parse JSON content if it exists
    let contentJson = null;
    if (page.content_json) {
      try {
        // MySQL JSON type is already parsed by mysql2, but handle both string and object
        contentJson = typeof page.content_json === 'string'
          ? JSON.parse(page.content_json)
          : page.content_json;
      } catch (error) {
        console.error('Error parsing content_json:', error);
        contentJson = null;
      }
    }

    res.status(200).json({
      page_id: page.page_id,
      page_key: page.page_key,
      title: page.title,
      content: {
        id: page.content_id,
        content_json: contentJson,
        image_url: page.image_url,
        is_visible: Boolean(page.is_visible),
        updated_by: page.updated_by,
        updated_by_name: page.updated_by_name,
        updated_at: page.updated_at,
        created_at: page.created_at,
      },
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    res.status(500).json({ msg: 'Server error while fetching page' });
  }
};

/**
 * Update page content (content_json and image_url)
 * PUT /api/pages/:pageKey
 */
exports.updatePage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { pageKey } = req.params;
    const { content_json, image_url } = req.body;
    const updatedBy = req.user.id;

    // Check if page exists
    const [pages] = await db.query('SELECT id FROM pages WHERE page_key = ?', [pageKey]);
    if (pages.length === 0) {
      return res.status(404).json({ msg: `Page with key '${pageKey}' not found` });
    }

    const pageId = pages[0].id;

    // Validate and prepare content_json
    let jsonContent = null;
    if (content_json !== undefined && content_json !== null) {
      // If content_json is already an object, stringify it; if it's a string, parse then stringify to validate
      if (typeof content_json === 'string') {
        try {
          JSON.parse(content_json); // Validate it's valid JSON
          jsonContent = content_json; // Keep as string, MySQL JSON type will handle it
        } catch (error) {
          return res.status(400).json({ msg: 'Invalid JSON format in content_json' });
        }
      } else if (typeof content_json === 'object') {
        jsonContent = JSON.stringify(content_json); // Convert object to JSON string
      } else {
        return res.status(400).json({ msg: 'content_json must be a valid JSON object or string' });
      }
    }

    // Check if page_content already exists for this page
    const [existingContent] = await db.query(
      'SELECT id FROM page_content WHERE page_id = ?',
      [pageId]
    );

    if (existingContent.length > 0) {
      // Update existing content
      const contentId = existingContent[0].id;

      // Build update query dynamically based on provided fields
      const updateFields = [];
      const updateValues = [];

      if (content_json !== undefined) {
        updateFields.push('content_json = ?');
        updateValues.push(jsonContent);
      }

      if (image_url !== undefined) {
        updateFields.push('image_url = ?');
        updateValues.push(image_url || null);
      }

      updateFields.push('updated_by = ?');
      updateValues.push(updatedBy);

      updateValues.push(contentId);

      await db.query(
        `UPDATE page_content SET ${updateFields.join(', ')} WHERE id = ?`,
        updateValues
      );

      // Fetch updated content
      const [updatedContent] = await db.query(
        `SELECT 
          pc.id,
          pc.content_json,
          pc.image_url,
          pc.is_visible,
          pc.updated_by,
          pc.updated_at,
          u.full_name as updated_by_name
        FROM page_content pc
        LEFT JOIN users u ON pc.updated_by = u.id
        WHERE pc.id = ?`,
        [contentId]
      );

      const content = updatedContent[0];
      let parsedJson = null;
      if (content.content_json) {
        parsedJson = typeof content.content_json === 'string'
          ? JSON.parse(content.content_json)
          : content.content_json;
      }

      return res.status(200).json({
        msg: 'Page content updated successfully',
        content: {
          id: content.id,
          content_json: parsedJson,
          image_url: content.image_url,
          is_visible: Boolean(content.is_visible),
          updated_by: content.updated_by,
          updated_by_name: content.updated_by_name,
          updated_at: content.updated_at,
        },
      });
    } else {
      // Create new content
      const [result] = await db.query(
        `INSERT INTO page_content (page_id, content_json, image_url, updated_by) 
         VALUES (?, ?, ?, ?)`,
        [pageId, jsonContent, image_url || null, updatedBy]
      );

      // Fetch created content
      const [newContent] = await db.query(
        `SELECT 
          pc.id,
          pc.content_json,
          pc.image_url,
          pc.is_visible,
          pc.updated_by,
          pc.updated_at,
          u.full_name as updated_by_name
        FROM page_content pc
        LEFT JOIN users u ON pc.updated_by = u.id
        WHERE pc.id = ?`,
        [result.insertId]
      );

      const content = newContent[0];
      let parsedJson = null;
      if (content.content_json) {
        parsedJson = typeof content.content_json === 'string'
          ? JSON.parse(content.content_json)
          : content.content_json;
      }

      return res.status(201).json({
        msg: 'Page content created successfully',
        content: {
          id: content.id,
          content_json: parsedJson,
          image_url: content.image_url,
          is_visible: Boolean(content.is_visible),
          updated_by: content.updated_by,
          updated_by_name: content.updated_by_name,
          updated_at: content.updated_at,
        },
      });
    }
  } catch (error) {
    console.error('Error updating page:', error);
    res.status(500).json({ msg: 'Server error while updating page' });
  }
};

/**
 * Toggle page visibility
 * PATCH /api/pages/:pageKey/visibility
 */
exports.toggleVisibility = async (req, res) => {
  try {
    const { pageKey } = req.params;
    const updatedBy = req.user.id;

    // Check if page exists
    const [pages] = await db.query('SELECT id FROM pages WHERE page_key = ?', [pageKey]);
    if (pages.length === 0) {
      return res.status(404).json({ msg: `Page with key '${pageKey}' not found` });
    }

    const pageId = pages[0].id;

    // Check if page_content exists
    const [existingContent] = await db.query(
      'SELECT id, is_visible FROM page_content WHERE page_id = ?',
      [pageId]
    );

    if (existingContent.length === 0) {
      // Create page_content with default visibility
      const [result] = await db.query(
        `INSERT INTO page_content (page_id, is_visible, updated_by) 
         VALUES (?, TRUE, ?)`,
        [pageId, updatedBy]
      );

      const [newContent] = await db.query(
        `SELECT 
          pc.id,
          pc.content_json,
          pc.image_url,
          pc.is_visible,
          pc.updated_by,
          pc.updated_at,
          u.full_name as updated_by_name
        FROM page_content pc
        LEFT JOIN users u ON pc.updated_by = u.id
        WHERE pc.id = ?`,
        [result.insertId]
      );

      return res.status(201).json({
        msg: 'Page visibility set to visible',
        content: {
          id: newContent[0].id,
          is_visible: true,
          updated_by: newContent[0].updated_by,
          updated_by_name: newContent[0].updated_by_name,
          updated_at: newContent[0].updated_at,
        },
      });
    }

    // Toggle visibility
    const currentVisibility = Boolean(existingContent[0].is_visible);
    const newVisibility = !currentVisibility;
    const contentId = existingContent[0].id;

    await db.query(
      'UPDATE page_content SET is_visible = ?, updated_by = ? WHERE id = ?',
      [newVisibility, updatedBy, contentId]
    );

    // Fetch updated content
    const [updatedContent] = await db.query(
      `SELECT 
        pc.id,
        pc.content_json,
        pc.image_url,
        pc.is_visible,
        pc.updated_by,
        pc.updated_at,
        u.full_name as updated_by_name
      FROM page_content pc
      LEFT JOIN users u ON pc.updated_by = u.id
      WHERE pc.id = ?`,
      [contentId]
    );

    res.status(200).json({
      msg: `Page visibility ${newVisibility ? 'enabled' : 'disabled'}`,
      content: {
        id: updatedContent[0].id,
        is_visible: newVisibility,
        updated_by: updatedContent[0].updated_by,
        updated_by_name: updatedContent[0].updated_by_name,
        updated_at: updatedContent[0].updated_at,
      },
    });
  } catch (error) {
    console.error('Error toggling page visibility:', error);
    res.status(500).json({ msg: 'Server error while toggling page visibility' });
  }
};
