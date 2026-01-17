const fetch = require('node-fetch');

async function reproduce() {
    try {
        // 1. Login as Super Admin
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@starkcrane.com', password: 'superadmin' })
        });

        const loginData = await loginRes.json();
        console.log('Login Response:', loginData);

        if (!loginData.token) {
            console.error('Login failed, cannot proceed.');
            return;
        }

        const token = loginData.token;

        // 2. Verify OTP (if needed, but local env usually mocks? user said OTP is implemented)
        // Wait, current login flow needs OTP.
        // Let's check if login returns token immediately or needs verify.
        // Based on user report, login -> OTP -> Token.
        // Actually, let's check authController.js login logic.

        // Assuming login returns { userId, msg: 'OTP sent' }
        if (!loginData.userId) {
            // If direct token (rare based on history), try using it.
            // If standard flow, we need to verify OTP.
            // For testing, I might need to bypass OTP or inspect DB for OTP?
            // Or maybe 'superadmin' bypasses OTP?
            // Let's assume standard flow.
            console.log('Login requires OTP?');
        }

        // WAIT. If I can't easily get OTP, I'll cheat and use a known token or just inspect the error by mocking the controller?
        // Alternative: The 500 error is in `createUser`. I can write a script that imports the controller directly and mocks `req` and `res`.
        // This is much more reliable than HTTP requests with auth complexity.
    } catch (e) {
        console.error(e);
    }
}

// Better approach: Mock Controller Test
const { createUser } = require('./server/controllers/userController');
const db = require('./server/config/db');

// Mock helpers
const req = {
    body: {
        full_name: 'Test Permission User',
        username: 'testpermuser',
        email: 'testperm@example.com',
        password: 'password123',
        role_id: 3, // User role usually
        status: 'active'
    },
    user: { id: 1 }, // Mock Super Admin ID
    header: () => { }
};

const res = {
    status: (code) => {
        console.log('Response Status:', code);
        return res;
    },
    json: (data) => {
        console.log('Response JSON:', JSON.stringify(data, null, 2));
        return res;
    }
};

// We also need to mock express-validator validationResult?
// Or we can just mock the module... or just ensure req has valid data so validation passes.
// But validationResult is called inside. 
// I will try to run this. If validation fails, I'll see 400.

async function runControllerTest() {
    try {
        console.log('Running createUser controller test...');

        // Mock validationResult behavior?
        // It's a bit hard to mock require('express-validator') without rewiring.
        // Let's try to allow it to run. If it fails on validationResult(req) because req is not an express request...
        // validatedResult(req) checks req conventions.

        await createUser(req, res);

        process.exit(0);
    } catch (e) {
        console.error('Unhandled Controller Error:', e);
        process.exit(1);
    }
}

runControllerTest();
