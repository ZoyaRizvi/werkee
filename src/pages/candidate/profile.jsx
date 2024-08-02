import React, { useState, useEffect } from 'react';
import './profile.css';
import { Card, CardBody, Avatar, Typography, Tabs, TabsHeader, Tab, Tooltip, Button } from '@material-tailwind/react';
import { HomeIcon, ChatBubbleLeftEllipsisIcon, LightBulbIcon, PencilIcon } from '@heroicons/react/24/solid';
import { ProfileInfoCard } from '@/widgets/cards';
import { useAuth } from '../../context/authContext/index';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db } from "@/firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import Projects from './projects';

// Default values
const defaultProfile = {
  displayName: '',
  title: '',
  info: '',
  location: '',
  facebook: '',
  twitter: '',
  instagram: '',
  skills: [],
  coverPhoto: '',
  profilePhoto: '',
};

const skills = [
  { name: 'Project Management', description: 'Manage projects effectively.' },
  { name: 'DevOps', description: 'DevOps practices and tools.' },
  { name: 'Content Writing', description: 'Creating and managing content.' },
  { name: 'Video Editing', description: 'Editing video content.' },
  { name: 'Marketing', description: 'Marketing strategies and implementation.' },
  { name: 'Technical Writing', description: 'Writing technical documentation.' },
  { name: 'SQA', description: 'Software Quality Assurance.' },
];

