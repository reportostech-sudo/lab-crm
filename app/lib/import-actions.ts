'use server';

import { auth } from '@/auth';
import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

export async function importTestsFromExcel(formData: FormData) {
    try {
        const session = await auth();
        if (session?.user?.role !== 'ADMIN') {
            return { message: 'Unauthorized' };
        }

        const file = formData.get('file') as File;
        if (!file) {
            return { message: 'No file uploaded' };
        }

        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (jsonData.length === 0) {
            return { message: 'Excel file is empty' };
        }

        let successCount = 0;
        let updateCount = 0;
        let errorCount = 0;

        for (const row of jsonData) {
            // Expected headers: Name, Price, Category, Description, TAT
            // Map checks loosely (case insensitive keys manually if needed, but assuming strict template)
            const name = row['Name'] || row['name'];
            const price = Number(row['Price'] || row['price']);
            const category = row['Category'] || row['category'] || 'General';
            const description = row['Description'] || row['description'] || '';
            const tat = row['TAT'] || row['tat'] || '';

            if (!name || isNaN(price)) {
                errorCount++;
                continue;
            }

            // Upsert: Update if exists by name, else Create
            // Note: Prisma upsert requires a unique constraint. If Name isn't unique in schema, we check first.
            // Schema check: model LabTest { id String @id ... name String ... } -> Name is not unique by default usually unless @unique
            // Let's check schema first logic below. Assuming Name logic uniqueness for business logic.

            // Upsert Category first
            let categoryId: string | undefined;
            if (category) {
                const normalizedCat = category.trim();
                const catRecord = await prisma.category.upsert({
                    where: { name: normalizedCat },
                    update: {},
                    create: { name: normalizedCat, description: 'Imported' },
                });
                categoryId = catRecord.id;
            }

            const existing = await prisma.labTest.findFirst({
                where: { name: { equals: name, mode: 'insensitive' } }
            });

            if (existing) {
                await prisma.labTest.update({
                    where: { id: existing.id },
                    data: {
                        price,
                        description,
                        tat,
                        categoryId, // Link relation
                        category: category || existing.category // Keep string sync for now
                    }
                });
                updateCount++;
            } else {
                await prisma.labTest.create({
                    data: {
                        name,
                        price,
                        description,
                        tat,
                        categoryId,
                        category: category || 'General'
                    }
                });
                successCount++;
            }
        }

        revalidatePath('/admin/tests');
        revalidatePath('/services');

        return {
            message: `Success! Added: ${successCount}, Updated: ${updateCount}, Skipped/Error: ${errorCount}`,
            success: true
        };

    } catch (error) {
        console.error('Import error:', error);
        return { message: 'Failed to process Excel file' };
    }
}
