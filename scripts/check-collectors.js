const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const collectors = await prisma.user.findMany({
        where: { role: 'COLLECTOR' },
        select: { id: true, name: true, email: true }
    });
    console.log("Collectors:", JSON.stringify(collectors, null, 2));
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
