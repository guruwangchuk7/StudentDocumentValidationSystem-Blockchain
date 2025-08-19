"use client";

import { useState, useRef } from "react";
import { ArrowUpOnSquareIcon, LockClosedIcon } from "@heroicons/react/24/outline";

const UniversityAdmin = () => {
  // --- Login State ---
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- Form State ---
  const [certificateIdInput, setCertificateIdInput] = useState("");
  const [studentFullName, setStudentFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [degreeName, setDegreeName] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentIdentifier, setStudentIdentifier] = useState(""); // For CID or Aadhaar

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // ✅ separate loading state

  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ to reset file input

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  // --- Login Function ---
  const handleLogin = async () => {
    setLoginError("");
    setIsLoggingIn(true);

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setLoginError("Invalid account. Please check your credentials.");
        return;
      }

      setIsLoggedIn(true);
    } catch (e: any) {
      setLoginError("An error occurred. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // --- Submit Certificate ---
  const handleSubmit = async () => {
    setError("");
    setStatus("");

    if (
      !certificateIdInput ||
      !studentFullName ||
      !degreeName ||
      !universityName ||
      !selectedFile ||
      !studentIdentifier
    ) {
      setError("Please fill out all required fields.");
      return;
    }

    setIsSubmitting(true); // ✅ start loading

    const formData = new FormData();
    formData.append("certificateId", certificateIdInput);
    formData.append("studentFullName", studentFullName);
    formData.append("gender", gender);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("degreeName", degreeName);
    formData.append("graduationDate", graduationDate);
    formData.append("universityName", universityName);
    formData.append("studentIdentifier", studentIdentifier);
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/issue-certificate", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }

      // ✅ success
      setStatus("Certificate issued successfully!");

      // ✅ reset form after success
      setCertificateIdInput("");
      setStudentFullName("");
      setGender("");
      setDateOfBirth("");
      setDegreeName("");
      setGraduationDate("");
      setUniversityName("");
      setSelectedFile(null);
      setStudentIdentifier("");

      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // ✅ clear file input
      }
    } catch (e: any) {
      console.error("Error issuing certificate:", e);
      setError(e.message);
    } finally {
      setIsSubmitting(false); // ✅ stop loading
    }
  };

  // --- Conditional Rendering ---
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto mt-20 flex justify-center">
        <div className="card w-96 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="text-center">
              <LockClosedIcon className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="card-title justify-center text-2xl">Admin Login</h2>
              <p className="text-sm text-gray-500">Access the certificate issuance dashboard.</p>
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" placeholder="admin@university.edu" className="input input-bordered" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" placeholder="••••••••" className="input input-bordered" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            {loginError && <div className="text-error text-sm mt-2">{loginError}</div>}
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary w-full" onClick={handleLogin} disabled={isLoggingIn}>
                {isLoggingIn && <span className="loading loading-spinner"></span>}
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-10 p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Issue Student Certificate</h1>
          <p className="mb-4">Fill in the details below and upload the certificate file.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Certificate ID*</span></label>
              <input type="text" placeholder="e.g., cert-12345" className="input input-bordered" value={certificateIdInput} onChange={e => setCertificateIdInput(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Student Full Name*</span></label>
              <input type="text" placeholder="John Doe" className="input input-bordered" value={studentFullName} onChange={e => setStudentFullName(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">Degree Name*</span></label>
              <input type="text" placeholder="Bachelor of Science" className="input input-bordered" value={degreeName} onChange={e => setDegreeName(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text font-semibold">University Name*</span></label>
              <input type="text" placeholder="University of Technology" className="input input-bordered" value={universityName} onChange={e => setUniversityName(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Gender</span></label>
              <input type="text" placeholder="Male / Female" className="input input-bordered" value={gender} onChange={e => setGender(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Date of Birth</span></label>
              <input type="date" className="input input-bordered" value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)} />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Graduation Date</span></label>
              <input type="date" className="input input-bordered" value={graduationDate} onChange={e => setGraduationDate(e.target.value)} />
            </div>
            <div className="form-control col-span-1 md:col-span-2">
              <label className="label"><span className="label-text font-semibold">Student's CID or Aadhaar*</span></label>
              <input type="text" placeholder="Enter student's identifier" className="input input-bordered" value={studentIdentifier} onChange={e => setStudentIdentifier(e.target.value)} />
            </div>
            <div className="form-control col-span-1 md:col-span-2">
              <label className="label"><span className="label-text font-semibold">Certificate File (PDF/Image)*</span></label>
              <input type="file" ref={fileInputRef} className="file-input file-input-bordered" onChange={handleFileChange} />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />
              )}
              {isSubmitting ? "Processing..." : "Issue Certificate"}
            </button>
          </div>

          {error && <div className="alert alert-error mt-4">{error}</div>}
          {status && <div className="alert alert-success mt-4">{status}</div>}
        </div>
      </div>
    </div>
  );
};

export default UniversityAdmin;
