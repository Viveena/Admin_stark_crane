const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const db = require('../config/db');
const { generateOtp, sendOtpEmail } = require('../services/otpService');

exports.login = async (req, res) => {
  // Superadmin Bypass
  const { email, password } = req.body;
  if (email === 'superamin' && password === 'super') {
    const payload = {
      user: {
        id: 'superadmin',
        role: 'superadmin',
      },
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: 'superadmin' });
      }
    );
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }



  try {
    // 1. Check if user exists
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 2. Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // 3. Generate 6-digit OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // 4. Store OTP in database (delete old OTPs for this email first, then insert new one)
    await db.query('DELETE FROM otps WHERE email = ?', [email]);
    await db.query(
      'INSERT INTO otps (user_id, email, otp, expires_at) VALUES (?, ?, ?, ?)',
      [user.id, email, otp, expiresAt]
    );

    // 5. Mock send OTP to user's email
    await sendOtpEmail(email, otp);

    res.status(200).json({ msg: 'OTP sent to your email for verification.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.verifyOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, otp } = req.body;

  try {
    // 1. Validate OTP from database
    const [otps] = await db.query('SELECT * FROM otps WHERE email = ? AND otp = ? AND expires_at > NOW() AND verified = false', [email, otp]);
    const storedOtp = otps[0];

    if (!storedOtp) {
      return res.status(400).json({ msg: 'Invalid or expired OTP.' });
    }

    // Mark OTP as verified
    await db.query('UPDATE otps SET verified = true WHERE id = ?', [storedOtp.id]);

    // 2. Fetch user from MySQL
    const [users] = await db.query('SELECT id, email, role_id FROM users WHERE email = ?', [email]);
    let user = users[0];

    // 3. Assign default role if new user (This scenario assumes new user registration is handled elsewhere or happens upon first login attempt. For now, assuming user exists after successful password validation during login)
    if (!user) {
      // This case should ideally not happen if login was successful, but as a fallback:
      // Create user with a default role (e.g., role_id = 1 for 'user')
      // Note: In a real app, user creation would be a separate registration endpoint.
      const defaultRoleId = 1; // Assuming 1 is the default role ID for a new user
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10); // Placeholder password
      const [result] = await db.query('INSERT INTO users (email, password, role_id, status) VALUES (?, ?, ?, ?)', [email, hashedPassword, defaultRoleId, 'active']);
      const newUserId = result.insertId;
      user = { id: newUserId, email, role_id: defaultRoleId };
    }

    // Fetch role name based on role_id
    const [roles] = await db.query('SELECT name FROM roles WHERE id = ?', [user.role_id]);
    const roleName = roles[0] ? roles[0].name : 'guest'; // Default to 'guest' if role not found

    // Fetch permissions for this role from role_permissions table
    const [permissions] = await db.query(
      'SELECT page_key, can_view, can_edit FROM role_permissions WHERE role_id = ?',
      [user.role_id]
    );

    // Structure permissions as: { "page_key": { "view": true, "edit": false } }
    const permissionsObject = {};
    permissions.forEach((perm) => {
      permissionsObject[perm.page_key] = {
        view: Boolean(perm.can_view),
        edit: Boolean(perm.can_edit),
      };
    });

    // Generate JWT token
    const payload = {
      user: {
        id: user.id,
        role: roleName,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          role: roleName,
          permissions: permissionsObject,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.resendOtp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  try {
    // 1. Check if user exists (optional, but good for security to not send OTP to non-existent emails)
    const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ msg: 'User with this email does not exist.' });
    }

    // 2. Generate new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    // 3. Store new OTP in database (delete old OTPs for this email first, then insert new one)
    const userId = users[0].id;
    await db.query('DELETE FROM otps WHERE email = ?', [email]);
    await db.query(
      'INSERT INTO otps (user_id, email, otp, expires_at) VALUES (?, ?, ?, ?)',
      [userId, email, otp, expiresAt]
    );

    // 4. Send OTP email
    await sendOtpEmail(email, otp);

    res.status(200).json({ msg: 'New OTP sent to your email.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
