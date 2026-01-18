const db = require('./config/db');
const pagesController = require('./controllers/pagesController');

// Mock Req and Res
const req = {
    params: { pageKey: 'home' },
    body: {
        content_json: {
            hero: { title: "Controller Test", isVisible: true }
        }
    },
    user: { id: 1 } // Super Admin
};

const res = {
    status: function (code) {
        console.log(`Response Status: ${code}`);
        return this;
    },
    json: function (data) {
        console.log('Response JSON:', data);
        return this;
    }
};

async function testController() {
    try {
        console.log('Testing updatePage controller...');
        await pagesController.updatePage(req, res);
        process.exit(0);
    } catch (err) {
        console.error('Controller Crash:', err);
        process.exit(1);
    }
}

testController();
