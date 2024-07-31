import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Modal, TextField } from '@mui/material';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({
    img: '',
    title: '',
    tag: '',
    description: '',
    route: ''
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, "mywork", user.uid, "projects"));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddProject = async () => {
    const user = auth.currentUser;
    if (user) {
      let imageUrl = '';
      if (image) {
        const storageRef = ref(storage, `mywork/${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
      await addDoc(collection(db, "mywork", user.uid, "projects"), { ...newProject, img: imageUrl });
      fetchProjects();
      setIsModalOpen(false);
      setImage(null); // Reset image state
      setNewProject({
        img: '',
        title: '',
        tag: '',
        description: '',
        route: ''
      });
    }
  };

  const handleUpdateProject = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const projectRef = doc(db, "mywork", user.uid, "projects", id);
      await updateDoc(projectRef, newProject);
      fetchProjects();
      setIsModalOpen(false);
    }
  };

  const handleDeleteProject = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const projectRef = doc(db, "mywork", user.uid, "projects", id);
      await deleteDoc(projectRef);
      fetchProjects();
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        My Work
      </Typography>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <Button style={{ backgroundColor: 'teal' }}
          variant="contained"
          onClick={() => setIsModalOpen(true)}
        >
          Upload Your Work
        </Button>
      </div>
      
      <Grid container spacing={3}>
        {projects.map(({ id, img, title, tag, description, route }) => (
          <Grid item xs={12} sm={6} md={6} lg={6} key={id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={img}
                alt={title}
                style={{ height: 150, width: '100%', objectFit: 'cover', objectPosition: 'center' }}
              />
              <CardContent>
                <Typography variant="h6">{title}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {tag}
                </Typography>
                <Typography variant="body2">
                  {description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button variant="outlined" size="small" href={route}>
                  View Project
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleUpdateProject(id)}>
                  Edit
                </Button>
                <Button variant="outlined" size="small" onClick={() => handleDeleteProject(id)}>
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
        aria-labelledby="upload-project-modal"
        aria-describedby="upload-project-description"
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
          <Typography id="upload-project-modal" variant="h6" component="h2">
            Add New Project
          </Typography>
          <TextField
            name="title"
            label="Title"
            value={newProject.title}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="tag"
            label="Tag"
            value={newProject.tag}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="description"
            label="Description"
            value={newProject.description}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <TextField
            name="route"
            label="Route"
            value={newProject.route}
            onChange={handleInputChange}
            fullWidth
            style={{ marginBottom: '16px' }}
          />
          <input type="file" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
          <Button variant="contained" color="primary" onClick={handleAddProject}>
            Add Project
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;

