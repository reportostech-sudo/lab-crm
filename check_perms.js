
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            name: { in: ['Kapil', 'Oma', 'kapil', 'oma'] } // Case insensitive check might need more care but this is a quick check
        },
        select: { name: true, role: true, permissions: true, email: true }
    });

    console.log("Found Users:", JSON.stringify(users, null, 2));

    // Also check if any user has the permission 'mobile_attendance'
    const permittedUsers = await prisma.user.findMany({
        where: {
            permissions: { has: 'mobile_attendance' }
        },
        select: { name: true }
    });
    console.log("Users with mobile_attendance permission:", permittedUsers.map(u => u.name));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
