const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔄 Connecting to database...');
    try {
        await prisma.$connect();
        console.log('✅ Connected to database successfully.');

        // Test 1: Booking Creation (Schema Check)
        console.log('🧪 Test 1: Attempting to create a test booking...');
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
        console.log('✅ Test 1 Passed: Booking created successfully (ID: ' + testBooking.id + ')');
        await prisma.booking.delete({ where: { id: testBooking.id } });

        // Test 2: User Schema Check
        console.log('🧪 Test 2: Checking User table schema...');
        // We try to update a user field that might be missing to trigger an error if it doesn't exist
        // or just select it. Selecting is safer but might not throw if prisma just returns undefined for partial matches in raw query,
        // but using prisma.findFirst should try to select the columns.
        const user = await prisma.user.findFirst({
            select: {
                id: true,
                failedAttempts: true,
                isBlocked: true,
                permissions: true
            }
        });

        if (user) {
            console.log('✅ Test 2 Passed: User fields read successfully.');
        } else {
            console.log('⚠️  Test 2: No users found, but query execution succeeded (Schema likely OK).');
        }

        console.log('🎉 ALL TESTS PASSED. Database schema seems correct.');

    } catch (e) {
        console.error('❌ DATABASE ERROR OCCURRED:');
        console.error(e);

        if (e.code === 'P2022') {
            console.error('👉 CAUSE: Missing Column in Database.');
            console.error('👉 FIX: Run "npx prisma migrate deploy" on the server.');
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
