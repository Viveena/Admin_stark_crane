const db = require('./config/db');

async function fixKeys() {
    try {
        const mappings = {
            'home-page': 'home',
            'products': 'product',
            'case-study': 'case_study',
            'about-us': 'about',
            // 'service', 'location', 'industry', 'parts', 'blogs', 'news', 'events', 'career', 'contact', 'faq' seem to match or need checking
            // 'crane-selector', 'other-pages' - not in allowedPages list in controller, so maybe irrelevant for now or should be kept as is?
            // allowedPages: home, product, service, location, industry, parts, blogs, events, news, case_study, about, career, contact, faq
        };

        // Explicit list of corrections based on 'allowedPages' in pagesController.js:
        // 'home', 'product', 'service', 'location', 'industry', 'parts', 'blogs', 'events', 'news', 'case_study', 'about', 'career', 'contact', 'faq'

        // DB has (from slugify):
        // 'home-page', 'products', 'service', 'location', 'industry', 'parts', 'blogs', 'news', 'events', 'case-study', 'about-us', 'career', 'contact', 'faq', 'crane-selector', 'other-pages'

        // Confirmed mismatches:
        // 'home-page' -> 'home'
        // 'products' -> 'product'
        // 'case-study' -> 'case_study'
        // 'about-us' -> 'about'

        console.log('Fixing permission keys in database...');

        for (const [oldKey, newKey] of Object.entries(mappings)) {
            console.log(`Updating '${oldKey}' to '${newKey}'...`);
            // Update role_permissions
            // We use IGNORE or handle duplicate if target key exists, but we expect it NOT to exist.
            const [result] = await db.query('UPDATE role_permissions SET page_key = ? WHERE page_key = ?', [newKey, oldKey]);
            console.log(`Changed ${result.changedRows} rows.`);
        }

        console.log('Fix complete.');
        process.exit(0);
    } catch (error) {
        console.error('Error fixing keys:', error);
        process.exit(1);
    }
}

fixKeys();
