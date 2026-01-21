const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sampleTests = [
    { name: "CBC (Complete Blood Count)", price: 400, category: "Hematology", tat: "24 Hours" },
    { name: "Blood Sugar (Fasting/PP)", price: 150, category: "Biochemistry", tat: "4 Hours" },
    { name: "Lipid Profile", price: 800, category: "Biochemistry", tat: "24 Hours" },
    { name: "Thyroid Function Test (TFT)", price: 1000, category: "Hormones", tat: "24 Hours" },
    { name: "Liver Function Test (LFT)", price: 900, category: "Biochemistry", tat: "12 Hours" },
    { name: "Kidney Function Test (RFT)", price: 800, category: "Biochemistry", tat: "12 Hours" },
    { name: "Urine Routine", price: 200, category: "Pathology", tat: "4 Hours" },
    { name: "HBA1c", price: 700, category: "Biochemistry", tat: "6 Hours" },
    { name: "Vitamin D", price: 1500, category: "Special", tat: "24-48 Hours" },
    { name: "PCR Test (Dengue/Typhoid)", price: 1200, category: "Microbiology", tat: "24 Hours" },
];

async function main() {
    console.log('Start seeding tests...');

    for (const test of sampleTests) {
        const result = await prisma.labTest.create({
            data: test,
        });
        console.log(`Created test with id: ${result.id}`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
