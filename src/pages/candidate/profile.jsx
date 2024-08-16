import React, { useState, useEffect } from 'react';
import './profile.css';
import { Card, CardBody, Avatar, Typography, Tabs, TabsHeader, Tab, Tooltip, Button } from '@material-tailwind/react';
import { ChatBubbleLeftEllipsisIcon, LightBulbIcon, PencilIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { ProfileInfoCard } from '@/widgets/cards';
import { useAuth } from '../../context/authContext/index';
import { Dialog as MuiDialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db, storage } from "@/firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
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
  img: '',
};

export function Profile() {
  const { userLoggedIn } = useAuth();
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const userid = JSON.parse(localStorage.getItem('user'))?.uid || 'default-user-id';
  const [profile, setProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});
  const [badges, setBadges] = useState([]);

  const handleStartTest = (skill) => {
    navigate('/dashboard/skillassessment', { state: { skill } });
  };
  const DEFAULT_PROFILE_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s';


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

          // Fetch badges
          if (fetchedData.badges) {
            setBadges(fetchedData.badges);
          }
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

  const handlePhotoUpload = async (file) => {
    const storageRef = ref(storage, `images/${userid}/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handlePhotoChange = async (e) => {
    if (e.target.files[0]) {
      const newCoverPhotoURL = await handlePhotoUpload(e.target.files[0]);
      setProfile((prevProfile) => ({ ...prevProfile, coverPhoto: newCoverPhotoURL }));
    }
  };

  const handlePhotoChange2 = async (e) => {
    if (e.target.files[0]) {
      const newProfilePhotoURL = await handlePhotoUpload(e.target.files[0]);
      setProfile((prevProfile) => ({ ...prevProfile, img: newProfilePhotoURL }));
    }
  };
  const getUserProfilePhoto = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }
    return DEFAULT_PROFILE_IMAGE;
  };
  const avatarSrc = getUserProfilePhoto();

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
        img: profile.img,
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
        <img src={profile.coverPhoto} alt="Cover" className="hidden" />

        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={profile.img || avatarSrc}
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
                  {profile.title ? profile.title : "Add Title"}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app">
                <TabsHeader>
                  <Tab value="message">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Message
                  </Tab>
                  <Tab value="skillassessment" onClick={() => handleStartTest(true)}>
                    <LightBulbIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Skill Assessment
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <ProfileInfoCard title="Profile Information" description={profile.info ? profile.info : "Add profile info"} />

            <ProfileInfoCard
              details={{
                location: <div className="flex items-center gap-4">{profile.location ? profile.location : "Add location"}</div>,
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
                    {profile.skills.length > 0 ? (
                      profile.skills.map((skill, index) => (
                        <button key={index} className="button">{skill}</button>
                      ))
                    ) : (
                      <p className="text-gray-600">Please add your skills here</p>
                    )}
                  </div>

                ),
                badge: (
                  <div className="badge-container">
                    {badges.length > 0 ? (
                      badges.map((badge, index) => (
                        <Tooltip key={index} content={badge} placement="top">
                          <TrophyIcon className="h-6 w-6 text-orange-500" />
                        </Tooltip>
                      ))
                    ) : (
                      <p className="text-gray-600 mt-[-10px]">Get badge now</p>
                    )}
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
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              {errors.displayName && <p className="text-red-500">{errors.displayName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={profile.title}
                onChange={handleChange}
                placeholder="Enter your job title"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Info</label>
              <textarea
                name="info"
                value={profile.info}
                onChange={handleChange}
                placeholder="Tell us about yourself"
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
                placeholder="Enter your location"
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
                placeholder="Enter your Facebook profile URL"
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
                placeholder="Enter your Twitter handle"
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
                placeholder="Enter your Instagram profile URL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Profile Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange2}
                className="mt-2"
              />
              {profile.img && (
                <img
                  src={profile.img}
                  alt="Profile Preview"
                  className="profile-preview mt-2 w-24 h-24 object-cover rounded"
                />
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Cover Photo:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="mt-2"
              />
              {profile.coverPhoto && (
                <img
                  src={profile.coverPhoto}
                  alt="Cover Preview"
                  className="cover-preview mt-2 w-full h-24 object-cover rounded"
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
                    placeholder={`Skill #${index + 1}`}
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


