"use client";

import { useState } from "react";
import {
  ArrowUpTrayIcon,
  CheckCircleIcon,
  DocumentMagnifyingGlassIcon,
  LockClosedIcon,
  UserPlusIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

// Mock database of verified certificates
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

// Mock hashing function
const mockHashFile = (fileName: string): string | null => {
  if (fileName.toLowerCase().includes("stanford")) return "QmX4k2P9mB7nF8qR5sL3vK9wE1tY6u2iO8p4mN7cV3xZ9";
  if (fileName.toLowerCase().includes("harvard")) return "QmA7sL3kP8mN5rF9qB2vK4wE6tY1u8iO3p9mC7xV2zN4";
  return `QmInvalidHash${Math.random().toString(36).substring(7)}`;
};

const VerifierDashboard = () => {
  // --- Auth State ---
  const [authMode, setAuthMode] = useState<"login" | "signup" | "dashboard">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // --- Verifier Dashboard State ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<"approved" | "invalid" | null>(null);
  const [verifiedCertificate, setVerifiedCertificate] = useState<(typeof mockVerifiedCertificates)[keyof typeof mockVerifiedCertificates] | null>(null);

  const handleLogin = () => {
    setAuthError("");
    if (!email || !password) {
      setAuthError("Please enter both email and password.");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      console.log("Attempting login for:", email);
      setAuthMode("dashboard");
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleSignUp = () => {
    setAuthError("");
    if (!email || !password || !companyName) {
      setAuthError("Please fill all fields to sign up.");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      console.log("Signing up company:", companyName, "with email:", email);
      setAuthMode("dashboard");
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
      setVerificationResult(null);
      setVerifiedCertificate(null);
    }
  };

  const handleVerification = () => {
    if (!selectedFile) return;
    setIsVerifying(true);
    setVerificationResult(null);

    setTimeout(() => {
      const fileHash = mockHashFile(selectedFile.name);
      const result = fileHash ? mockVerifiedCertificates[fileHash as keyof typeof mockVerifiedCertificates] : null;

      if (result) {
        setVerificationResult("approved");
        setVerifiedCertificate(result);
      } else {
        setVerificationResult("invalid");
        setVerifiedCertificate(null);
      }
      setIsVerifying(false);
    }, 1500);
  };

  // --- Conditional Rendering ---

  if (authMode !== "dashboard") {
    return (
      <div className="container mx-auto mt-20 flex justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center">
              {authMode === "login" ? (
                <LockClosedIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              ) : (
                <UserPlusIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              )}
              <h2 className="card-title justify-center text-2xl">{authMode === "login" ? "Verifier Login" : "Verifier Sign Up"}</h2>
            </div>

            {authMode === "signup" && (
              <div className="form-control">
                <label className="label"><span className="label-text">Company Name</span></label>
                <input type="text" placeholder="Your Company LLC" className="input input-bordered" value={companyName} onChange={e => setCompanyName(e.target.value)} />
              </div>
            )}
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="verifier@company.com" className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" placeholder="••••••••" className="input input-bordered" value={password} onChange={e => setPassword(e.target.value)} />
            </div>

            {authError && <div className="text-error text-sm mt-2">{authError}</div>}

            <div className="card-actions flex-col mt-4">
              <button className="btn btn-primary w-full" onClick={authMode === "login" ? handleLogin : handleSignUp} disabled={isAuthenticating}>
                {isAuthenticating && <span className="loading loading-spinner"></span>}
                {authMode === "login" ? "Login" : "Sign Up"}
              </button>
              <div className="divider text-xs">OR</div>
              <button className="btn btn-ghost w-full" onClick={() => setAuthMode(authMode === "login" ? "signup" : "login")}>
                {authMode === "login" ? "Create a New Account" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h1 className="card-title text-2xl">Company Verifier Dashboard</h1>
            <p className="mb-4">Upload a certificate file to verify its authenticity.</p>

            <div className="form-control w-full">
              <label className="label"><span className="label-text font-semibold">Certificate File</span></label>
              <input type="file" className="file-input file-input-bordered w-full" onChange={handleFileChange} />
            </div>

            <div className="card-actions justify-end mt-6">
              <button className="btn btn-primary" onClick={handleVerification} disabled={!selectedFile || isVerifying}>
                {isVerifying ? <span className="loading loading-spinner"></span> : <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />}
                {isVerifying ? "Verifying..." : "Verify Certificate"}
              </button>
            </div>

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
