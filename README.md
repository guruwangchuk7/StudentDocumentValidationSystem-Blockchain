# StudentDocumentValidationSystem-Blockchain

# 🚀 Project Overview

The **Student Certificate Validation DApp** is a decentralized application that enables educational authorities to issue student certificates securely and allows companies to verify them with confidence.
The system uses **Ethereum blockchain** and **IPFS** for immutable and tamper-proof storage of certificate data.

---

# 👥 Team Members


**Team Lead:** Guru Wangchuk

**GitHub:** \[guruwangchuk7]

**Role:** Full Stack Developer & Blockchain Developer


**Member:** Sangay Rinchen

**GitHub:** \[]

**Role:** FrontEnd Developer


**Team Lead:** Lhawang Jamtsho

**GitHub:** \[]

**Role:** FrontEnd Developer

# 🛠️ Technology Stack

### --Frontend--

* Next.js 14 (App Router)
* TypeScript
* Tailwind CSS
* Heroicons
* Axios
* React Hooks
* Toast

### --Backend--

* Node.js + Express.js
* Pinata IPFS API
* Ethers.js
* Solidity Smart Contracts (Truffle / Scaffold-ETH)

### --Database--

* MySQL 

### --Other Tools--

* Pinata (IPFS)
* Scaffold-ETH 2
* Hardhat (local blockchain)

---
---

### --- Installation Guide: StudentDocumentValidationSystem-Blockchain ---

This guide provides step-by-step instructions to set up and run the Student Document Validation System on a new machine.

## Prerequisites

1. **Git**  
   Ensure Git is installed on your system.  
   [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

2. **Node.js & npm**  
   Install Node.js (which comes with npm) for JavaScript backend/frontend dependencies.
   [Install Node.js](https://nodejs.org/)

3. **MongoDB or Other Database**  
   If the project uses a database, ensure MongoDB (or the required DB) is installed and running.
   [Install MongoDB](https://docs.mongodb.com/manual/installation/)

4. **Other dependencies**  
   - (Optional) Docker (if the project provides Docker support)
   - Specific blockchain client (e.g., Ganache for Ethereum development)

## Steps

### 1. Clone the Repository

```bash
git clone https://github.com/guruwangchuk7/StudentDocumentValidationSystem-Blockchain.git
cd StudentDocumentValidationSystem-Blockchain
```

### 2. Install Dependencies

If the project uses Node.js:

```bash
npm install
```

If there is a backend and frontend folder, repeat the install in each:

```bash
cd backend
npm install
cd ../frontend
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root (or as specified in the documentation).  
Example:

```
DB_URI=mongodb://localhost:27017/your-db-name
PORT=3000
BLOCKCHAIN_NETWORK=http://localhost:8545
```

Refer to `.env.example` if available.

### 4. Database Setup

- Start your MongoDB server (or required DB).
- Run any migration or seed scripts if provided.

### 5. Blockchain Network Setup

- Start your local blockchain node (e.g., Ganache).
- Configure the network URL in `.env`.

### 6. Run the Application

If single package:

```bash
npm start
```

If separate backend/frontend:

```bash
# In backend folder
npm start

# In frontend folder
npm start
```

### 7. Access the App

- Visit `http://localhost:3000` (or the configured port) in your browser.

## Troubleshooting

- Check logs for errors.
- Ensure all environment variables are set correctly.
- Check database and blockchain node connectivity.

---

**For any issues, open an issue on [GitHub Issues](https://github.com/guruwangchuk7/StudentDocumentValidationSystem-Blockchain/issues).**
---
# 🎯 Problem Statement

Many people and organizations struggle to verify the authenticity of certificates.
Traditional systems are often **slow, costly**, and **vulnerable to fraud**, affecting employers, schools, and students alike.

---

## 🔑 Key Questions & Answers

### What traditional centralized problem are you solving with decentralization?

By storing certificates on **IPFS** and registering them on the **Ethereum blockchain**, we eliminate reliance on a single institution. Employers can verify certificates instantly—**no third-party or university contact required.**

### How does your application empower users with data ownership?

Students control their own verified, immutable certificates via IPFS. Once issued, universities cannot modify or revoke them—ensuring **permanent, tamper-proof proof of education.**
This grants **global shareability and user-owned credentials**.

---

# 💡 Solution Breakdown

### ✅ Decentralized Architecture

* Uses **Ethereum + IPFS** for transparent, trustless data validation
* No reliance on central institutions

### ✅ User Empowerment

* Students retain **full control** over their data
* Institutions can’t delete, modify, or restrict access

### ✅ Innovation Factor

* One of the first DApps to offer secure, blockchain-based certificate verification
* Bridges real-world educational records with decentralized technology

# 🌟 Key Features

* **Decentralized Identity Management:** Self-sovereign identity features
* **Data Ownership:** Students control their data via IPFS
* **Blockchain Integration:** Transparent certificate issuance and verification
* **User Authentication:** Decentralized login/session management
* **\[Custom Feature 1]:** \[Description]
* **\[Custom Feature 2]:** \[Description]

---

# 🔐 Security & Privacy

* **Data Protection:** Encryption and secure file handling
* **Smart Contract Security:** Best practices for contract security
* **Privacy Features:** Tamper-proof, user-owned credentials

---

# 📱 Demo Links

* **Live Demo:** \[Insert URL if deployed]
* **Video Demo:** \[Insert link]
* **Presentation Slides:** \[Insert link]

---

# 📄 License

See `License.txt` for full license terms.

