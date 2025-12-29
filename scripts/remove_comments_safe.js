const fs = require('fs');
const path = require('path');

const EXTS_JS = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
const EXTS_CSS = ['.css', '.scss', '.less'];
const EXTS_HTML = ['.html', '.htm'];

function removeCommentsJS(content) {
    let output = '';
    let state = 'CODE'; // CODE, BLOCK_COMMENT, LINE_COMMENT, STRING_SINGLE, STRING_DOUBLE, STRING_TEMPLATE
    let i = 0;
    const len = content.length;

    while (i < len) {
        const char = content[i];
        const nextChar = i + 1 < len ? content[i + 1] : '';

        if (state === 'CODE') {
            if (char === '/' && nextChar === '*') {
                state = 'BLOCK_COMMENT';
                i++;
            } else if (char === '/' && nextChar === '/') {
                state = 'LINE_COMMENT';
                i++;
            } else if (char === "'") {
                state = 'STRING_SINGLE';
                output += char;
            } else if (char === '"') {
                state = 'STRING_DOUBLE';
                output += char;
            } else if (char === '`') {
                state = 'STRING_TEMPLATE';
                output += char;
            } else {
                output += char;
            }
        } else if (state === 'BLOCK_COMMENT') {
            if (char === '*' && nextChar === '/') {
                state = 'CODE';
                i++;
            }
        } else if (state === 'LINE_COMMENT') {
            if (char === '\n') {
                state = 'CODE';
                output += char;
            }
        } else if (state === 'STRING_SINGLE') {
            output += char;
            if (char === "'" && content[i - 1] !== '\\') {
                state = 'CODE';
            }
        } else if (state === 'STRING_DOUBLE') {
            output += char;
            if (char === '"' && content[i - 1] !== '\\') {
                state = 'CODE';
            }
        } else if (state === 'STRING_TEMPLATE') {
            output += char;
            if (char === '`' && content[i - 1] !== '\\') {
                state = 'CODE';
            }
        }
        i++;
    }
    return output;
}

function removeCommentsCSS(content) {
    // CSS only has block comments /* */
    // But we must respect strings too
    let output = '';
    let state = 'CODE'; 
    let i = 0;
    const len = content.length;

    while (i < len) {
        const char = content[i];
        const nextChar = i + 1 < len ? content[i + 1] : '';

        if (state === 'CODE') {
            if (char === '/' && nextChar === '*') {
                state = 'BLOCK_COMMENT';
                i++;
            } else if (char === '"') {
                state = 'STRING_DOUBLE';
                output += char;
            } else if (char === "'") {
                state = 'STRING_SINGLE';
                output += char;
            } else {
                output += char;
            }
        } else if (state === 'BLOCK_COMMENT') {
            if (char === '*' && nextChar === '/') {
                state = 'CODE';
                i++;
            }
        } else if (state === 'STRING_DOUBLE') {
            output += char;
            if (char === '"' && content[i - 1] !== '\\') { // Simple escape check
                state = 'CODE';
            }
        } else if (state === 'STRING_SINGLE') {
            output += char;
             if (char === "'" && content[i - 1] !== '\\') {
                state = 'CODE';
            }
        }
        i++;
    }
    return output;
}

function removeCommentsHTML(content) {
    // Regex is usually okay for HTML comments if we don't have crazy nested scripts, 
    // but a state machine is safer for <!-- --> vs scripts.
    // For simplicity, we will use a robust regex for HTML comments: <!-- ... -->
    // We will NOT touch the content inside <script> tags here, treating them as text,
    // which is a limitation. If <script> tags exist, they should ideally be processed as JS.
    // However, for this task, deleting <!-- --> is the main "HTML comment" goal.
    return content.replace(/<!--[\s\S]*?-->/g, '');
}

function processFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content;

    if (EXTS_JS.includes(ext)) {
        newContent = removeCommentsJS(content);
    } else if (EXTS_CSS.includes(ext)) {
        newContent = removeCommentsCSS(content);
    } else if (EXTS_HTML.includes(ext)) {
        newContent = removeCommentsHTML(content);
    }

    if (newContent !== content) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Processed: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === 'dist' || file === 'build') continue;
            walkDir(fullPath);
        } else {
            processFile(fullPath);
        }
    }
}

const targetDirs = [
    path.join(__dirname, '../client/src'),
    path.join(__dirname, '../server'),
    // Also check root for files?
    // Maybe specifically check root files if needed
];

// Add root manually if there are loose files there that need cleaning
// const rootDir = path.join(__dirname, '..');
// processFile(path.join(rootDir, 'index.html')); // Example if exists

console.log('Starting comment removal...');
targetDirs.forEach(d => {
    if (fs.existsSync(d)) {
        walkDir(d);
    } else {
        console.log(`Skipping missing dir: ${d}`);
    }
});

// Also handle www folder if it exists (cordova/ionic usually)
const wwwDir = path.join(__dirname, '../www');
if (fs.existsSync(wwwDir)) {
    walkDir(wwwDir);
}

console.log('Done.');
