import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.backandfront.com.br/meals';
const TOKEN = 'IQoJb3JpZ2luX2VjEML//////////wEaCXNhLWVhc3QtMSJGMEQCICIfPnKmN6asnwWmFeEWb8I4c6v4QrJaGelFOQQSLopLAiAjWCr9SqnOYDTdLwliw522NGH5Bpe/tMzq5/hcHaJslCqAAwhLEAAaDDYwNjAxMDE4MTcwMSIMKXCWTKLXLWevdzkSKt0CRkxlu9sVyKrI8txBuEGL2LAZZR12UB4F2ISnepXF0jDKR0V478IdON0+wWbk0hgrRMNvaKw2pqzuBm0FmL9KINsIXg1OQPSFO1IH/X2co3Vz4YYLbmw1Pl+zNxWZM2fdVvbJjoZaQGUEHF4bwRKP2eDTC1e40f4MH+NC2PphINuydv7Fex4ZKQThHPGmU+IobfsuVy6w1b//Nfi3wy4dDm7gLgdQsuDMONujSDhND/vaUX0zCoD2bBwPABHNgumWDMIGmUehcwgC1wo3BjZO7EZN0bHLDMJvIYFjyKXHut8D+HYcfQ/LQwbnUUa7BIVbOlNgolNnNZUm4jC486skCYWn8aqBIpSomdGqW14kCYGo+ko4f6kdRXHhnJPpiWggrb9WWR47RPhW+RhSwK2xjD7ayZMroHXPyB1xPw94dJ2epET34g0+uai8i1suU8INXBndgkX9ZgUo02D9bzDZv8vGBjqfAYOG1G5SeFY7gl8gvRB7rQyjAFHDqGDg4KbsdyllzRQBwDNyBd+7EuA0yiyN9kAQG/6A+3aFVw0wUqWQQ+Q8eFtiMoXuBR6+wfcQvXfdr+CQA2w/PBU9LLbk5MyXgH8C/zG/KF94sIAAq8xLD+BuuBv+VVDwVpB4do6CJwQByqZxf6VmHjzsYdNvOYo5pF7tEdQO5mbWYkiizDZ31PRvNw==';
interface IPresignResponse {
  uploadSignature: string;
}

interface IPresignDecoded {
  url: string;
  fields: Record<string, string>;
}

async function readFile(filePath: string, type: 'audio/m4a' | 'image/jpeg'): Promise<{
  data: Buffer;
  size: number;
  type: string;
}> {
  console.log(`🔍 Reading file from disk: ${filePath}`);
  const data = await fs.readFile(filePath);
  return {
    data,
    size: data.length,
    type,
  };
}

async function createMeal(
  fileType: string,
  fileSize: number,
): Promise<IPresignDecoded> {
  console.log(`🚀 Requesting presigned POST for ${fileSize} bytes of type ${fileType}`);
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({ file: { type: fileType, size: fileSize } }),
  });

  if (!res.ok) {
    throw new Error(`Failed to get presigned POST: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as IPresignResponse;
  const decoded = JSON.parse(
    Buffer.from(json.uploadSignature, 'base64').toString('utf-8'),
  ) as IPresignDecoded;

  console.log('✅ Received presigned POST data');
  return decoded;
}

function buildFormData(
  fields: Record<string, string>,
  fileData: Buffer,
  filename: string,
  fileType: string,
): FormData {
  console.log(`📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`);
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
    
  }
  const blob = new Blob([new Uint8Array(fileData)], { type: fileType });
  form.append('file', blob, filename);
  return form;
}

async function uploadToS3(url: string, form: FormData): Promise<void> {
  console.log(`📤 Uploading to S3 at ${url}`);
  const res = await fetch(url, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText} — ${text}`);
  }

  console.log('🎉 Upload completed successfully');
}

async function uploadFile(filePath: string, fileType: 'audio/m4a' | 'image/jpeg'): Promise<void> {
  try {
    const { data, size, type } = await readFile(filePath, fileType);
    const { url, fields } = await createMeal(type, size);
    const form = buildFormData(fields, data, path.basename(filePath), type);
    await uploadToS3(url, form);
  } catch (err) {
    console.error('❌ Error during uploadFile:', err);
    throw err;
  }
}

uploadFile(
  path.resolve(__dirname, 'assets', 'cover.jpg'),
  'image/jpeg',
).catch(() => process.exit(1));