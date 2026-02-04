const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@example.com';
    const newPassword = 'password123';
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log(`🔄 Ensuring Admin User Exists (${email})...`);

    try {
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                failedAttempts: 0,
                isBlocked: false,
                role: 'ADMIN', // Ensure role is ADMIN
            },
            create: {
                email,
                name: 'Admin User',
                password: hashedPassword,
                role: 'ADMIN',
                permissions: ['all'],
                isBlocked: false,
                failedAttempts: 0,
            },
        });

        console.log('✅ Admin User Ready!');
        console.log(`👤 Name: ${user.name}`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔑 Password: ${newPassword}`);
        console.log(`🛡️ Role: ${user.role}`);
    } catch (error) {
        console.error('❌ Error creating/updating user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
