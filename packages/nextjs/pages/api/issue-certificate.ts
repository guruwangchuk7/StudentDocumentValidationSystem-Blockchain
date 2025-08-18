import { NextApiRequest, NextApiResponse } from "next";
import mysql from "mysql2/promise";
import PinataClient from "@pinata/sdk";
import formidable from "formidable";
import fs from "fs";

// Disable Next.js body parser for this route to handle file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const pinata = new PinataClient({ pinataJWTKey: process.env.PINATA_JWT });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    const {
      certificateId,
      studentFullName,
      gender,
      dateOfBirth,
      degreeName,
      graduationDate,
      universityName,
      studentIdentifier,
    } = fields;

    const certificateFile = files.file?.[0];

    if (!certificateFile) {
      return res.status(400).json({ error: "Certificate file is required." });
    }

    // 1. Upload file to Pinata
    const stream = fs.createReadStream(certificateFile.filepath);

    // --- ALTERNATIVE METHOD ---
    // This version calls pinFileToIPFS without the optional 'options' parameter.
    // The file will be pinned without custom metadata.
    const result = await pinata.pinFileToIPFS(stream);
    const ipfsCid = result.IpfsHash;
    // --- END OF ALTERNATIVE ---

    // 2. Save data to MySQL
    await db.beginTransaction();

    // Upsert student record
    await db.query(
      `INSERT INTO students (student_identifier, full_name, gender, date_of_birth)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE full_name = ?, gender = ?, date_of_birth = ?`,
      [
        studentIdentifier?.[0], studentFullName?.[0], gender?.[0], dateOfBirth?.[0],
        studentFullName?.[0], gender?.[0], dateOfBirth?.[0]
      ]
    );

    // Insert certificate record
    await db.query(
      `INSERT INTO certificates (certificate_id, student_identifier, degree_name, university_name, graduation_date, ipfs_cid)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        certificateId?.[0], studentIdentifier?.[0], degreeName?.[0], universityName?.[0], graduationDate?.[0], ipfsCid
      ]
    );

    await db.commit();

    res.status(200).json({ message: "Certificate issued successfully!", ipfsCid });
  } catch (error) {
    await db.rollback();
    console.error(error);
    res.status(500).json({ error: "An error occurred while issuing the certificate." });
  } finally {
    await db.end();
  }
}
