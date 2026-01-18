const path = require('path');
const dotenv = require('dotenv');

// Load .env from server root (one level up from migrations)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const db = require('../config/db');


async function seedPages() {
  let connection;
  try {
    connection = await db.getConnection();
    console.log('Connected to database for page seeding...');

    const pages = [
      { key: 'home', title: 'Home Page' },
      { key: 'about', title: 'About Us' },
      { key: 'privacy-policy', title: 'Privacy Policy' },
      { key: 'terms', title: 'Terms of Service' }
    ];

    console.log('Seeding pages...');

    for (const page of pages) {
      // Check if page exists
      const [existing] = await connection.query(
        'SELECT id FROM pages WHERE page_key = ?',
        [page.key]
      );

      if (existing.length === 0) {
        await connection.query(
          'INSERT INTO pages (page_key, title) VALUES (?, ?)',
          [page.key, page.title]
        );
        console.log(`+ Created page: ${page.title} (${page.key})`);
      } else {
        console.log(`= Page already exists: ${page.title} (${page.key})`);
      }
    }

    console.log('Page seeding completed.');
  } catch (error) {
    console.error('Error seeding pages:', error);
  } finally {
    if (connection) connection.release();
    process.exit(0);
  }
}

seedPages();
