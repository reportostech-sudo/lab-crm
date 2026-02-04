"use client";

import { useRef, useState } from "react";
import { format } from "date-fns";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { Download, ClipboardList, Calendar } from "lucide-react";

interface MonthlyReportProps {
    data: any[];
    daysInMonth: number;
    year: number;
    month: number;
    calendarSystem: 'AD' | 'BS';
    timeline?: { day: number, weekday: string, isWeekend: boolean }[];
}

// Inline styles to bypass Tailwind v4 OKLCH/LAB colors for html2canvas
const REPORT_STYLES = {
    bgWhite: { backgroundColor: '#ffffff' },
    bgGray50: { backgroundColor: '#f9fafb' },
    bgGray100: { backgroundColor: '#f3f4f6' },

    textGray800: { color: '#000000' }, // Pure black for headers
    textGray600: { color: '#111827' }, // Very dark gray for In/Out times
    textGray500: { color: '#1f2937' }, // Dark gray for Durations
    textGray400: { color: '#374151' }, // Darker gray for labels
    textRed500: { color: '#ef4444' },
    textBlue600: { color: '#2563eb' },

    borderGray200: { borderColor: '#9ca3af' }, // Darker border for main sections
    borderGray100: { borderColor: '#d1d5db' }, // Darker border for inner grid

    status: {
        P: { backgroundColor: '#f0fdf4', color: '#15803d' },
        L: { backgroundColor: '#fefce8', color: '#a16207' },
        E: { backgroundColor: '#eff6ff', color: '#1d4ed8' },
        LE: { backgroundColor: '#faf5ff', color: '#7e22ce' },
        A: { backgroundColor: '#fef2f2', color: '#b91c1c' },
        W: { backgroundColor: '#f3f4f6', color: '#9ca3af' },
    }
};

