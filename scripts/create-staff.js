const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'staff@sukra.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Updating...`);
        await prisma.user.update({
            where: { email },
            data: {
                role: 'USER',
                permissions: ['bookings', 'packages'],
                password: hashedPassword
            },
        });
    } else {
        console.log(`Creating new staff user...`);
        await prisma.user.create({
            data: {
                name: 'Staff User',
                email,
                password: hashedPassword,
                role: 'USER',
                permissions: ['bookings', 'packages'],
            },
        });
    }
    console.log(`User ${email} ready with role USER and permissions ['bookings', 'packages']`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
