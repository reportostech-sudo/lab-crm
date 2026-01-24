const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@sukra.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists. Updating password...`);
        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'ADMIN',
                permissions: ['bookings', 'doctors', 'packages', 'patients', 'reports']
            },
        });
        console.log(`Updated user: ${email} with password: ${password}`);
    } else {
        console.log(`Creating new admin user...`);
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'ADMIN',
                permissions: ['bookings', 'doctors', 'packages', 'patients', 'reports'],
            },
        });
        console.log(`Created user: ${email} with password: ${password}`);
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
