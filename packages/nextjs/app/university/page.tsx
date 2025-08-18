"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import { isAddress } from "viem";
import { bytesToHex, stringToBytes } from "viem";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import { AddressInput } from "~~/components/scaffold-eth";

const UniversityAdmin = () => {
  // State for each form field
  const [certificateIdInput, setCertificateIdInput] = useState("");
  const [studentFullName, setStudentFullName] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [degreeName, setDegreeName] = useState("");
  const [graduationDate, setGraduationDate] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [studentAddress, setStudentAddress] = useState("");

  // State for handling the submission process
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const formattedCertificateId = useMemo(() => {
    if (!certificateIdInput) return "";
    return bytesToHex(stringToBytes(certificateIdInput, { size: 32 }));
  }, [certificateIdInput]);

  const { writeContractAsync: issueCertificate, isPending } = useScaffoldWriteContract({
    contractName: "Certificate",
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setStatus("");
    setError("");

    if (!formattedCertificateId || !studentFullName || !degreeName || !universityName || !selectedFile || !isAddress(studentAddress)) {
      setError("Please fill out all required fields, including a valid student wallet address.");
      return;
    }

    try {
      setStatus("Uploading file to IPFS...");
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
        },
      });
      const certificateCID = response.data.IpfsHash;

      setStatus("Issuing certificate on the blockchain...");
      await issueCertificate({
        functionName: "issueCertificate",
        args: [
          formattedCertificateId,
          studentFullName,
          gender,
          dateOfBirth,
          degreeName,
          graduationDate,
          universityName,
          certificateCID,
          studentAddress,
        ],
      });

      setStatus("Certificate issued successfully!");
    } catch (e: any) {
      console.error("Error issuing certificate:", e);
      setError(e.message || "An unexpected error occurred.");
      setStatus("");
    }
  };

  return (
    <div className="container mx-auto mt-10 p-4 max-w-2xl">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-2xl">Issue Student Certificate</h1>
          <p className="mb-4">Fill in the details below and upload the certificate file to issue it on the blockchain.</p>

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
              <label className="label"><span className="label-text font-semibold">Student Wallet Address*</span></label>
              <AddressInput value={studentAddress} onChange={setStudentAddress} placeholder="Enter student's 0x... address" />
            </div>
            <div className="form-control col-span-1 md:col-span-2">
              <label className="label"><span className="label-text font-semibold">Certificate File (PDF/Image)*</span></label>
              <input type="file" className="file-input file-input-bordered" onChange={handleFileChange} />
            </div>
          </div>

          <div className="card-actions justify-end mt-6">
            <button className="btn btn-primary" onClick={handleSubmit} disabled={isPending || !!status}>
              {isPending || status ? <span className="loading loading-spinner"></span> : <ArrowUpOnSquareIcon className="h-5 w-5 mr-2" />}
              {status || (isPending ? "Confirm in wallet..." : "Issue Certificate")}
            </button>
          </div>

          {error && <div className="alert alert-error mt-4">{error}</div>}
          {status === "Certificate issued successfully!" && <div className="alert alert-success mt-4">{status}</div>}
        </div>
      </div>
    </div>
  );
};

export default UniversityAdmin;
