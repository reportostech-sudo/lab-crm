const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('🔍 Listing Registered Users:');
    console.log('------------------------------------------------');
    try {
        const users = await prisma.user.findMany({
            select: {
                email: true,
                role: true,
                name: true,
                isBlocked: true,
            }
        });

        if (users.length === 0) {
            console.log('❌ No users found in the database.');
            console.log('👉 You may need to register a new user or check your seed script.');
        } else {
            users.forEach(u => {
                console.log(`👤 Name: ${u.name}`);
                console.log(`📧 Email: ${u.email}`);
                console.log(`🔑 Role:  ${u.role}`);
                console.log(`🚫 Blocked: ${u.isBlocked ? 'YES' : 'No'}`);
                console.log('------------------------------------------------');
            });
            console.log(`\n💡 Password is usually "password123" or similar if this is a demo environment.`);
        }
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
