"use client";

import { useState } from "react";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

// Mock database of verified certificates with their file hashes and details.
// In a real application, this check would be done against the blockchain.
const mockVerifiedCertificates = {
  "QmX4k2P9mB7nF8qR5sL3vK9wE1tY6u2iO8p4mN7cV3xZ9": {
    studentFullName: "John Doe",
    degreeName: "Bachelor of Computer Science",
    universityName: "Stanford University",
    graduationDate: "2024-05-15",
  },
  "QmA7sL3kP8mN5rF9qB2vK4wE6tY1u8iO3p9mC7xV2zN4": {
    studentFullName: "Jane Smith",
    degreeName: "Master of Business Administration",
    universityName: "Harvard Business School",
    graduationDate: "2023-12-10",
  },
};

// This is a mock hashing function. A real implementation would use a library
// like crypto-js or a backend service to generate the actual IPFS CID (hash).
const mockHashFile = (fileName: string): string | null => {
  if (fileName.includes("stanford")) {
    return "QmX4k2P9mB7nF8qR5sL3vK9wE1tY6u2iO8p4mN7cV3xZ9";
  }
  if (fileName.includes("harvard")) {
    return "QmA7sL3kP8mN5rF9qB2vK4wE6tY1u8iO3p9mC7xV2zN4";
  }
  return null; // File not recognized
};

const VerifierDashboard = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"approved" | "invalid" | null>(null);
  const [verifiedCertificate, setVerifiedCertificate] = useState<(typeof mockVerifiedCertificates)[keyof typeof mockVerifiedCertificates] | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setVerificationResult(null); // Reset result when a new file is chosen
      setVerifiedCertificate(null);
    }
  };

  const handleVerification = () => {
    if (!selectedFile) {
      alert("Please select a certificate file to verify.");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    // Simulate the delay of hashing and checking the blockchain
    setTimeout(() => {
      const fileHash = mockHashFile(selectedFile.name);

      if (fileHash && mockVerifiedCertificates[fileHash as keyof typeof mockVerifiedCertificates]) {
        setVerificationResult("approved");
        setVerifiedCertificate(mockVerifiedCertificates[fileHash as keyof typeof mockVerifiedCertificates]);
      } else {
        setVerificationResult("invalid");
        setVerifiedCertificate(null);
      }
      setIsVerifying(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Company Verifier Dashboard</h1>
            <p className="mb-4">Upload a certificate file to verify its authenticity.</p>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text font-semibold">Certificate File</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <div className="card-actions justify-end mt-6">
              <button className="btn btn-primary" onClick={handleVerification} disabled={!selectedFile || isVerifying}>
                {isVerifying ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
                )}
                {isVerifying ? "Verifying..." : "Verify Certificate"}
              </button>
            </div>

            {/* Verification Result Section */}
            {verificationResult && (
              <div className="mt-6">
                {verificationResult === "approved" && verifiedCertificate && (
                  <div className="alert alert-success">
                    <CheckCircleIcon className="h-6 w-6" />
                    <div>
                      <h3 className="font-bold">Verification Approved!</h3>
                      <div className="text-sm">
                        <p><b>Student:</b> {verifiedCertificate.studentFullName}</p>
                        <p><b>Degree:</b> {verifiedCertificate.degreeName}</p>
                        <p><b>University:</b> {verifiedCertificate.universityName}</p>
                        <p><b>Graduation:</b> {verifiedCertificate.graduationDate}</p>
                      </div>
                    </div>
                  </div>
                )}
                {verificationResult === "invalid" && (
                  <div className="alert alert-error">
                    <XCircleIcon className="h-6 w-6" />
                    <div>
                      <h3 className="font-bold">Verification Failed</h3>
                      <div className="text-sm">The uploaded certificate is invalid or not found in the registry.</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierDashboard;