export default function MonthlyAttendanceTable({ data, daysInMonth, timeline, year, month, calendarSystem }: MonthlyReportProps) {
    const printRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const employeeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [isExporting, setIsExporting] = useState(false);

    const displayDays = timeline || Array.from({ length: daysInMonth }, (_, i) => ({
        day: i + 1,
        weekday: '',
        isWeekend: false
    }));

    const handleExportPDF = async () => {
        if (!printRef.current || !headerRef.current) return;
        setIsExporting(true);

        const originalWidth = printRef.current.style.width;

        try {
            // Force fit-content for capture
            printRef.current.style.width = 'fit-content';

            // 1. Capture Header
            const headerCanvas = await html2canvas(headerRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                width: Math.max(1400, headerRef.current.scrollWidth),
                windowWidth: Math.max(1400, headerRef.current.scrollWidth) + 100
            });
            const headerImg = headerCanvas.toDataURL('image/png');

            // 2. Setup PDF
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 5; // Decreased margin
            const contentWidth = pageWidth - (margin * 2);
            const headerRatio = contentWidth / headerCanvas.width;
            const headerHeightInPdf = headerCanvas.height * headerRatio;

            let currentY = margin;

            // Function to add Header and reset currentY
            const addPageWithHeader = () => {
                pdf.addPage();
                pdf.addImage(headerImg, 'PNG', margin, margin, contentWidth, headerHeightInPdf);
                return margin + headerHeightInPdf + 4; // Minimal spacing
            };

            // Initial Header
            pdf.addImage(headerImg, 'PNG', margin, margin, contentWidth, headerHeightInPdf);
            currentY = margin + headerHeightInPdf + 4;

            // 3. Capture and Add each employee row
            for (let i = 0; i < data.length; i++) {
                const rowEl = employeeRefs.current[i];
                if (!rowEl) continue;

                const employeeCanvas = await html2canvas(rowEl, {
                    scale: 2,
                    useCORS: true,
                    backgroundColor: '#ffffff',
                    width: Math.max(1600, rowEl.scrollWidth), // Slightly wider base
                    windowWidth: Math.max(1600, rowEl.scrollWidth) + 100
                });
                const employeeImg = employeeCanvas.toDataURL('image/png');
                const employeeRatio = contentWidth / employeeCanvas.width;
                const employeeHeightInPdf = employeeCanvas.height * employeeRatio;

                // Check if this employee fits on current page
                if (currentY + employeeHeightInPdf > pageHeight - margin) {
                    currentY = addPageWithHeader();
                }

                pdf.addImage(employeeImg, 'PNG', margin, currentY, contentWidth, employeeHeightInPdf);
                currentY += employeeHeightInPdf + 4; // Add spacing between employees
            }

            // Revert styles
            printRef.current.style.width = originalWidth;

            pdf.save(`Attendance_Report_${year}_${month}.pdf`);

        } catch (error) {
            console.error(error);
            alert("Export Failed: " + (error as Error).message);
            if (printRef.current) printRef.current.style.width = originalWidth;
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* UI Header / Action Bar */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 px-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                        <ClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Monthly Attendance</h2>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span>{calendarSystem} {year}-{month}</span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-slate-800 text-white px-4 py-2 rounded-lg hover:bg-slate-700 disabled:opacity-50 text-sm font-medium transition-colors shadow-sm"
                >
                    <Download className="w-4 h-4" />
                    {isExporting ? 'Generating...' : 'Export PDF'}
                </button>
            </div>

            {/* Printable Content Wrapper */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div ref={printRef} style={{
                    backgroundColor: '#ffffff',
                    padding: '8px',
                    width: '100%'
                }}>
                    {/* 1. SHARED HEADER */}
                    <div ref={headerRef} className="mb-6 flex items-center justify-between pb-4"
                        style={{ borderBottom: `2px solid ${REPORT_STYLES.borderGray200.borderColor}`, backgroundColor: '#ffffff' }}>
                        <div className="flex items-center gap-3">
                            <ClipboardList className="w-12 h-12" style={REPORT_STYLES.textBlue600} />
                            <div>
                                <h1 className="text-4xl font-bold" style={REPORT_STYLES.textGray800}>Monthly Attendance Report</h1>
                                <p style={REPORT_STYLES.textGray500} className="text-lg font-medium">
                                    System: {calendarSystem} | Date: {year}-{month}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-bold uppercase tracking-wider" style={REPORT_STYLES.textGray400}>Generated On</p>
                                <p className="text-sm font-mono" style={REPORT_STYLES.textGray800}>{format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
                            </div>
                            <div style={{ width: '100px', height: '40px', position: 'relative' }}>
                                <img
                                    src="/images/logo.png"
                                    alt="Logo"
                                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 2. EMPLOYEE ROWS (captured individually) */}
                    <div className="overflow-x-auto" style={{ backgroundColor: '#ffffff' }}>
                        <div className="w-full pb-4">
                            {data.map((row: any, index: number) => (
                                <div
                                    key={row.user.id}
                                    ref={el => { employeeRefs.current[index] = el; }}
                                    className="mb-10 block"
                                    style={{ backgroundColor: '#ffffff' }}
                                >
                                    {/* Employee Header */}
                                    <div className="p-2 px-3 rounded-t-lg flex items-center justify-between"
                                        style={{
                                            ...REPORT_STYLES.bgGray50,
                                            border: `1px solid ${REPORT_STYLES.borderGray200.borderColor}`
                                        }}>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-xl uppercase" style={REPORT_STYLES.textGray800}>{row.user.name}</span>
                                            <span className="text-sm px-2 py-0.5 rounded font-bold"
                                                style={{
                                                    ...REPORT_STYLES.bgWhite,
                                                    border: `1px solid #e5e7eb`,
                                                    ...REPORT_STYLES.textGray500
                                                }}>
                                                {row.user.role}
                                            </span>
                                        </div>
                                        <div className="flex gap-3 text-[12px] font-bold uppercase tracking-wide">
                                            <span className="px-3 py-1 rounded shadow-sm" style={REPORT_STYLES.status.P}>P: {row.summary.present}</span>
                                            <span className="px-3 py-1 rounded shadow-sm" style={REPORT_STYLES.status.L}>L: {row.summary.late}</span>
                                            <span className="px-3 py-1 rounded shadow-sm" style={REPORT_STYLES.status.E}>E: {row.summary.early}</span>
                                            <span className="px-3 py-1 rounded shadow-sm" style={REPORT_STYLES.status.A}>A: {row.summary.absent}</span>
                                            <span className="px-3 py-1 rounded shadow-sm" style={{ ...REPORT_STYLES.bgGray100, border: `1px solid #e5e7eb`, ...REPORT_STYLES.textGray800 }}>Total: {row.summary.totalTime}</span>
                                        </div>
                                    </div>

                                    {/* Grid */}
                                    <div className="grid grid-cols-[80px_1fr] rounded-b-lg text-[10px]"
                                        style={{ border: `1px solid ${REPORT_STYLES.borderGray200.borderColor}`, borderTop: 'none' }}>
                                        {/* Left Headers */}
                                        <div className="flex flex-col"
                                            style={{
                                                ...REPORT_STYLES.bgGray50,
                                                borderRight: `1px solid ${REPORT_STYLES.borderGray100.borderColor}`
                                            }}>
                                            <div className="h-7 flex items-center px-2 font-bold" style={{ ...REPORT_STYLES.textGray500, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>Day</div>
                                            <div className="h-6 flex items-center px-2" style={{ ...REPORT_STYLES.textGray400, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>In</div>
                                            <div className="h-6 flex items-center px-2" style={{ ...REPORT_STYLES.textGray400, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>Out</div>
                                            <div className="h-6 flex items-center px-2" style={{ ...REPORT_STYLES.textGray400, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>Hrs</div>
                                            <div className="h-6 flex items-center px-2 font-bold" style={REPORT_STYLES.textGray400}>Sts</div>
                                            <div className="h-6 flex items-center px-2" style={{ ...REPORT_STYLES.textGray400, borderTop: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>Loc</div>
                                        </div>

                                        {/* Horizontal Data */}
                                        <div className="flex">
                                            {displayDays.map((t: any) => {
                                                const day = t.day;
                                                const record = row.records.find((r: any) => r.day === day);

                                                const inTime = record?.checkIn ? format(new Date(record.checkIn), 'HH:mm') : '-';
                                                const outTime = record?.checkOut ? format(new Date(record.checkOut), 'HH:mm') : '-';

                                                let duration = '-';
                                                if (record?.checkIn && record?.checkOut) {
                                                    const diff = new Date(record.checkOut).getTime() - new Date(record.checkIn).getTime();
                                                    const hrs = Math.floor(diff / (1000 * 60 * 60));
                                                    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                                                    duration = `${hrs}:${mins.toString().padStart(2, '0')}`;
                                                }

                                                let statusStyles = REPORT_STYLES.status.A;
                                                if (record) {
                                                    const stat = record.gridStatus || 'P';
                                                    if (stat === 'P') statusStyles = REPORT_STYLES.status.P;
                                                    else if (stat === 'L') statusStyles = REPORT_STYLES.status.L;
                                                    else if (stat === 'E') statusStyles = REPORT_STYLES.status.E;
                                                    else if (stat === 'L/E') statusStyles = REPORT_STYLES.status.LE;
                                                } else if (t.isWeekend) {
                                                    statusStyles = REPORT_STYLES.status.W;
                                                }

                                                const dayBg = t.isWeekend ? REPORT_STYLES.bgGray100 : { backgroundColor: 'transparent' };
                                                const dayText = t.isWeekend ? REPORT_STYLES.textRed500 : REPORT_STYLES.textGray800;

                                                return (
                                                    <div key={day} className="flex flex-col flex-1 min-w-[28px]"
                                                        style={{
                                                            ...dayBg,
                                                            borderRight: `1px solid ${REPORT_STYLES.borderGray100.borderColor}`
                                                        }}>
                                                        <div className="h-8 flex flex-col items-center justify-center font-bold leading-none"
                                                            style={{
                                                                ...dayText,
                                                                borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}`
                                                            }}>
                                                            <span className="text-[13px]">{day}</span>
                                                            <span className="text-[9px] font-normal opacity-60">{t.weekday}</span>
                                                        </div>
                                                        <div className="h-7 flex items-center justify-center font-mono text-[11px]"
                                                            style={{ ...REPORT_STYLES.textGray600, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>
                                                            {inTime}
                                                        </div>
                                                        <div className="h-7 flex items-center justify-center font-mono text-[11px]"
                                                            style={{ ...REPORT_STYLES.textGray600, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>
                                                            {outTime}
                                                        </div>
                                                        <div className="h-7 flex items-center justify-center text-[11px]"
                                                            style={{ ...REPORT_STYLES.textGray500, borderBottom: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>
                                                            {duration}
                                                        </div>
                                                        <div className="h-7 flex items-center justify-center font-bold text-[13px]"
                                                            style={statusStyles}>
                                                            {record ? (record.gridStatus || 'P') : (t.isWeekend ? 'W' : 'A')}
                                                        </div>
                                                        <div className="h-6 flex items-center justify-center"
                                                            style={{ borderTop: `1px solid ${REPORT_STYLES.borderGray100.borderColor}` }}>
                                                            {record?.checkInLat ? (
                                                                <a
                                                                    href={`https://maps.google.com/?q=${record.checkInLat},${record.checkInLng}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    title="View Location"
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
                                                                </a>
                                                            ) : '-'}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
