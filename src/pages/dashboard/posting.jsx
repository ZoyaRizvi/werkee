import { useEffect, useState } from "react";
import React from 'react';
import { db } from "@/firebase/firebase";
import { addDoc, collection } from "firebase/firestore";

export function Posting() {
  const [jobTitle, setjobTitle] = useState('');
  const [Requirements, setRequirements] = useState('');
  const [experienceLevel, setexperienceLevel] = useState('');
  const [employmentType, setemploymentType] = useState('');
  const [jobLocation, setjobLocation] = useState('');
  const [description, setdescription] = useState('');
  const [companyName, setcompanyName] = useState('');
  const [companyLogo, setcompanyLogo] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleCreate = async () => {
    try {
      const value = collection(db, "projects");
      await addDoc(value, {
        jobTitle: jobTitle,
        Requirements: Requirements,
        experienceLevel: experienceLevel,
        employmentType: employmentType,
        jobLocation: jobLocation,
        describe: description,
        companyName: companyName,
        companyLogo: companyLogo
      });
      // Reset form after successful submission
      setjobTitle('');
      setRequirements('');
      setexperienceLevel('');
      setemploymentType('');
      setjobLocation('');
      setdescription('');
      setcompanyName('');
      setcompanyLogo('');
      setSuccessMessage('Project created successfully');
    } catch (error) {
      console.error("Error creating project: ", error);
    }
  };

  return (
    <div className="bg-gray-400">
      <main className="main bg-white px-6 md:px-16 py-6">
        <div className="w-full max-w-xl mx-auto ">
          <form action="" method="post">
            <h1 className="text-2xl mb-2 ">Post new project</h1>
            <div className="job-info border-b-2 py-2 mb-5">
            <div className="mb-4">
  <label className="block text-gray-700 text-sm mb-2" htmlFor="jobTitle">Title</label>
  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" type="text" id="jobTitle" name="jobTitle" placeholder="Frontend Developer" value={jobTitle} onChange={(e) => setjobTitle(e.target.value)} autoFocus />
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm mb-2" htmlFor="Requirements">Requirements</label>
  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" type="text" id="Requirements" name="Requirements" placeholder="Requirements" value={Requirements} onChange={(e) => setRequirements(e.target.value)} />
</div>

<div className="mb-4">
  <label className="block text-gray-700 text-sm mb-2" htmlFor="experienceLevel">Experience Level</label>
  <input className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" type="text" id="experienceLevel" name="experienceLevel" placeholder="Intern" value={experienceLevel} onChange={(e) => setexperienceLevel(e.target.value)} />
</div>

<div className="md:flex md:justify-between">
  <div className="w-full md:w-8/12 mb-4 md:mb-0">
    <label htmlFor="jobLocation" className="block text-gray-700 text-sm mb-2">Location</label>
    <input type="text" id="jobLocation" name="jobLocation" className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" placeholder="Schwerin" value={jobLocation} onChange={(e) => setjobLocation(e.target.value)} />
  </div>
</div>

<div className="md:flex md:justify-between">
  <div className="w-full md:w-3/12 mb-4 md:mb-0">
    <label className="block text-gray-700 text-sm mb-2" htmlFor="employmentType">Employment Type</label>
    <div className="relative">
      <select className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500" id="employmentType" name="employmentType" value={employmentType} onChange={(e) => setemploymentType(e.target.value)}>
        <option>Full-time</option>
        <option>Part-time</option>
        <option>Freelance</option>
        <option>Contract</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
</div>

<div>
  <label htmlFor="description" className="block text-gray-700 text-sm mb-2">Description</label>
  <textarea className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" name="description" id="description" cols="" rows="" value={description} onChange={(e) => setdescription(e.target.value)} />
</div>

<div className="flex flex-wrap -mx-3">
  <div className="w-full md:w-1/2 px-3 mb-4 md:mb-0">
    <label htmlFor="companyname" className="block text-gray-700 text-sm mb-2">Company Name</label>
    <input type="text" id="companyname" name="companyname" className="appearance-none block w-full bg-white text-gray-700 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" placeholder="Company Name" value={companyName} onChange={(e) => setcompanyName(e.target.value)} />
  </div>
</div>

<div className="mb-4 md:mb-0">
  <label htmlFor="companyLogo" className="block text-gray-700 text-sm mb-2">Logo Image</label>
  <input type="file" id="companyLogo" name="companyLogo" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-3 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={companyLogo} onChange={(e) => setcompanyLogo(e.target.value)} />
</div>

            </div>
            {successMessage && <p>{successMessage}</p>}
            <div>
              <button onClick={handleCreate} className="bg-teal-500 hover:bg-teal-600 text-white py-2 px-3 rounded" type="button">Create Project</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default Posting;
