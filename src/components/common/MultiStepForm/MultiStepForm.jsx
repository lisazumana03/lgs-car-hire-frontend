/*
Multi-Step Form Component
Converted from HTML template to React
Date: 2025-10-16
*/
import { useState } from 'react';
import './MultiStepForm.css';

const MultiStepForm = ({ onSubmit, initialData = {} }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal Details
    fullName: initialData.fullName || '',
    dateOfBirth: initialData.dateOfBirth || '',
    email: initialData.email || '',
    mobileNumber: initialData.mobileNumber || '',
    gender: initialData.gender || '',
    occupation: initialData.occupation || '',

    // Identity Details
    idType: initialData.idType || '',
    idNumber: initialData.idNumber || '',
    issuedAuthority: initialData.issuedAuthority || '',
    issuedState: initialData.issuedState || '',
    issuedDate: initialData.issuedDate || '',
    expiryDate: initialData.expiryDate || '',

    // Address Details
    addressType: initialData.addressType || '',
    nationality: initialData.nationality || '',
    state: initialData.state || '',
    district: initialData.district || '',
    blockNumber: initialData.blockNumber || '',
    wardNumber: initialData.wardNumber || '',

    // Family Details
    fatherName: initialData.fatherName || '',
    motherName: initialData.motherName || '',
    grandfatherName: initialData.grandfatherName || '',
    spouseName: initialData.spouseName || '',
    fatherInLaw: initialData.fatherInLaw || '',
    motherInLaw: initialData.motherInLaw || ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="multi-step-container">
      <header className="multi-step-header">Registration</header>

      <form onSubmit={currentStep === 2 ? handleSubmit : handleNext}>
        {/* Step 1: Personal and Identity Details */}
        <div className={`form-step ${currentStep === 1 ? 'active' : ''}`}>
          {/* Personal Details */}
          <div className="details-section personal">
            <span className="section-title">Personal Details</span>
            <div className="fields-grid">
              <div className="input-field">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="input-field">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="input-field">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div className="input-field">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="input-field">
                <label>Occupation</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  placeholder="Enter your occupation"
                  required
                />
              </div>
            </div>
          </div>

          {/* Identity Details */}
          <div className="details-section identity">
            <span className="section-title">Identity Details</span>
            <div className="fields-grid">
              <div className="input-field">
                <label>ID Type</label>
                <select
                  name="idType"
                  value={formData.idType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select ID type</option>
                  <option value="National ID">National ID</option>
                  <option value="Passport">Passport</option>
                  <option value="Driver's License">Driver's License</option>
                </select>
              </div>

              <div className="input-field">
                <label>ID Number</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  placeholder="Enter ID number"
                  required
                />
              </div>

              <div className="input-field">
                <label>Issued Authority</label>
                <input
                  type="text"
                  name="issuedAuthority"
                  value={formData.issuedAuthority}
                  onChange={handleInputChange}
                  placeholder="Enter issued authority"
                  required
                />
              </div>

              <div className="input-field">
                <label>Issued State</label>
                <input
                  type="text"
                  name="issuedState"
                  value={formData.issuedState}
                  onChange={handleInputChange}
                  placeholder="Enter issued state"
                  required
                />
              </div>

              <div className="input-field">
                <label>Issued Date</label>
                <input
                  type="date"
                  name="issuedDate"
                  value={formData.issuedDate}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-field">
                <label>Expiry Date</label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="next-btn">
              <span className="btn-text">Next</span>
              <i className="uil uil-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Step 2: Address and Family Details */}
        <div className={`form-step ${currentStep === 2 ? 'active' : ''}`}>
          {/* Address Details */}
          <div className="details-section address">
            <span className="section-title">Address Details</span>
            <div className="fields-grid">
              <div className="input-field">
                <label>Address Type</label>
                <select
                  name="addressType"
                  value={formData.addressType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>Select address type</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>

              <div className="input-field">
                <label>Nationality</label>
                <input
                  type="text"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleInputChange}
                  placeholder="Enter nationality"
                  required
                />
              </div>

              <div className="input-field">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>

              <div className="input-field">
                <label>District</label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  placeholder="Enter your district"
                  required
                />
              </div>

              <div className="input-field">
                <label>Block Number</label>
                <input
                  type="text"
                  name="blockNumber"
                  value={formData.blockNumber}
                  onChange={handleInputChange}
                  placeholder="Enter block number"
                  required
                />
              </div>

              <div className="input-field">
                <label>Ward Number</label>
                <input
                  type="text"
                  name="wardNumber"
                  value={formData.wardNumber}
                  onChange={handleInputChange}
                  placeholder="Enter ward number"
                  required
                />
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="details-section family">
            <span className="section-title">Family Details</span>
            <div className="fields-grid">
              <div className="input-field">
                <label>Father Name</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  placeholder="Enter father name"
                />
              </div>

              <div className="input-field">
                <label>Mother Name</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleInputChange}
                  placeholder="Enter mother name"
                />
              </div>

              <div className="input-field">
                <label>Grandfather</label>
                <input
                  type="text"
                  name="grandfatherName"
                  value={formData.grandfatherName}
                  onChange={handleInputChange}
                  placeholder="Enter grandfather name"
                />
              </div>

              <div className="input-field">
                <label>Spouse Name</label>
                <input
                  type="text"
                  name="spouseName"
                  value={formData.spouseName}
                  onChange={handleInputChange}
                  placeholder="Enter spouse name"
                />
              </div>

              <div className="input-field">
                <label>Father in Law</label>
                <input
                  type="text"
                  name="fatherInLaw"
                  value={formData.fatherInLaw}
                  onChange={handleInputChange}
                  placeholder="Father in law name"
                />
              </div>

              <div className="input-field">
                <label>Mother in Law</label>
                <input
                  type="text"
                  name="motherInLaw"
                  value={formData.motherInLaw}
                  onChange={handleInputChange}
                  placeholder="Mother in law name"
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="button" className="back-btn" onClick={handleBack}>
                <i className="uil uil-arrow-left"></i>
                <span className="btn-text">Back</span>
              </button>

              <button type="submit" className="submit-btn">
                <span className="btn-text">Submit</span>
                <i className="uil uil-check"></i>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default MultiStepForm;
