const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Attempting to create a booking...");
    try {
        const booking = await prisma.booking.create({
            data: {
                patientName: "Test Patient",
                phone: "9800000000",
                testType: "Blood Test",
                date: new Date(),
                status: "PENDING",
                type: "LAB_VISIT",
                source: "WEBSITE",
                // Simulating unauthenticated user (no createdBy)
            },
        });
        console.log("Booking created successfully:", booking);
    } catch (error) {
        console.error("FAILED to create booking:");
        console.error(error);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
