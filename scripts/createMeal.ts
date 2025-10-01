/* eslint-disable no-console */
import { promises as fs } from 'fs';
import path from 'path';

const API_URL = 'https://api.backandfront.com.br/meals';
const TOKEN = "eyJraWQiOiJFVmVQS3F0OG1QM2I3ZUVueDZYZjdqN29vbGwyMnFYYnBocVRiZzgyMFwvcz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMzZjNGEzYS0xMGUxLTcwMmItMmNlYi0wZTMzYmM3YmE4ZjMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAuc2EtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3NhLWVhc3QtMV93cXpBZnc5aWEiLCJjbGllbnRfaWQiOiI2ZzY4amZtNjA1ZjVvcHQ2NmFoYmc2OWF1dCIsIm9yaWdpbl9qdGkiOiJlYzU1MjA3Yi05NTRhLTRhZDQtODY4OC02YWM1MDhmZmZlMGUiLCJpbnRlcm5hbElkIjoiMzNGMVJkRWdQZVVTalZOWnRsbVpkYmJ3eVV3IiwiZXZlbnRfaWQiOiIxODhiZGQxNi0zOTFmLTRmMTAtODZjNS1mZmMyMzU0ZDVjYjMiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzU4ODk4MjE5LCJleHAiOjE3NTg5NDE0MTksImlhdCI6MTc1ODg5ODIxOSwianRpIjoiMTc1M2M1NjgtYjM1NS00NTNkLWI1OTgtZDIwYzQ3NTcyNzU5IiwidXNlcm5hbWUiOiIxMzZjNGEzYS0xMGUxLTcwMmItMmNlYi0wZTMzYmM3YmE4ZjMifQ.sk2ysgWtUDlISq_PLGivbaj24C840BQzx_THYQ5mSgmXLCMNxzhwraco0KEK-eYgVJ-fXLI6OMBlOEWrLJR6X1ALio1cdG0eitCDjMd25yvjHjzoQbOaUN8PaH8oWRdDO4h93495qv63O6mUQJPY5pFgF9XKIGnHQRweuptKkuEFy5enoU6tqSHVJKynfxzH7Ia7zgyZzZCYqgTEsAtu7junxwdZ1xXwIe7p5tt32Bu6-qfAHqCzTFPOAuPA_l0EXDfsic11ns_KCL19oq5qJf7vn2sptktXml0JtEXYq6xMpKBsTfAAEejQm87bfng6BL90uk194KkXfIM-2qOv-w";

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
  console.log(
    `📦 Building FormData with ${Object.keys(fields).length} fields and file ${filename}`,
  );

  const form = new FormData();

  // adiciona os campos de texto
  for (const [key, value] of Object.entries(fields)) {
    form.append(key, value);
  }

  // converte Buffer → Uint8Array para ser aceito como BlobPart
  const blob = new Blob([new Uint8Array(fileData)], { type: fileType });

  // adiciona o arquivo
  form.append("file", blob, filename);

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
  path.resolve(__dirname, 'assets', 'audio.m4a'),
  'audio/m4a',
).catch(() => process.exit(1));