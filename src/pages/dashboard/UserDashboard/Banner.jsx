import React, { useState } from 'react'
import { Typography, Grid, Card, CardContent, CardActions, Button, Modal, TextField } from '@mui/material';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";



const Banner = () => {


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    img: '',
    title: '',
    description: '',
    Requirements: '',
    experienceLevel: '',
    jobLocation: '',
    employmentType: 'Full-time', // default value for dropdown
    companyName: '',
    companyLogo: '',
    postedDate: ''
  });
  const [image, setImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);



  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };
  const handleAddJob = async () => {
    const user = auth.currentUser;
    if (user) {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `projects/${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      let companyLogoUrl = '';
      if (companyLogo) {
        const storageRef = ref(storage, `projects/${user.uid}/${companyLogo.name}`);
        await uploadBytes(storageRef, companyLogo);
        companyLogoUrl = await getDownloadURL(storageRef);
      }

      const postedDate = new Date().toISOString(); // Get the current date and time

      const jobDocRef = await addDoc(collection(db, "Jobsposted", user.uid, "jobs"), {
        ...newJob,
        img: imageUrl,
        companyLogo: companyLogoUrl,
        postedDate,
        recruiter_id: user.uid, // Add recruiter_id field
        jobId: '' // Initialize jobId field
      });

      // Update the document to include the jobId
      await updateDoc(jobDocRef, { jobId: jobDocRef.id });

      fetchJobs();
      setIsModalOpen(false);
      setImage(null); // Reset image state
      setCompanyLogo(null); // Reset company logo state
      setNewJob({
        img: '',
        title: '',
        description: '',
        Requirements: '',
        experienceLevel: '',
        jobLocation: '',
        employmentType: 'Full-time',
        companyName: '',
        companyLogo: '',
        postedDate: ''
      });
    }
  };
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-[#FFF2E1] md:py-20 py-14" style={{"marginTop": "24px"}}>
      <h1 className="font-bold text-primary mb-3 text-5xl">Post a <span className="text-[teal]">new job</span> today</h1>
      <p className=" text-black/70 mb-8 text-lg">Unlock your team's potential with top talent—let's build the future together!</p>
      <form>
        <div className=" flex justify-start md:flex-row flex-col md:gap-0 gap-4">
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button style={{ backgroundColor: 'teal' }}
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          Post a Job
        </Button>
        <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="upload-job-modal"
        aria-describedby="upload-job-description"
      >
        <div style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)', 
          width: '80%', 
          maxWidth: '600px', 
          backgroundColor: 'white', 
          padding: '20px', 
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)' 
        }}>
          <Typography id="upload-job-modal" variant="h6" component="h2">
            {"Add New Job"}
          </Typography>
          <TextField
            name="title"
            label="Title"
            value={newJob.title}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="description"
            label="Description"
            value={newJob.description}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="Requirements"
            label="Requirements"
            value={newJob.Requirements}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="experienceLevel"
            label="Experience Level"
            value={newJob.experienceLevel}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="jobLocation"
            label="Location"
            value={newJob.jobLocation}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <div className="w-full md:w-3/12 mb-4 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="employmentType">
              Employment Type
            </label>
            <div className="relative">
              <select
                name="employmentType"
                value={newJob.employmentType}
                onChange={handleInputChange}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>
          <TextField
            name="companyName"
            label="Company Name"
            value={newJob.companyName}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <div className="w-full md:w-3/12 mb-4 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="companyLogo">
              Company Logo
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleLogoChange}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          {/* <div className="w-full md:w-3/12 mb-4 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="img">
              Job Image
            </label>
            <div className="relative">
              <input
                type="file"
                onChange={handleImageChange}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div> */}
          <Button variant="contained" color="primary" onClick={handleAddJob}>
            { "Add Job"}
          </Button>
        </div>
      </Modal>
      </div>
        </div>
      </form>
    </div>
   
  )
}

export default Banner