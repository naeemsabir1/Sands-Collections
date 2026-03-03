const fs = require('fs');
const path = require('path');

function replaceDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir).forEach(f => {
        const p = path.join(dir, f);
        if (fs.statSync(p).isDirectory()) {
            replaceDir(p);
        } else if (p.endsWith('.js') || p.endsWith('.mjs')) {
            let content = fs.readFileSync(p, 'utf-8');
            const regex = /eval\("quire"\.replace\(\/\^\/,"re"\)\)/g;
            if (content.match(regex)) {
                content = content.replace(regex, 'require');
                fs.writeFileSync(p, content, 'utf8');
                console.log('✅ Successfully patched eval() in ' + p);
            }
        }
    });
}

const openNextDir = path.join(process.cwd(), '.open-next');
replaceDir(openNextDir);
