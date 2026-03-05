import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Utility class for reading test data from Excel files (.xlsx / .xls).
 *
 * Usage:
 *   const reader = new ExcelDataReader();
 *   const rows = reader.readSheet('test-data-excel/login-data.xlsx', 'LoginData');
 *   // rows → [{ username: 'user1', password: 'pass1' }, ...]
 */
export class ExcelDataReader {
    /**
     * Read all rows from a specific sheet in an Excel file.
     *
     * @param filePath  Path to the Excel file (relative to project root or absolute).
     * @param sheetName Name of the sheet to read.  If omitted, the first sheet is used.
     * @returns Array of objects where each key corresponds to a column header.
     */
    readSheet<T extends Record<string, unknown>>(
        filePath: string,
        sheetName?: string,
    ): T[] {
        const resolvedPath = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Excel file not found: ${resolvedPath}`);
        }

        const workbook = XLSX.readFile(resolvedPath);
        const targetSheet = sheetName ?? workbook.SheetNames[0];

        if (!workbook.SheetNames.includes(targetSheet)) {
            throw new Error(
                `Sheet "${targetSheet}" not found in "${resolvedPath}". ` +
                `Available sheets: ${workbook.SheetNames.join(', ')}`,
            );
        }

        const sheet = workbook.Sheets[targetSheet];
        return XLSX.utils.sheet_to_json<T>(sheet, { defval: '' });
    }

    /**
     * Read rows from a sheet and filter by a specific column value.
     *
     * @param filePath  Path to the Excel file.
     * @param sheetName Sheet name.
     * @param filterKey Column name to filter on.
     * @param filterValue Value to match.
     */
    readSheetFiltered<T extends Record<string, unknown>>(
        filePath: string,
        sheetName: string,
        filterKey: keyof T,
        filterValue: unknown,
    ): T[] {
        const rows = this.readSheet<T>(filePath, sheetName);
        return rows.filter((row) => row[filterKey] === filterValue);
    }

    /**
     * Retrieve all sheet names from an Excel workbook.
     *
     * @param filePath Path to the Excel file.
     */
    getSheetNames(filePath: string): string[] {
        const resolvedPath = path.isAbsolute(filePath)
            ? filePath
            : path.resolve(process.cwd(), filePath);

        if (!fs.existsSync(resolvedPath)) {
            throw new Error(`Excel file not found: ${resolvedPath}`);
        }

        const workbook = XLSX.readFile(resolvedPath);
        return workbook.SheetNames;
    }
}
