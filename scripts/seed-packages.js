const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding packages...');

    // 1. Fetch existing tests to link
    const tests = await prisma.labTest.findMany();
    if (tests.length === 0) {
        console.log('No tests found. Please seed tests first.');
        return;
    }

    // Helper to find test IDs by partial name match
    const findTests = (keywords) => {
        return tests
            .filter(t => keywords.some(k => t.name.toLowerCase().includes(k.toLowerCase())))
            .map(t => ({ id: t.id }));
    };

    const packages = [
        {
            name: "Basic Health Checkup",
            description: "Essential health screening covering blood count, sugar, and basic liver/kidney functions.",
            price: 1499,
            originalPrice: 2000,
            keywords: ["CBC", "Blood Glucose", "Urine", "Cholesterol"]
        },
        {
            name: "Comprehensive Full Body Checkup",
            description: "Complete health assessment including advanced cardiac, liver, kidney, and thyroid profiles.",
            price: 3999,
            originalPrice: 5500,
            keywords: ["CBC", "Lipid", "Liver", "Kidney", "Thyroid", "Glucose", "Urine"]
        },
        {
            name: "Diabetes Care Package",
            description: "Specialized package for monitoring diabetes control and related complications.",
            price: 999,
            originalPrice: 1500,
            keywords: ["Glucose", "HbA1c", "Lipid", "Creatinine", "Urine"]
        },
        {
            name: "Senior Citizen Wellness",
            description: "Tailored for seniors, focusing on bone health, heart, and vital organ functions.",
            price: 2499,
            originalPrice: 3500,
            keywords: ["CBC", "Bone", "Calcium", "Vitamin D", "Lipid", "Kidney", "Liver"]
        }
    ];

    for (const pkg of packages) {
        const linkedTests = findTests(pkg.keywords);

        // Create Package
        const createdPackage = await prisma.package.create({
            data: {
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
                originalPrice: pkg.originalPrice,
                tests: {
                    connect: linkedTests
                }
            }
        });

        console.log(`Created package: ${createdPackage.name} with ${linkedTests.length} tests`);
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
