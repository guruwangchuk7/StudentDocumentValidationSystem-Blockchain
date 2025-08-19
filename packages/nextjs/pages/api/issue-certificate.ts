import type { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import PinataClient from "@pinata/sdk";
import formidable, { File as FormidableFile, Fields } from "formidable";
import fs from "fs";
import crypto from "crypto";

export const config = { api: { bodyParser: false } };

// Compute SHA-256 (hex)
const hashFile = (filePath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const hash = crypto.createHash("sha256");
    const stream = fs.createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", reject);
  });

const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT as string });

function firstField(fields: Fields, key: string): string {
  const v = fields[key];
  if (Array.isArray(v)) return String(v[0] ?? "");
  if (typeof v === "string") return v;
  return "";
}
function firstFile(files: formidable.Files, key: string): FormidableFile | undefined {
  const arr = (files as Record<string, FormidableFile[] | undefined>)[key];
  if (Array.isArray(arr) && arr.length > 0) return arr[0];
  return undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const form = formidable({ multiples: false, keepExtensions: true, maxFileSize: 50 * 1024 * 1024 });

    const { fields, files } = await new Promise<{ fields: Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, flds, fls) => (err ? reject(err) : resolve({ fields: flds, files: fls })));
    });

    const certificateId = firstField(fields, "certificateId");
    const studentFullName = firstField(fields, "studentFullName");
    const gender = firstField(fields, "gender");
    const dateOfBirth = firstField(fields, "dateOfBirth");
    const degreeName = firstField(fields, "degreeName");
    const graduationDate = firstField(fields, "graduationDate");
    const universityName = firstField(fields, "universityName");
    const studentIdentifier = firstField(fields, "studentIdentifier");

    const certificateFile = firstFile(files, "file");

    if (!certificateFile) return res.status(400).json({ error: "Certificate file is required." });
    if (!certificateId || !studentFullName || !degreeName || !universityName || !studentIdentifier) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // 1) hash
    const certificateHash = await hashFile(certificateFile.filepath);

    // 2) pin to IPFS with a filename to satisfy pinata metadata requirement
    const readStream = fs.createReadStream(certificateFile.filepath);
    const pinataResult = await pinata.pinFileToIPFS(readStream, {
      pinataMetadata: {
        name:
          certificateFile.originalFilename ||
          (certificateId ? `certificate-${certificateId}` : undefined) ||
          "certificate",
      },
      pinataOptions: { cidVersion: 1 },
    });
    const ipfsCid = pinataResult.IpfsHash;

    // 3) DB writes
    await db.beginTransaction();

    await db.query(
      `
      INSERT INTO students (student_identifier, full_name, gender, date_of_birth)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), gender = VALUES(gender), date_of_birth = VALUES(date_of_birth)
      `,
      [studentIdentifier, studentFullName, gender || null, dateOfBirth || null]
    );

    await db.query(
      `
      INSERT INTO certificates (certificate_id, student_identifier, degree_name, university_name, graduation_date, ipfs_cid, certificate_hash)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      `,
      [certificateId, studentIdentifier, degreeName, universityName, graduationDate || null, ipfsCid, certificateHash]
    );

    await db.commit();

    return res.status(200).json({
      message: "Certificate issued successfully!",
      ipfsCid,
      certificateHash,
    });
  } catch (err: any) {
    try { await db.rollback(); } catch {}
    console.error("Issue Certificate API Error:", err);
    return res.status(500).json({ error: err?.message || "An error occurred while issuing the certificate." });
  } finally {
    await db.end();
  }
}
