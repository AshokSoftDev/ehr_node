const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '../prisma/schema');
const outputPath = path.join(__dirname, '../prisma/schema.prisma');

// Create schema directory if it doesn't exist
if (!fs.existsSync(schemaPath)) {
    fs.mkdirSync(schemaPath, { recursive: true });
    console.log('📁 Created schema directory');
}

// Read all .prisma files from schema directory
const files = fs.readdirSync(schemaPath)
    .filter(file => file.endsWith('.prisma'))
    .sort((a, b) => {
        // Ensure base.prisma is processed first
        if (a === 'base.prisma') return -1;
        if (b === 'base.prisma') return 1;
        return a.localeCompare(b);
    });

if (files.length === 0) {
    console.error('❌ No .prisma files found in schema directory');
    process.exit(1);
}

let combinedSchema = '';

// Combine all schema files
files.forEach(file => {
    console.log(`📄 Processing: ${file}`);
    const content = fs.readFileSync(path.join(schemaPath, file), 'utf8');
    combinedSchema += content + '\n\n';
});

// Write combined schema
fs.writeFileSync(outputPath, combinedSchema.trim());
console.log('✅ Prisma schemas merged successfully!');
console.log(`📝 Output written to: ${outputPath}`);
