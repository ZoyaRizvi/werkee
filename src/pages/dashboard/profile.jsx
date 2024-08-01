import React, { useState, useEffect } from 'react';
import './profile.css';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
  Tooltip,
  Button,
} from '@material-tailwind/react';
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  LightBulbIcon,
  PencilIcon,
} from '@heroicons/react/24/solid';
import { ProfileInfoCard } from '@/widgets/cards';
import { useAuth } from '../../context/authContext/index';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from '@material-tailwind/react';
import {
  Dialog as MuiDialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { db, storage } from "@/firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Jobs from './Jobs';
import Responses from './Responses';
import NewChat from './newChat';
import { Chat } from '../candidate';
import Messages from './UserDashboard/Messages';

const data = [
  {
    label: "HTML",
    value: "html",
    desc: `It really matters and then like it really doesn't matter.
    What matters is the people who are sparked by it. And the people 
    who are like offended by it, it doesn't matter.`,
  },
  {
    label: "React",
    value: "react",
    desc: `Because it's about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  },
  {
    label: "Vue",
    value: "vue",
    desc: `We're not always in the position that we want to be at.
    We're constantly growing. We're constantly making mistakes. We're
    constantly trying to express ourselves and actualize our dreams.`,
  },
  {
    label: "Angular",
    value: "angular",
    desc: `Because it's about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  },
  {
    label: "Svelte",
    value: "svelte",
    desc: `We're not always in the position that we want to be at.
    We're constantly growing. We're constantly making mistakes. We're
    constantly trying to express ourselves and actualize our dreams.`,
  },
];

// Default values
const defaultProfile = {
  name: '',
  title: '',
  info: '',
  location: '',
  facebook: '',
  twitter: '',
  instagram: '',
  skills: [],
  coverPhoto: 'https://via.placeholder.com/150',
};
const DEFAULT_PROFILE_IMAGE = 'https://i.pinimg.com/736x/cf/ea/30/cfea305ef815385ef069b123625ee2c0.jpg';

const getUserProfilePhoto = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsedUser = JSON.parse(user);
    return parsedUser.profilePhoto ? parsedUser.profilePhoto : DEFAULT_PROFILE_IMAGE;
  }
  return DEFAULT_PROFILE_IMAGE;
};

const avatarSrc = getUserProfilePhoto();

const skills = [
  'Project Management',
  'DevOps',
  'Content Writing',
  'Video Editing',
  'Marketing',
  'Technical Writing',
  'SQA',
];

export function Profile() {
  const { userLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const userid = JSON.parse(localStorage.getItem('user'))?.uid || 'default-user-id';
  const [profile, setProfile] = useState(defaultProfile);



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
      setProfile((prevProfile) => ({ ...prevProfile, profilePhoto: newProfilePhotoURL }));
    }
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, 'users', userid), profile);
      resetProfile();
      setOpen(false);
    } catch (error) {
      console.error('Error updating document: ', error);
    }
    window.location.reload();

  };
  const data = [
    { label: "JOBS", value: "JOBS", component: <Jobs /> },
    { label: "Responses", value: "responses", component: <Responses userId={userid}/> },
    { label: "Messages", value: "messages", component: <Messages/>}
  ];

  return (
    <>
      <div style={{
        backgroundImage: { ...profile.coverPhoto },
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundSize: "100%"
      }
      }
        className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-cover bg-center">
        <img src={profile.coverPhoto} alt="Cover" />
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
                src={profile.profilePhoto || avatarSrc}
                alt="Profile"
                size="xl"
                variant="rounded"
                className="rounded-lg shadow-lg shadow-blue-gray-500/40"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {profile.name}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {profile.title}
                </Typography>
              </div>
            </div>
            <div className="w-96">

            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-2">
            <ProfileInfoCard
              title="Profile Information"
              description={profile.info}
            />
            <ProfileInfoCard
              details={{
                location: (
                  <div className="flex items-center gap-4">
                    {profile.location}
                  </div>
                ),
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
            <Tabs id="custom-animation" value="JOBS">
              <TabsHeader>
                {data.map(({ label, value }) => (
                  <Tab key={value} value={value}>
                    {label}
                  </Tab>
                ))}
              </TabsHeader>
              <TabsBody
                animate={{
                  initial: { y: 250 },
                  mount: { y: 0 },
                  unmount: { y: 250 },
                }}
              >
                {data.map(({ value, component }) => (
                  <TabPanel key={value} value={value}>
                    {component}
                  </TabPanel>
                ))}
              </TabsBody>
            </Tabs>


          </div>
        </CardBody>
      </Card>



      <Dialog open={open} handler={handleOpen}>
        <DialogHeader><h1>Edit Profile</h1></DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          <div className="form-container">
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  required
                />
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={profile.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Profile Photo:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange2}
                />
                {profile.profilePhoto && (
                  <img
                    src={profile.profilePhoto}
                    alt="Profile Preview"
                    className="profile-preview"
                  />
                )}
              </div>
              <div>
                <label>Info:</label>
                <input
                  maxLength={350}
                  type="text"
                  name="info"
                  value={profile.info}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Location:</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Facebook URL:</label>
                <input
                  type="url"
                  name="facebook"
                  value={profile.facebook}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Twitter URL:</label>
                <input
                  type="url"
                  name="twitter"
                  value={profile.twitter}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Instagram URL:</label>
                <input
                  type="url"
                  name="instagram"
                  value={profile.instagram}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label>Cover Photo:</label>
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

              <button variant="gradient" color="green" type="submit">
                Submit
              </button>
            </form>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;
