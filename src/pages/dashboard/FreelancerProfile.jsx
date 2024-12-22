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

export function FreelancerProfile({uid}) {
  const { userLoggedIn } = useAuth();
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const userid = uid
  const [profile, setProfile] = useState(defaultProfile);
  const [errors, setErrors] = useState({});
  const [badges, setBadges] = useState([]);

  
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


  const getUserProfilePhoto = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }
    return DEFAULT_PROFILE_IMAGE;
  };
  const avatarSrc = getUserProfilePhoto();



  

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
                  <div className="badge-container flex items-center justify-center space-x-4">
                    {badges.length > 0 ? (
                      badges.map((badge, index) => (
                       <div key={index} className="badge-item flex flex-col items-center">
                        <TrophyIcon className="h-6 w-6 text-orange-500 mt-4" />
                          <p className="text-gray-600 mt-2 text-sm" >{badge}</p> {/* Show badge title under the icon */}
                       </div>
                      ))
                    ) : (
                      <p className="text-gray-600 mt-[-10px]">Get badge now</p>
                   )}
                  </div>

                )
              }}


            />
          </div>
          <div>
            <Projects uid={uid} />
          </div>
        </CardBody>
      </Card>

   
    </>
  );
}

export default FreelancerProfile;
