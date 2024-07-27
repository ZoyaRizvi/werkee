import React, { useState } from 'react';
import { Typography, Grid, Card, CardContent, CardMedia, CardActions, Button, Modal, TextField } from '@mui/material'; // Ensure you have @mui/material installed

const mockProjects = [
  {
    id: 1,
    img: 'https://media.licdn.com/dms/image/D4D12AQHYC_ZczxV2zw/article-cover_image-shrink_720_1280/0/1695524296879?e=2147483647&v=beta&t=VJkWc3l89UdKGn2pEkDo4IWINkztx2V3u0tdzPL8ILA', // Placeholder image
    title: 'Project One',
    tag: 'Design',
    description: 'A brief description of Project One.',
    route: '/project-one',
  },
  {
    id: 2,
    img: 'https://i.pinimg.com/736x/cf/ea/30/cfea305ef815385ef069b123625ee2c0.jpg',
    title: 'Project Two',
    tag: 'Development',
    description: 'A brief description of Project Two.',
    route: '/project-two',
  },
  {
    id: 3,
    img: 'https://cdn.prod.website-files.com/63c5e29f1b5bc83fe0af2489/6424d753f8eb7a9e69c372fc_Gantt%20Chart%20Online%20Software%20Instagantt%20Ideation%202.webp',
    title: 'Project Three',
    tag: 'Marketing',
    description: 'A brief description of Project Three.',
    route: '/project-three',
  },
  {
    id: 4,
    img: 'https://cdn.logojoy.com/wp-content/uploads/20200814102904/AdobeStock_218976523-min-1024x724.jpeg',
    title: 'Project Four',
    tag: 'Strategy',
    description: 'A brief description of Project Four.',
    route: '/project-four',
  }
]
const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    img: '',
    title: '',
    tag: '',
    description: '',
    route: ''
  });
  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddProject = () => {
    // Here, you would handle the logic to upload the image and add the project.
    // For now, we are just closing the modal.
    console.log('Adding project:', newProject, image);
    setIsModalOpen(false);
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
        {mockProjects.map(({ id, img, title, tag, description, route }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={img}
                alt={title}
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

