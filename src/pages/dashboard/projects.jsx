import React, { useState, useEffect } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Modal, TextField } from '@mui/material';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";

const Projects = ({uid}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const DEFAULT_PROFILE_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s';
  const [projects, setProjects] = useState([]);
  const userid = uid;
const getUserProfilePhoto = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }

    return DEFAULT_PROFILE_IMAGE;
  };

  const getUserName = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.displayName ? parsedUser.displayName: 'Werkee User';
    }

  };
  const name = getUserName();
  const avatarSrc = getUserProfilePhoto();
  const [newProject, setNewProject] = useState({
    img: '',
    title: '',
    tag: '',
    description: '',
    user_name:name,
    profile_pic:avatarSrc
  });
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const user = auth.currentUser;
    if (user) {
      const querySnapshot = await getDocs(collection(db, "Candidate_Work",userid, "projects"));
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
  
      // Include user_name and profile_pic in the database entry
      await addDoc(collection(db, "Candidate_Work", user.uid, "projects"), {
        ...newProject,
        img: imageUrl,
        user_name: name, // Add the user's name
        profile_pic: avatarSrc, // Add the user's profile picture
      });
  
      fetchProjects();
      setIsModalOpen(false);
      resetForm();
    }
  };
  

  const handleUpdateProject = async () => {
    const user = auth.currentUser;
    if (user && editingProjectId) {
      const projectRef = doc(db, "Candidate_Work", user.uid, "projects", editingProjectId);
      let imageUrl = newProject.img;
      if (image) {
        const storageRef = ref(storage, `mywork/${user.uid}/${image.name}`);
        await uploadBytes(storageRef, image);
        imageUrl = await getDownloadURL(storageRef);
      }
  
      // Include user_name and profile_pic in the updated database entry
      await updateDoc(projectRef, {
        ...newProject,
        img: imageUrl,
        user_name: name, // Add the user's name
        profile_pic: avatarSrc, // Add the user's profile picture
      });
  
      fetchProjects();
      setIsModalOpen(false);
      resetForm();
    }
  };
  

  const handleEditClick = (project) => {
    setNewProject(project);
    setEditingProjectId(project.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDeleteProject = async (id) => {
    const user = auth.currentUser;
    if (user) {
      const projectRef = doc(db, "Candidate_Work", user.uid, "projects", id);
      await deleteDoc(projectRef);
      fetchProjects();
    }
  };

  const resetForm = () => {
    setImage(null); // Reset image state
    setNewProject({
      img: '',
      title: '',
      tag: '',
      description: ''
    });
    setIsEditing(false);
    setEditingProjectId(null);
  };

  return (
    <div>

      

      
      <Grid container spacing={3}>
        {projects.map(({ id, img, title, tag, description }) => (
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
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={isModalOpen}
        onClose={() => { setIsModalOpen(false); resetForm(); }}
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
            {isEditing ? 'Edit Project' : 'Add New Project'}
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
          <input type="file" onChange={handleImageChange} style={{ marginBottom: '16px' }} />
          <Button variant="contained" color="primary" onClick={isEditing ? handleUpdateProject : handleAddProject}>
            {isEditing ? 'Update Project' : 'Add Project'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Projects;

