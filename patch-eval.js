const fs = require('fs');
const path = require('path');

const workerPath = path.join(process.cwd(), '.open-next', 'worker.js');

if (fs.existsSync(workerPath)) {
    let content = fs.readFileSync(workerPath, 'utf8');

    // Cloudflare Workers (V8 Isolates) strictly block eval() string execution.
    // Firebase/Webpack injects a dynamic require using eval("quire".replace(/^/,"re")).
    // Be replacing it with a standard ReferenceError triggering Reference, 
    // it smoothly hits the catch() block instead of crashing the Edge worker!
    const regex = /eval\("quire"\.replace\(\/\^\/,"re"\)\)/g;

    if (content.match(regex)) {
        content = content.replace(regex, 'require');
        fs.writeFileSync(workerPath, content, 'utf8');
        console.log('✅ Successfully patched eval() in Cloudflare worker.js');
    } else {
        console.log('⚠️ No eval() found. Skipping patch.');
    }
} else {
    console.error('❌ Could not find .open-next/worker.js to patch.');
}
