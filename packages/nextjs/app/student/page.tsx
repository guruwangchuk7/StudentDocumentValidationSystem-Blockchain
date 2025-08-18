"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  ShareIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

// --- Mock Data ---
const mockCertificates = [
  {
    id: "0x123abc",
    degreeName: "Bachelor of Computer Science",
    universityName: "Stanford University",
    graduationDate: "2024-05-15",
    certificateFileCID: "QmX4k2P9mB7nF8qR5sL3vK9wE1tY6u2iO8p4mN7cV3xZ9",
  },
  {
    id: "0x456def",
    degreeName: "Master of Business Administration",
    universityName: "Harvard Business School",
    graduationDate: "2023-12-10",
    certificateFileCID: "QmA7sL3kP8mN5rF9qB2vK4wE6tY1u8iO3p9mC7xV2zN4",
  },
];

// --- Reusable Certificate Card Component ---
const CertificateCard = ({ certificate }: { certificate: (typeof mockCertificates)[0] }) => {
  const handleShare = () => {
    if (certificate.certificateFileCID) {
      navigator.clipboard.writeText(`https://gateway.pinata.cloud/ipfs/${certificate.certificateFileCID}`);
      alert("Link to certificate copied to clipboard!");
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-lg font-bold mb-2">{certificate.degreeName}</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
              <BuildingOfficeIcon className="h-4 w-4" />
              <span>{certificate.universityName}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Graduated: {certificate.graduationDate}</span>
            </div>
          </div>
          <div className="badge badge-success text-success-content badge-outline">Verified</div>
        </div>
        <div className="bg-base-200 p-3 rounded-lg my-4">
          <p className="text-xs text-gray-500 mb-1">Certificate IPFS CID</p>
          <p className="text-sm font-mono text-gray-800 break-all">{certificate.certificateFileCID}</p>
        </div>
        <div className="card-actions justify-center space-x-2">
          <a
            href={`https://gateway.pinata.cloud/ipfs/${certificate.certificateFileCID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm flex-1"
          >
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download
          </a>
          <button onClick={handleShare} className="btn btn-outline btn-sm flex-1">
            <ShareIcon className="h-4 w-4 mr-2" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Student Page Component ---
const StudentPage = () => {
  // --- Auth State ---
  const [authMode, setAuthMode] = useState<"login" | "signup" | "dashboard">("login");
  const [identifier, setIdentifier] = useState(""); // For CID or Aadhaar
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // --- Dashboard State ---
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogin = () => {
    setAuthError("");
    if (!identifier || !password) {
      setAuthError("Please provide your identifier and password.");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      console.log("Attempting login for:", identifier);
      setAuthMode("dashboard");
      setIsAuthenticating(false);
    }, 1000);
  };

  const handleSignUp = () => {
    setAuthError("");
    if (!identifier || !email || !password) {
      setAuthError("Please fill all required fields to sign up.");
      return;
    }
    setIsAuthenticating(true);
    setTimeout(() => {
      console.log("Signing up user:", identifier, "with email:", email);
      setAuthMode("dashboard");
      setIsAuthenticating(false);
    }, 1000);
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
              <h2 className="card-title justify-center text-2xl">{authMode === "login" ? "Student Login" : "Student Sign Up"}</h2>
            </div>

            <div className="form-control">
              <label className="label"><span className="label-text">CID or Aadhaar Card Number</span></label>
              <input type="text" placeholder="Enter your identifier" className="input input-bordered" value={identifier} onChange={e => setIdentifier(e.target.value)} />
            </div>

            {authMode === "signup" && (
              <div className="form-control">
                <label className="label"><span className="label-text">Email</span></label>
                <input type="email" placeholder="student@example.com" className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            )}

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

  // --- Dashboard View ---
  const filteredCertificates = mockCertificates.filter(
    cert =>
      cert.degreeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.universityName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
          <p className="text-gray-600">Welcome, Student ({identifier})</p>
        </div>

        <div className="mb-8">
          <div className="card bg-base-100 shadow-md">
            <div className="card-body p-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your certificates..."
                  className="input input-bordered w-full pl-10"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map(cert => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
        </div>

        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Certificates Found</h3>
            <p className="text-gray-600">Your certificates will appear here once issued.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPage;
