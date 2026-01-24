const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
    try {
        const count = await prisma.auditLog.count();
        console.log(`Total AuditLogs: ${count}`);

        if (count > 0) {
            const logs = await prisma.auditLog.findMany({ take: 5 });
            console.log('Sample logs:', JSON.stringify(logs, null, 2));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

check();
