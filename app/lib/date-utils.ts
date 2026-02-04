import { format } from 'date-fns';

// Robust loading of nepali-date-converter
let NepaliDate: any;
let libError = "";

try {
    // Try standard import/require pattern compatible with Next.js Server Components
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Lib = require('nepali-date-converter');
    NepaliDate = Lib.default || Lib;
} catch (e: any) {
    console.warn("DateUtils: Failed to load nepali-date-converter", e);
    libError = e.message;
}

export type CalendarSystem = 'AD' | 'BS';

export function getLibraryStatus() {
    return libError ? `Error: ${libError}` : "Loaded Successfully";
}

/**
 * Formats a JavaScript Date object into a string based on the calendar system.
 */
export function formatDate(date: Date, system: CalendarSystem = 'AD', pattern: string = 'yyyy-MM-dd'): string {
    if (!date) return '';

    if (system === 'BS' && NepaliDate) {
        try {
            const bsDate = new NepaliDate(date);
            return bsDate.format(pattern.replace('yyyy', 'YYYY').replace('dd', 'DD'));
        } catch (e) {
            console.error("FormatBS Error", e);
            return format(date, pattern); // Fallback to AD
        }
    }

    return format(date, pattern);
}

/**
 * Parses a date string (AD or BS) to a JS Date object.
 * @param dateStr "YYYY-MM-DD"
 * @param system 'AD' or 'BS'
 */
export function parseDateString(dateStr: string, system: CalendarSystem = 'AD'): Date {
    if (!dateStr) return new Date();

    if (system === 'BS') {
        if (!NepaliDate) {
            console.error("ParseBS Error: Library not loaded");
            return new Date(0); // Error
        }

        try {
            // Manual parsing "YYYY-MM-DD"
            const parts = dateStr.split(/[-/]/).map(Number);
            if (parts.length === 3) {
                const [year, month, day] = parts;
                // NepaliDate constructor uses 0-based month
                const bsDate = new NepaliDate(year, month - 1, day);
                const jsDate = bsDate.toJsDate();

                if (isNaN(jsDate.getTime())) {
                    throw new Error("Invalid Date Result");
                }
                return jsDate;
            }
        } catch (e) {
            console.error("BS Date parse error:", dateStr, e);
            return new Date(0); // Explicit failure (1970)
        }
    }

    // AD Parsing
    const adDate = new Date(dateStr);
    return isNaN(adDate.getTime()) ? new Date() : adDate;
}

export function getCurrentYear(system: CalendarSystem = 'AD'): number {
    if (system === 'BS' && NepaliDate) {
        try {
            return new NepaliDate().getYear();
        } catch (e) { return new Date().getFullYear(); }
    }
    return new Date().getFullYear();
}

export function getMonthNames(system: CalendarSystem = 'AD'): string[] {
    if (system === 'BS') {
        return ['Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin', 'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'];
    }
    return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}

export function toNepaliDate(date: Date): any {
    if (!NepaliDate) return null;
    return new NepaliDate(date);
}

/**
 * Get number of days in a specific BS Month
 */
export function getBSDaysInMonth(year: number, month: number): number {
    if (!NepaliDate) return 30; // Fallback
    // Attempt to find days in month. 
    // Usually libraries have a static method or map. 
    // If not available, we can try converting end of month.
    // Hack: check day 32, 31, ...
    try {
        for (let d = 32; d >= 29; d--) {
            const date = new NepaliDate(year, month, d);
            if (date.getMonth() === month) return d;
        }
    } catch (e) { }
    return 30;
}
