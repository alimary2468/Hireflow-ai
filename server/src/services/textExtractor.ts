import fs from 'fs';
import path from 'path';

// Handle optional native modules with fallback to prevent crashes if pdf-parse has dynamic issues
export async function extractTextFromFile(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    if (ext === '.pdf') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const pdfParse = require('pdf-parse');
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer);
        return data.text || '';
      } catch (err) {
        console.warn('pdf-parse fallback reading standard text content:', err);
        const raw = fs.readFileSync(filePath, 'utf-8');
        return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
    } else if (ext === '.docx' || ext === '.doc') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ path: filePath });
        return result.value || '';
      } catch (err) {
        console.warn('mammoth fallback reading standard text content:', err);
        const raw = fs.readFileSync(filePath, 'utf-8');
        return raw.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
      }
    } else {
      // Plain text or fallback
      return fs.readFileSync(filePath, 'utf-8');
    }
  } catch (error: any) {
    console.error(`Error extracting text from ${filePath}:`, error);
    throw new Error(`Failed to extract text from file: ${error.message}`);
  }
}
