const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Connecting to database...');
    try {
        await prisma.$connect();
        console.log('✅ Connected to database successfully.');

        console.log('🧪 Attempting to create a test booking...');
        const testBooking = await prisma.booking.create({
            data: {
                patientName: 'Debug User',
                phone: '1234567890',
                testType: 'Debug Test',
                date: new Date(),
                status: 'PENDING',
                type: 'LAB_VISIT',
                source: 'ADMIN',
            }
        });

        console.log('✅ Booking created successfully:', testBooking.id);

        console.log('🗑️  Cleaning up test booking...');
        await prisma.booking.delete({ where: { id: testBooking.id } });
        console.log('✅ Cleanup successful.');

    } catch (e) {
        console.error('❌ DATABASE ERROR OCCURRED:');
        console.error(e);
        console.error('Potential causes: 1. Missing migrations, 2. Schema mismatch');
    } finally {
        await prisma.$disconnect();
    }
}

main();
