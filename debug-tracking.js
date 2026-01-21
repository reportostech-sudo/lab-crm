/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('--- Simulating Location Update ---');

        const email = 'ram@ram.com'; // Target user

        // Kathmandu coordinates
        const lat = 27.7172;
        const lng = 85.3240;

        await prisma.user.update({
            where: { email },
            data: {
                lastLat: lat,
                lastLng: lng,
                lastLocationUpdate: new Date()
            }
        });

        console.log(`Updated location for ${email} to ${lat}, ${lng}`);
        console.log('Please check the Admin Map now.');

    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
