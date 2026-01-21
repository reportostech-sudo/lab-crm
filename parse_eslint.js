const fs = require('fs');
try {
    const report = JSON.parse(fs.readFileSync('eslint-report.json', 'utf8'));
    report.forEach(file => {
        if (file.errorCount > 0) {
            console.log(`File: ${file.filePath}`);
            file.messages.forEach(msg => {
                if (msg.severity === 2) {
                    console.log(`  Line ${msg.line}: ${msg.message} (${msg.ruleId})`);
                }
            });
        }
    });
} catch (e) {
    console.error("Error parsing JSON:", e.message);
}
