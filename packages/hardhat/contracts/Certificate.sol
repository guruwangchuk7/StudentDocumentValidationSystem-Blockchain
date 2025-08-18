// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Certificate {
    address public universityAdmin;

    struct StudentCertificate {
        bytes32 certificateId;
        string studentFullName;
        string gender;
        string dateOfBirth;
        string degreeName;
        string graduationDate;
        string universityName;
        string certificateFileCID;
        address studentAddress;
    }

    mapping(bytes32 => StudentCertificate) public certificates;
    mapping(bytes32 => bytes32) public cidToCertificateId;
    mapping(address => bytes32[]) public studentCertificates;
    mapping(address => bool) public verifiers;

    modifier onlyAdmin() {
        require(msg.sender == universityAdmin, "Only admin can perform this action");
        _;
    }

    modifier onlyVerifier() {
        require(verifiers[msg.sender], "Only verifiers can perform this action");
        _;
    }

    constructor() {
        universityAdmin = msg.sender;
    }

    function issueCertificate(
        bytes32 _certificateId,
        string memory _studentFullName,
        string memory _gender,
        string memory _dateOfBirth,
        string memory _degreeName,
        string memory _graduationDate,
        string memory _universityName,
        string memory _certificateFileCID,
        address _studentAddress
    ) public onlyAdmin {
        bytes32 cidBytes = keccak256(abi.encodePacked(_certificateFileCID));
        require(cidToCertificateId[cidBytes] == 0, "Certificate file already exists");

        certificates[_certificateId] = StudentCertificate({
            certificateId: _certificateId,
            studentFullName: _studentFullName,
            gender: _gender,
            dateOfBirth: _dateOfBirth,
            degreeName: _degreeName,
            graduationDate: _graduationDate,
            universityName: _universityName,
            certificateFileCID: _certificateFileCID,
            studentAddress: _studentAddress
        });

        cidToCertificateId[cidBytes] = _certificateId;
        studentCertificates[_studentAddress].push(_certificateId);
    }

    function addVerifier(address _verifierAddress) public onlyAdmin {
        verifiers[_verifierAddress] = true;
    }

    function getCertificate(bytes32 certificateId) public view returns (StudentCertificate memory) {
        return certificates[certificateId];
    }

    function getCertificateByCID(bytes32 cidBytes) public view returns (StudentCertificate memory) {
        bytes32 certificateId = cidToCertificateId[cidBytes];
        require(certificateId != 0, "Certificate not found");
        return certificates[certificateId];
    }

    // 🔥 New function to get all certificates of a student
    function getStudentCertificates(address student) external view returns (bytes32[] memory) {
        return studentCertificates[student];
    }
}
