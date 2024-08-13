import React, { useState, useEffect } from 'react';
import './profile.css';
import { Card, CardBody, Avatar, Typography, Tabs, TabsHeader, Tab, Tooltip, Button } from '@material-tailwind/react';
import { ChatBubbleLeftEllipsisIcon, LightBulbIcon, PencilIcon, TrophyIcon } from '@heroicons/react/24/solid';
import { ProfileInfoCard } from '@/widgets/cards';
import { useAuth } from '../../context/authContext/index';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const { userLoggedIn } = useAuth();
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const navigate = useNavigate();

  const handleTabChange = (value) => {
    if (value === 'skillassessment') {
      setOpenSkillTest(true);
    }
  };

  const handleStartTest = (skill) => {
    navigate('/dashboard/skillassessment', { state: { skill } });
  };

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
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src="/img/bruce-mars.jpeg"
                alt="bruce-mars"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {(JSON.parse(localStorage.getItem('user')).displayName != null) ? JSON.parse(localStorage.getItem('user')).displayName : JSON.parse(localStorage.getItem('user')).email}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  Developer
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="app" onChange={(e, value) => handleTabChange(value)}>
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
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <ProfileInfoCard
              title="Profile Information"
              description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                'first name': 'Alec M. Thompson',
                mobile: '(44) 123 1234 123',
                email: 'alecthompson@mail.com',
                location: 'USA',
                social: (
                  <div className="flex items-center gap-4">
                    <i className="fa-brands fa-facebook text-blue-700" />
                    <i className="fa-brands fa-twitter text-blue-400" />
                    <i className="fa-brands fa-instagram text-purple-500" />
                  </div>
                ),
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-3">
                Messages
              </Typography>
              <ul className="flex flex-col gap-6">
                {conversationsData.map((props) => (
                  <MessageCard
                    key={props.name}
                    {...props}
                    action={
                      <Button variant="text" size="sm">
                        reply
                      </Button>
                    }
                  />
                ))}
              </ul>
            </div>
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
