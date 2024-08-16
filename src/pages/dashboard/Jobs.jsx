import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Modal, TextField } from '@mui/material';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";

const Jobs = () => {
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
  const [editJobId, setEditJobId] = useState(null); // Track the job being edited

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, "Jobsposted", user.uid, "jobs"));
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
  };

  const handleAddJob = async () => {
    alert("job posted successfully")
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

  const handleEditJob = (job) => {
    setNewJob({
      img: job.img,
      title: job.title,
      description: job.description,
      Requirements: job.Requirements,
      experienceLevel: job.experienceLevel,
      jobLocation: job.jobLocation,
      employmentType: job.employmentType,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      postedDate: job.postedDate
    });
    setEditJobId(job.id); // Set the job ID being edited
    setIsModalOpen(true);
  };

  const handleUpdateJob = async () => {
    const user = auth.currentUser;
    if (user && editJobId) {
      const jobRef = doc(db, "Jobsposted", user.uid, "jobs", editJobId);

      let imageUrl = newJob.img;
      if (image) {
        const storageRef = ref(storage, `projects/${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }

      let companyLogoUrl = newJob.companyLogo;
      if (companyLogo) {
        const storageRef = ref(storage, `projects/${user.uid}/${companyLogo.name}`);
        await uploadBytes(storageRef, companyLogo);
        companyLogoUrl = await getDownloadURL(storageRef);
      }

      await updateDoc(jobRef, {
        title: newJob.title,
        description: newJob.description,
        Requirements: newJob.Requirements,
        experienceLevel: newJob.experienceLevel,
        jobLocation: newJob.jobLocation,
        employmentType: newJob.employmentType,
        companyName: newJob.companyName,
        img: imageUrl,
        companyLogo: companyLogoUrl
      });
      fetchJobs();
      setIsModalOpen(false);
      setEditJobId(null); // Reset editJobId
    }
  };

  const handleDeleteJob = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const jobRef = doc(db, "Jobsposted", user.uid, "jobs", id);
      await deleteDoc(jobRef);
      fetchJobs();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Jobs
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button style={{ backgroundColor: 'teal' }}
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          Post a Job
        </Button>
      </div>
      
      <Grid container spacing={3}>
        {jobs.map(({ id, img, title, description, Requirements, experienceLevel, jobLocation, employmentType, companyName, companyLogo, postedDate }) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={id}>
            <Card style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // Ensure card stretches to fill available height
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }}>
              <CardContent style={{ flex: 1 }}>
                <img src={companyLogo} alt="Company Logo" style={{ width: '50px', height: '50px' }} />
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">
                  {description}
                </Typography>
                <div className=' mt-2'>
                <Typography variant="body2" >
                  Requirements: {Requirements}
                </Typography>
                </div>
                <div className=' mt-2'>
                <Typography variant="body2">
                  Experience Level: {experienceLevel}
                </Typography>
                </div>
                <div className=' mt-2'>
                <Typography variant="body2">
                  Location: {jobLocation}
                </Typography>
                </div>
                <div className=' mt-2'>
                <Typography variant="body2">
                  Employment Type: {employmentType}
                </Typography>
                </div>
                <div className=' mt-2'>
                <Typography variant="body2">
                  Company: {companyName}
                </Typography>
                </div>
                <div className=' mt-2'>
                <Typography variant="body2">
                  Posted Date: {new Date(postedDate).toLocaleDateString()}
                </Typography>
                </div>
              </CardContent>
              <CardActions>
                <Button variant="outlined" size="small" onClick={() => handleEditJob({ id, img, title, description, Requirements, experienceLevel, jobLocation, employmentType, companyName, companyLogo, postedDate })}>
                  Edit
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDeleteJob(id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

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
            {editJobId ? "Edit Job" : "Add New Job"}
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
          <Button variant="contained" color="primary" onClick={editJobId ? handleUpdateJob : handleAddJob}>
            {editJobId ? "Update Job" : "Add Job"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Jobs;
