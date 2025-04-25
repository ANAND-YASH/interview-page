"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const InterviewerForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    registrationNumber: "",
    emailid: "",
    college: "",
    role: "",
    experience: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("interviewerData", JSON.stringify(formData));
    router.push("/ai-interview");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white-100">
      <div className="bg-blue p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Interviewer Details</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="email"
            name="emailid"
            placeholder="Your Email"
            value={formData.emailid}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <input
            type="text"
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />

          <select
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
            className="w-full p-2 border border-white-300 rounded"
          >
            <option value="">Select College</option>
            <option value="SOA UNIVERSITY">SOA UNIVERSITY</option>
            <option value="IIT Bombay">IIT Bombay</option>
            <option value="IIT Delhi">IIT Delhi</option>
            <option value="IIT Madras">IIT Madras</option>
            <option value="IIT Kharagpur">IIT Kharagpur</option>
            <option value="IIT Kanpur">IIT Kanpur</option>
            <option value="NIT Trichy">NIT Trichy</option>
            <option value="NIT Surathkal">NIT Surathkal</option>
            <option value="NIT Warangal">NIT Warangal</option>
            <option value="VIT Vellore">VIT Vellore</option>
            <option value="BITS Pilani">BITS Pilani</option>
            <option value="Other">Other</option>
          </select>

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            
            <option value="">Select Role</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Web Developer">Web Developer</option>
            <option value="Data Scientist/Analyst">Data Scientist/Analyst</option>
            <option value="Network Engineer">Network Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
            <option value="Business Analyst">Business Analyst</option>
            <option value="Cybersecurity Analyst">Cybersecurity Analyst</option>
            <option value="AI/ML Engineer">AI/ML Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Cloud Engineer">Cloud Engineer</option>
          </select>

          <select
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Experience</option>
            <option value="0-2">0-2 years</option>
            <option value="3-5">3-5 years</option>
            <option value="6+">6+ years</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Start Interview
          </button>
        </form>
      </div>
    </div>
  );
};

export default InterviewerForm;
