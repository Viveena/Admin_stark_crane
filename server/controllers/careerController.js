const { validationResult } = require('express-validator');
const db = require('../config/db');

/**
 * Get all careers
 * GET /api/careers
 */
exports.getAllCareers = async (req, res) => {
    console.log('[DEBUG] getAllCareers called');
    try {
        const [careers] = await db.query(
            'SELECT * FROM careers ORDER BY created_at DESC'
        );

        res.status(200).json({
            careers,
            count: careers.length
        });
    } catch (error) {
        console.error('Error fetching careers:', error);
        res.status(500).json({ msg: 'Server error while fetching careers' });
    }
};

/**
 * Get single career
 * GET /api/careers/:id
 */
exports.getCareer = async (req, res) => {
    try {
        const [careers] = await db.query('SELECT * FROM careers WHERE id = ?', [req.params.id]);

        if (careers.length === 0) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        res.status(200).json(careers[0]);
    } catch (error) {
        console.error('Error fetching career:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Create a new career
 * POST /api/careers
 */
exports.createCareer = async (req, res) => {
    console.log('[DEBUG] createCareer called with body:', req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('[DEBUG] createCareer validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    const { job_title, location, salary, category, job_type, description, status, related_content } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO careers (job_title, location, salary, category, job_type, description, status, related_content)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [job_title, location, salary, category, job_type, description, status || 'Active', JSON.stringify(related_content || {})]
        );

        res.status(201).json({
            msg: 'Job created successfully',
            career: { id: result.insertId, ...req.body }
        });
    } catch (error) {
        console.error('Error creating career:', error);
        res.status(500).json({ msg: 'Server error while creating job' });
    }
};

/**
 * Update a career
 * PUT /api/careers/:id
 */
exports.updateCareer = async (req, res) => {
    const { job_title, location, salary, category, job_type, description, status, related_content } = req.body;

    try {
        // Check if exists
        const [existing] = await db.query('SELECT id FROM careers WHERE id = ?', [req.params.id]);
        if (existing.length === 0) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        await db.query(
            `UPDATE careers 
       SET job_title = ?, location = ?, salary = ?, category = ?, job_type = ?, description = ?, status = ?, related_content = ?
       WHERE id = ?`,
            [job_title, location, salary, category, job_type, description, status, JSON.stringify(related_content || {}), req.params.id]
        );

        res.status(200).json({ msg: 'Job updated successfully' });
    } catch (error) {
        console.error('Error updating career:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};

/**
 * Delete a career
 * DELETE /api/careers/:id
 */
exports.deleteCareer = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM careers WHERE id = ?', [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ msg: 'Job not found' });
        }

        res.status(200).json({ msg: 'Job deleted successfully' });
    } catch (error) {
        console.error('Error deleting career:', error);
        res.status(500).json({ msg: 'Server error' });
    }
};
