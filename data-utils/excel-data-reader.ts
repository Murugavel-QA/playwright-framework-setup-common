import * as xlsx from 'xlsx';
import * as path from 'path';

/**
 * Utility class for reading test data from Excel (.xlsx) files.
 * Supports static load-once-and-query pattern used across step definitions.
 *
 * Usage:
 *   ExcelDataReader.loadExcelFile('test-data-excel/login-data.xlsx');
 *   const row = ExcelDataReader.getDataByKey('LoginData', 'dataKey', 'submitter');
 */
export class ExcelDataReader {
  private static workbook: xlsx.WorkBook | null = null;
  private static filePath: string = '';

  /**
   * Loads an Excel file into memory for subsequent queries.
   * @param filePath - Path to the Excel file (relative to project root or absolute)
   */
  static loadExcelFile(filePath: string): void {
    const resolvedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);
    ExcelDataReader.workbook = xlsx.readFile(resolvedPath);
    ExcelDataReader.filePath = resolvedPath;
  }

  /**
   * Returns all rows from a given sheet as an array of objects.
   * @param sheetName - The name of the Excel sheet
   */
  static getSheetData(sheetName: string): Record<string, unknown>[] {
    if (!ExcelDataReader.workbook) {
      throw new Error(
        'No Excel file loaded. Call ExcelDataReader.loadExcelFile() first.'
      );
    }
    const sheet = ExcelDataReader.workbook.Sheets[sheetName];
    if (!sheet) {
      throw new Error(
        `Sheet "${sheetName}" not found in "${ExcelDataReader.filePath}". ` +
          `Available sheets: ${ExcelDataReader.workbook.SheetNames.join(', ')}`
      );
    }
    return xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet);
  }

  /**
   * Returns the first row from a sheet where the specified key column matches the given value.
   * @param sheetName  - The name of the Excel sheet
   * @param keyColumn  - The column header to search in
   * @param keyValue   - The value to match in the key column
   */
  static getDataByKey(
    sheetName: string,
    keyColumn: string,
    keyValue: string
  ): Record<string, unknown> {
    const rows = ExcelDataReader.getSheetData(sheetName);
    const match = rows.find((row) => String(row[keyColumn]) === keyValue);
    if (!match) {
      throw new Error(
        `No row found in sheet "${sheetName}" where "${keyColumn}" === "${keyValue}".`
      );
    }
    return match;
  }

  /**
   * Returns all rows from a sheet where the specified key column matches the given value.
   * @param sheetName  - The name of the Excel sheet
   * @param keyColumn  - The column header to search in
   * @param keyValue   - The value to match in the key column
   */
  static getAllDataByKey(
    sheetName: string,
    keyColumn: string,
    keyValue: string
  ): Record<string, unknown>[] {
    const rows = ExcelDataReader.getSheetData(sheetName);
    return rows.filter((row) => String(row[keyColumn]) === keyValue);
  }
}
