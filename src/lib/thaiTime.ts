/**
 * Thailand Timezone Utilities (UTC+7)
 * ใช้สำหรับจัดการเวลาในประเทศไทย
 */

const THAILAND_TIMEZONE = 'Asia/Bangkok';

/**
 * แปลง Date เป็น ISO string ในเวลาประเทศไทย
 * เช่น 2026-01-28T13:30:00+07:00
 */
export function toThaiISOString(date: Date): string {
    // Get Thailand time offset (+7 hours)
    const thaiOffset = 7 * 60; // in minutes
    const localOffset = date.getTimezoneOffset(); // in minutes (negative for ahead of UTC)
    const diffMinutes = thaiOffset + localOffset;

    // Adjust the date to Thai timezone
    const thaiTime = new Date(date.getTime() + diffMinutes * 60 * 1000);

    // Format as ISO string with +07:00 offset
    const year = thaiTime.getUTCFullYear();
    const month = String(thaiTime.getUTCMonth() + 1).padStart(2, '0');
    const day = String(thaiTime.getUTCDate()).padStart(2, '0');
    const hours = String(thaiTime.getUTCHours()).padStart(2, '0');
    const minutes = String(thaiTime.getUTCMinutes()).padStart(2, '0');
    const seconds = String(thaiTime.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+07:00`;
}

/**
 * แปลง ISO string เป็น Date object ที่ตรงกับเวลาประเทศไทย
 * ใช้สำหรับแสดงผลใน format functions
 */
export function parseThaiDate(isoString: string): Date {
    // If the string already has timezone info, use it directly
    if (isoString.includes('+') || isoString.includes('Z')) {
        return new Date(isoString);
    }

    // If no timezone, assume it's Thailand time and add +07:00
    return new Date(isoString + '+07:00');
}

/**
 * Format เวลาเป็นรูปแบบ HH:mm ในเวลาประเทศไทย
 */
export function formatThaiTime(date: Date | string): string {
    const d = typeof date === 'string' ? parseThaiDate(date) : date;
    return d.toLocaleTimeString('th-TH', {
        timeZone: THAILAND_TIMEZONE,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}

/**
 * Format วันที่เป็นรูปแบบ dd MMM ในเวลาประเทศไทย
 */
export function formatThaiDateShort(date: Date | string): string {
    const d = typeof date === 'string' ? parseThaiDate(date) : date;
    return d.toLocaleDateString('en-GB', {
        timeZone: THAILAND_TIMEZONE,
        day: '2-digit',
        month: 'short'
    });
}

/**
 * Format วันที่เป็นรูปแบบ yyyy-MM-dd ในเวลาประเทศไทย
 */
export function formatThaiDateISO(date: Date | string): string {
    const d = typeof date === 'string' ? parseThaiDate(date) : date;
    const year = d.toLocaleString('en-CA', { timeZone: THAILAND_TIMEZONE, year: 'numeric' });
    const month = d.toLocaleString('en-CA', { timeZone: THAILAND_TIMEZONE, month: '2-digit' });
    const day = d.toLocaleString('en-CA', { timeZone: THAILAND_TIMEZONE, day: '2-digit' });
    return `${year}-${month}-${day}`;
}

/**
 * Get current date/time in Thailand timezone
 */
export function getThaiNow(): Date {
    return new Date();
}

/**
 * Format เวลาพร้อมวันที่เป็นรูปแบบ "HH:mm • dd MMM" ในเวลาประเทศไทย
 */
export function formatThaiDateTime(date: Date | string): string {
    const time = formatThaiTime(date);
    const dateStr = formatThaiDateShort(date);
    return `${time} • ${dateStr}`;
}

/**
 * ตรวจสอบว่าวันที่ตรงกับวันนี้ในเวลาประเทศไทยหรือไม่
 */
export function isThaiToday(date: Date | string): boolean {
    const dateISO = formatThaiDateISO(date);
    const todayISO = formatThaiDateISO(new Date());
    return dateISO === todayISO;
}
