import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardActions, Button, Modal, TextField } from '@mui/material';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";

const Jobs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({
    img: '',
    title: '',
    tag: '',
    description: '',
    route: '',
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

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, "projects", user.uid, "jobs"));
      const jobsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleLogoChange = (e) => {
    if (e.target.files[0]) {
      setCompanyLogo(e.target.files[0]);
    }
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

      await addDoc(collection(db, "projects", user.uid, "jobs"), { ...newJob, img: imageUrl, companyLogo: companyLogoUrl, postedDate });
      fetchJobs();
      setIsModalOpen(false);
      setImage(null); // Reset image state
      setCompanyLogo(null); // Reset company logo state
      setNewJob({
        img: '',
        title: '',
        tag: '',
        description: '',
        route: '',
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

  const handleUpdateJob = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const jobRef = doc(db, "projects", user.uid, "jobs", id);
      await updateDoc(jobRef, newJob);
      fetchJobs();
      setIsModalOpen(false);
    }
  };

  const handleDeleteJob = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const jobRef = doc(db, "projects", user.uid, "jobs", id);
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
        {jobs.map(({ id, img, title, tag, description, route, Requirements, experienceLevel, jobLocation, employmentType, companyName, companyLogo, postedDate }) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={id}>
            <Card>
              <CardContent>
              <img src={companyLogo} alt="Company Logo" style={{ width: '50px', height: '50px' }} />
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2">
                  {description}
                </Typography>
                <Typography variant="body2">
                  Requirements: {Requirements}
                </Typography>
                <Typography variant="body2">
                  Experience Level: {experienceLevel}
                </Typography>
                <Typography variant="body2">
                  Location: {jobLocation}
                </Typography>
                <Typography variant="body2">
                  Employment Type: {employmentType}
                </Typography>
                <Typography variant="body2">
                  Company: {companyName}
                </Typography>
                <Typography variant="body2">
                  Posted Date: {new Date(postedDate).toLocaleDateString()}
                </Typography>
               
              </CardContent>
              <CardActions>
                <Button variant="outlined" size="small" href={route}>
                  View Job
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleUpdateJob(id)}>
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
            Add New Job
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
            <label className="block text-gray-700 text-sm mb-2" htmlFor="employmentType">Employment Type</label>
            <div className="relative">
              <select className="block appearance-none w-full bg-white border border-gray-400 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-gray-500" id="employmentType" name="employmentType" value={newJob.employmentType} onChange={handleInputChange}>
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Freelance</option>
                <option>Contract</option>
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
          <input type="file" onChange={handleLogoChange} style={{ marginBottom: '16px' }} />
          <Button variant="contained" color="primary" onClick={handleAddJob}>
            Add Job
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Jobs;
