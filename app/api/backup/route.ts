import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { auth } from '@/auth';

export async function GET() {
    // 1. Check Auth (Admin only)
    const session = await auth();
    if (session?.user?.role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    // 2. Prepare Headers for Download
    const filename = `backup-${new Date().toISOString().replace(/[:.]/g, '-')}.sql`;
    const headers = new Headers();
    headers.append('Content-Disposition', `attachment; filename="${filename}"`);
    headers.append('Content-Type', 'application/sql');

    // 3. Database Connection Info from ENV
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        return new NextResponse('DATABASE_URL not configured', { status: 500 });
    }

    // 4. Verify pg_dump exists first
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        await execPromise('pg_dump --version');
    } catch (err) {
        console.error('pg_dump validation failed:', err);
        return new NextResponse(JSON.stringify({ error: 'pg_dump not found on server. Please use JSON Level Export.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    // 5. Spawn pg_dump
    // Need to parse the URL or pass it directly if pg_dump supports it.

    // We wrap this in a promise to detect startup errors (like ENOENT)
    try {
        const dumpProcess = spawn('pg_dump', [dbUrl]);

        // Handle immediate cheat startup error
        dumpProcess.on('error', (err) => {
            console.error('pg_dump spawn error:', err);
            // We can't easily change the response status once streaming starts, 
            // but if it fails immediately before we return, we might catch it.
        });

        const stream = new ReadableStream({
            start(controller) {
                dumpProcess.stdout.on('data', (chunk) => {
                    controller.enqueue(chunk);
                });

                dumpProcess.stdout.on('end', () => {
                    controller.close();
                });

                dumpProcess.stderr.on('data', (data) => {
                    console.error('pg_dump stderr:', data.toString());
                });

                dumpProcess.on('error', (err) => {
                    console.error('pg_dump runtime error:', err);
                    controller.error(err);
                });
            },
            cancel() {
                dumpProcess.kill();
            }
        });

        return new NextResponse(stream, { headers });
    } catch (e) {
        return new NextResponse(JSON.stringify({ error: 'Failed to start pg_dump. Is it installed?' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
