import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

function fixMigrationFiles() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const migrationsDir = path.join(__dirname, '../');
    
    const files = fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'));
    
    files.forEach(file => {
        const filePath = path.join(migrationsDir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        let isModified = false;

        // replace CREATE TABLE with CREATE TABLE IF NOT EXISTS
        const CREATE_TABLE_REGEX = /CREATE TABLE "([^"]+)"/g;
        if (CREATE_TABLE_REGEX.test(content)) {
            content = content.replace(
                CREATE_TABLE_REGEX,
                'CREATE TABLE IF NOT EXISTS "$1"'
            );
            isModified = true;
        }

        // replace CREATE INDEX with CREATE INDEX IF NOT EXISTS (if exists)
        const CREATE_INDEX_REGEX = /CREATE INDEX "([^"]+)"/g;
        if (CREATE_INDEX_REGEX.test(content)) {
            content = content.replace(
                CREATE_INDEX_REGEX,
                'CREATE INDEX IF NOT EXISTS "$1"'
            );
            isModified = true;
        }

        // replace CREATE UNIQUE INDEX with CREATE UNIQUE INDEX IF NOT EXISTS (if exists)
        const CREATE_UNIQUE_INDEX_REGEX = /CREATE UNIQUE INDEX "([^"]+)"/g;
        if (CREATE_UNIQUE_INDEX_REGEX.test(content)) {
            content = content.replace(
                CREATE_UNIQUE_INDEX_REGEX,
                'CREATE UNIQUE INDEX IF NOT EXISTS "$1"'
            );
            isModified = true;
        }
        if (isModified) {
            fs.writeFileSync(filePath, content);
            console.log(`Fixed migration file: ${file}`);
        }
    });
}

fixMigrationFiles();