const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

const parameterMap = {
    pm25: 'µg/m³',
    pm10: 'µg/m³',
    so2: 'ppb',
    co: 'ppm',
    o3: 'ppb',
    no2: 'ppb',
};

async function main() {
    console.log('Seeding database...');

    // load csv
    const csvPath = path.join(__dirname, 'ispu_dki_all.csv');
    const csv = fs.readFileSync(csvPath, 'utf-8');
    const rows = csv.split('\n').slice(1).filter(Boolean);

    // ambil lokasi unik dari kolom 'stasiun'
    const locationSet = new Set();
    for (const row of rows) {
        const cols = row.split(',');
        const stasiun = cols[1];
        if (stasiun) locationSet.add(stasiun.trim());
    }

    const locations = [...locationSet];

    // insert location
    for (const name of locations) {
        await prisma.location.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    // insert parameter
    for (const [name, unit] of Object.entries(parameterMap)) {
        await prisma.parameter.upsert({
            where: { name },
            update: {},
            create: { name, unit },
        });
    }

    console.log('Seeding selesai!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });