const AdmZip = require('adm-zip');
const path = require('path');
const fs = require('fs');

async function createUpdateZip() {
    const zip = new AdmZip();
    const exclude = ['node_modules', '.next', '.git', '.vscode', 'update-package.zip', 'temp-update.zip'];

    // Add all files from root recursively, respecting excludes
    // AdmZip doesn't have a simple "addLocalFolder with excludes", so we might need to iterate or just add specific folders
    // Easier approach: addLocalFolder and then remove entries, or use glob

    // Let's try adding explicit folders/files that are important source code
    const sourceFolders = ['app', 'components', 'lib', 'prisma', 'public', 'scripts', 'styles', 'types', 'utils', 'hooks', 'constants', 'config', 'android'];
    const sourceFiles = ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'postcss.config.mjs', 'tailwind.config.ts', 'middleware.ts', '.env', '.env.local'];

    console.log('Packing folders...');
    for (const folder of sourceFolders) {
        if (fs.existsSync(folder)) {
            zip.addLocalFolder(folder, folder);
        }
    }

    console.log('Packing files...');
    for (const file of sourceFiles) {
        if (fs.existsSync(file)) {
            zip.addLocalFile(file);
        }
    }

    // Also include any other TS/JS files in root
    const rootFiles = fs.readdirSync('.');
    for (const file of rootFiles) {
        if (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.json') || file.endsWith('.md')) {
            if (!exclude.includes(file) && !sourceFiles.includes(file) && !file.startsWith('package')) {
                zip.addLocalFile(file);
            }
        }
    }

    const outputPath = path.join(process.cwd(), 'update-package.zip');
    zip.writeZip(outputPath);
    console.log(`Update package created at: ${outputPath}`);
}

createUpdateZip();
