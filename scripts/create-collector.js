const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'collector@sukra.com';
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        console.log(`User ${email} already exists.`);
    } else {
        console.log(`Creating new collector user...`);
        await prisma.user.create({
            data: {
                name: 'Field Officer 1',
                email,
                password: hashedPassword,
                role: 'COLLECTOR',
                permissions: [], // Collectors usually don't need admin panel perms, they use /collector
            },
        });
    }
    console.log(`Collector ${email} ready.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
