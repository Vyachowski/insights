import appRootPath from 'app-root-path';
import fs from 'fs';
import path from 'path';

// TODO: REFACTORING - FIND IT USER AND REFACTOR THE WHOLE PART
const data: Record<string, string> = JSON.parse(fs.readFileSync(path.resolve(appRootPath.path, 'data/metrika/counters/counters.json'), 'utf8'));

if (data && Array.isArray(data.counters)) {
    const rows = data.counters.map(c =>
    `"${c.name.replace(/"/g, '""')}",${c.id},"${c.site}"`
    );

    const csv = [
    'name,id,site',
    ...rows
    ].join('\n');

    fs.writeFileSync('counters.csv', csv, 'utf8');

    console.log('CSV готов');
}

