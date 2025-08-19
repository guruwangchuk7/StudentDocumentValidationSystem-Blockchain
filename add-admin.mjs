// add-admin.mjs
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";
import inquirer from "inquirer";
import dotenv from "dotenv";

// Load environment variables from packages/nextjs/.env.local
dotenv.config({ path: "./packages/nextjs/.env.local" });

const saltRounds = 10; // Standard salt rounds for bcrypt

async function addAdmin() {
  console.log("--- Create a New Admin User ---");

  try {
    const answers = await inquirer.prompt([
      {
        type: "input",
        name: "email",
        message: "Enter the admin's email address:",
        validate: input => (input ? true : "Email cannot be empty."),
      },
      {
        type: "password",
        name: "password",
        message: "Enter the admin's password:",
        mask: "*",
        validate: input => (input ? true : "Password cannot be empty."),
      },
      {
        type: "input",
        name: "universityName",
        message: "Enter the university name:",
        validate: input => (input ? true : "University name cannot be empty."),
      },
    ]);

    const { email, password, universityName } = answers;

    // Hash the password
    console.log("\nHashing password...");
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Password hashed successfully.");

    // Connect to the database
    console.log("Connecting to the database...");
    const db = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT || "3306"),
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });
    console.log("Database connection successful.");

    // Insert the new admin
    console.log("Inserting new admin record...");
    await db.query("INSERT INTO admins (email, password_hash, university_name) VALUES (?, ?, ?)", [
      email,
      hashedPassword,
      universityName,
    ]);

    console.log("\n✅ Admin user created successfully!");
    console.log(`   Email: ${email}`);
    console.log(`   University: ${universityName}`);

    await db.end();
  } catch (error) {
    console.error("\n❌ An error occurred:", error.message);
  }
}

addAdmin();