export function Profile() {
  const { userLoggedIn } = useAuth();
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const userid = JSON.parse(localStorage.getItem('user'))?.uid || 'default-user-id';
  const [profile, setProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});

  const handleStartTest = (skill) => {
    navigate('/skillassessment', { state: { skill } });
  };

  const handleOpenSkillTest = () => setOpenSkillTest(!openSkillTest);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const docRef = doc(db, 'users', userid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          setProfile({
            ...defaultProfile,
            ...fetchedData,
            skills: fetchedData.skills || defaultProfile.skills,
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        setProfile(defaultProfile);
      }
    };

    fetchProfile();
  }, [userid]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  const handleSkillChange = (index, event) => {
    const newSkills = profile.skills.map((skill, skillIndex) => (
      index !== skillIndex ? skill : event.target.value
    ));
    setProfile((prevProfile) => ({ ...prevProfile, skills: newSkills }));
  };

  const handleAddSkill = () => {
    setProfile((prevProfile) => ({ ...prevProfile, skills: [...prevProfile.skills, ''] }));
  };

  const handleRemoveSkill = (index) => {
    setProfile((prevProfile) => ({
      ...prevProfile,
      skills: prevProfile.skills.filter((_, skillIndex) => index !== skillIndex)
    }));
  };

  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      // For previewing
      const newCoverPhoto = URL.createObjectURL(e.target.files[0]);
      setProfile((prevProfile) => ({ ...prevProfile, coverPhoto: newCoverPhoto }));
    }
  };

  const handleProfilePhotoChange = (e) => {
    if (e.target.files[0]) {
      // For previewing
      const newProfilePhoto = URL.createObjectURL(e.target.files[0]);
      setProfile((prevProfile) => ({ ...prevProfile, profilePhoto: newProfilePhoto }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await updateDoc(doc(db, 'users', userid), {
        displayName: profile.displayName,
        title: profile.title,
        info: profile.info,
        location: profile.location,
        facebook: profile.facebook,
        twitter: profile.twitter,
        instagram: profile.instagram,
        coverPhoto: profile.coverPhoto,
        profilePhoto: profile.profilePhoto,
        skills: profile.skills
      });
      setOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
  };

  const handleSkillSelect = (skillName) => {
    setSelectedSkill(skillName);
    handleStartTest(skillName);
    setOpenSkillTest(false);
  };

  const validateForm = () => {
    const errors = {};
    if (!profile.displayName) {
      errors.displayName = 'Name is required';
    }
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
      errors.email = 'Valid email is required';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${profile.coverPhoto})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat'
        }}
        className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover bg-center"
      >
        <img src={profile.coverPhoto} alt="Cover" />

        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={profile.profilePhoto}
                alt="Profile"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profile.displayName}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                  {profile.title}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="app">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    App
                  </Tab>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="skillassessment" onClick={() => setOpenSkillTest(true)}>
                    <LightBulbIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Skill Test
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <ProfileInfoCard title="Profile Information" description={profile.info} />
            <ProfileInfoCard
              details={{
                location: <div className="flex items-center gap-4">{profile.location}</div>,
                social: (
                  <div className="flex items-center gap-4">
                    {profile.facebook && (
                      <a href={profile.facebook} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-facebook text-blue-700" />
                      </a>
                    )}
                    {profile.twitter && (
                      <a href={profile.twitter} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-twitter text-blue-400" />
                      </a>
                    )}
                    {profile.instagram && (
                      <a href={profile.instagram} target="_blank" rel="noopener noreferrer">
                        <i className="fa-brands fa-instagram text-purple-500" />
                      </a>
                    )}
                  </div>
                ),
                skills: (
                  <div id="skills-container">
                    {profile.skills.length > 0 ? profile.skills.map((skill, index) => (
                      <button key={index} className="button">{skill}</button>
                    )) : defaultProfile.skills.map((skill, index) => (
                      <button key={index} className="button">{skill}</button>
                    ))}
                  </div>
                )
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon onClick={handleOpen} variant="gradient" className="h-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
          </div>
          <div>
            <Projects />
          </div>
        </CardBody>
      </Card>

      {/* Skill Dialog */}
      <MuiDialog open={openSkillTest} onClose={() => setOpenSkillTest(false)} fullWidth maxWidth="sm">
        <DialogTitle className="flex items-center gap-2 text-blue-600">
          <LightBulbIcon className="h-6 w-6" />
          Select a Skill
        </DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 p-4">
            {skills.map((skill) => (
              <Tooltip key={skill.name} title={skill.description} placement="top">
                <Button
                  variant={selectedSkill === skill.name ? 'contained' : 'outlined'}
                  color="primary"
                  onClick={() => handleSkillSelect(skill.name)}
                  className={`transition-transform duration-300 transform ${
                    selectedSkill === skill.name ? 'scale-105' : 'scale-100'
                  }`}
                >
                  {skill.name}
                </Button>
              </Tooltip>
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillTest(false)} color="gray">
            Close
          </Button>
        </DialogActions>
      </MuiDialog>

      {/* Edit Profile Dialog */}
      <MuiDialog open={open} onClose={handleOpen} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="displayName"
                value={profile.displayName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Info</label>
              <textarea
                name="info"
                value={profile.info}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={profile.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Facebook</label>
              <input
                type="text"
                name="facebook"
                value={profile.facebook}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Twitter</label>
              <input
                type="text"
                name="twitter"
                value={profile.twitter}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Instagram</label>
              <input
                type="text"
                name="instagram"
                value={profile.instagram}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Profile Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePhotoChange}
              />
              {profile.profilePhoto && (
                <img
                  src={profile.profilePhoto}
                  alt="Profile Preview"
                  className="profile-preview"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Cover Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
              />
              {profile.coverPhoto && (
                <img
                  src={profile.coverPhoto}
                  alt="Cover Preview"
                  className="cover-preview"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Skills:</label>
              {profile.skills.map((skill, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={skill}
                    onChange={(e) => handleSkillChange(index, e)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <Button type="button" onClick={() => handleRemoveSkill(index)} color="red">
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddSkill}>
                Add Skill
              </Button>
            </div>
            <div className="flex justify-end gap-4">
              <Button type="button" onClick={resetProfile} color="gray">
                Reset
              </Button>
              <Button type="submit" color="blue">
                Save Changes
              </Button>
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="gray">
            Close
          </Button>
        </DialogActions>
      </MuiDialog>
    </>
  );
}

export default Profile;

