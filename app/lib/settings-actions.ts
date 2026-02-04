'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import AdmZip from 'adm-zip';

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
// ... existing code ...

export async function getCalendarSystem() {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: 'calendar_system' }
        });
        return setting?.value || "AD";
    } catch (error) {
        return "AD";
    }
}


export async function setCalendarSystem(system: "AD" | "BS") {
    try {
        await prisma.systemSetting.upsert({
            where: { key: 'calendar_system' },
            create: {
                key: 'calendar_system',
                value: system,
                description: 'Calendar System (AD/BS)'
            },
            update: {
                value: system
            }
        });

        revalidatePath('/', 'layout');
        return { success: true, message: `Calendar system updated to ${system}` };
    } catch (error) {
        return { error: "Failed to update calendar system" };
    }
}

export async function performSystemUpdate(action: 'prisma-migrate') {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized access', output: '' };
        }

        const { exec } = require('child_process');
        const util = require('util');
        const execPromise = util.promisify(exec);

        let command = '';
        if (action === 'prisma-migrate') {
            command = 'npx prisma migrate deploy';
        } else {
            return { success: false, message: 'Invalid action', output: '' };
        }

        const { stdout, stderr } = await execPromise(command, { cwd: process.cwd() });

        // Revalidate everything after update
        revalidatePath('/', 'layout');

        return {
            success: true,
            message: `Command executed successfully`,
            output: stdout || stderr
        };
    } catch (error) {
        console.error(`System Update Error (${action}):`, error);
        return {
            success: false,
            message: `Update failed: ${(error as Error).message}`,
            output: (error as any).stderr || (error as Error).message
        };
    }
}

export async function updateSystemFromFile(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { success: false, message: 'Unauthorized access' };
        }

        const file = formData.get('updateZip') as File;
        if (!file || file.name.split('.').pop()?.toLowerCase() !== 'zip') {
            return { success: false, message: 'Invalid file. Please upload a .zip file.' };
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Save temp zip
        const tempPath = join(process.cwd(), 'temp-update.zip');
        await writeFile(tempPath, buffer);

        // Extract
        const zip = new AdmZip(tempPath);
        zip.extractAllTo(process.cwd(), true); // Overwrite existing files

        // Clean up zip
        const fs = require('fs');
        fs.unlinkSync(tempPath);

        revalidatePath('/', 'layout');
        return { success: true, message: 'System updated from file successfully.' };
    } catch (error) {
        console.error('Update System From File Error:', error);
        return { success: false, message: `Update failed: ${(error as Error).message}` };
    }
}
