/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    try {
        const email = 'admin@sukra.com';
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('User not found. Creating admin user...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            user = await prisma.user.create({
                data: {
                    name: 'Admin User',
                    email,
                    password: hashedPassword,
                    role: 'ADMIN',
                },
            });
            console.log('Admin user created successfully.');
            console.log('Email: admin@sukra.com');
            console.log('Password: admin123');
        } else {
            console.log('User found:', user);
            // If role is incorrect, update it
            if (user.role !== 'ADMIN') {
                console.log('Updating user role to ADMIN...');
                await prisma.user.update({
                    where: { id: user.id },
                    data: { role: 'ADMIN' }
                });
                console.log('User role updated.');
            }
        }
    } catch (e) {
        console.error('Error finding/creating user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
