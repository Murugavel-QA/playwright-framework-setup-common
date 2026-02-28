# Excel Test Data

Place your Excel test data files here.

## File Structure Example

Create Excel files with the following structure:

**File**: login-data.xlsx

**Sheet**: LoginData
| username  | password  | email              |
|-----------|-----------|-------------------|
| testuser  | pass123   | test@example.com  |

## Usage in Tests

```typescript
import { ExcelDataReader } from '../data-utils/excel-data-reader';

const reader = new ExcelDataReader();
const data = await reader.readExcelData('test-data-excel/login-data.xlsx', 'LoginData');
```

Delete this file once you add your own Excel files.
