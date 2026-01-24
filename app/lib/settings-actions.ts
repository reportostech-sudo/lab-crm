'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function getSystemSetting(key: string) {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key }
        });
        return setting?.value;
    } catch (error) {
        return null;
    }
}

export async function updateLogo(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            console.error('UpdateLogo: Unauthorized', session?.user?.id);
            return { message: 'Unauthorized' };
        }

        const file = formData.get('logo') as File;
        if (!file) {
            console.error('UpdateLogo: No file found in FormData');
            return { message: 'No file uploaded' };
        }

        console.log(`UpdateLogo: Receiving file ${file.name}, size: ${file.size}, type: ${file.type}`);

        if (file.size === 0) {
            return { message: 'File is empty' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure public/uploads exists
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        console.log(`UpdateLogo: Ensuring directory exists: ${uploadDir}`);

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (mkdirError) {
            console.error('UpdateLogo: Failed to create directory', mkdirError);
            // Continue, maybe it exists and recursive failed for some other reason, or writeFile will fail
        }

        const fileName = `logo-${Date.now()}.png`; // Force PNG to standardise
        const filePath = join(uploadDir, fileName);

        console.log(`UpdateLogo: Writing file to ${filePath}`);
        await writeFile(filePath, buffer);

        const logoUrl = `/uploads/${fileName}`;
        console.log(`UpdateLogo: File written. Updating DB with URL: ${logoUrl}`);

        // Save to DB
        await prisma.systemSetting.upsert({
            where: { key: 'logoUrl' },
            create: { key: 'logoUrl', value: logoUrl, description: 'Company Logo URL' },
            update: { value: logoUrl }
        });

        revalidatePath('/admin');
        console.log('UpdateLogo: Success');
        return { message: 'Logo updated successfully', success: true, url: logoUrl };
    } catch (error) {
        console.error('Logo upload error:', error);
        return { message: 'Failed to upload logo: ' + (error as Error).message };
    }
}

export async function toggleMaintenance(enabled: boolean) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized' };
        }

        await prisma.systemSetting.upsert({
            where: { key: 'maintenanceMode' },
            create: { key: 'maintenanceMode', value: String(enabled), description: 'System Maintenance Mode' },
            update: { value: String(enabled) }
        });

        revalidatePath('/');
        return { success: true, message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}` };
    } catch (error) {
        console.error('Toggle Maintenance Error:', error);
        return { success: false, message: 'Failed to update maintenance mode' };
    }
}

export async function getMaintenanceStatus() {
    // Publicly accessible, but maybe should be cached
    const value = await getSystemSetting('maintenanceMode');
    return value === 'true';
}

export async function clearSystemCache() {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized' };
        }

        revalidatePath('/', 'layout');
        return { success: true, message: 'System cache cleared successfully' };
    } catch (error) {
        console.error('Clear Cache Error:', error);
        return { success: false, message: 'Failed to clear cache' };
    }
}

export async function checkPgDumpAvailability() {
    try {
        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        await execPromise('pg_dump --version');
        return true;
    } catch (error) {
        return false;
    }
}
