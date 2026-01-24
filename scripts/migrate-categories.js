const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Starting category migration...');

    // 1. Get all unique categories currently in LabTest (case insensitive approach might need improved later, but for now simple)
    // Group by category string
    const tests = await prisma.labTest.findMany({
        select: { id: true, category: true }
    });

    const uniqueCategoryNames = [...new Set(tests.map(t => t.category).filter(Boolean))];
    console.log(`Found ${uniqueCategoryNames.length} unique categories:`, uniqueCategoryNames);

    // 2. Upsert Categories
    for (const name of uniqueCategoryNames) {
        if (!name) continue;

        // Normalize name if needed (trim)
        const normalizedName = name.trim();

        const category = await prisma.category.upsert({
            where: { name: normalizedName },
            update: {},
            create: { name: normalizedName, description: 'Imported from legacy data' },
        });

        console.log(`Ensured Category: ${normalizedName} (${category.id})`);

        // 3. Update tests to point to this category
        // Update many labtests where category (string) matches name
        const updateResult = await prisma.labTest.updateMany({
            where: { category: name },
            data: { categoryId: category.id }
        });

        console.log(`Linked ${updateResult.count} tests to category ${normalizedName}`);
    }

    console.log('Migration complete.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
