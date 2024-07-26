import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Switch,
  Tooltip,
  Button,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { ProfileInfoCard, MessageCard } from "@/widgets/cards";
import { platformSettingsData, conversationsData } from "@/data";
import { useAuth } from '../../context/authContext/index';
import { useState, useEffect } from 'react';
import { db } from "@/firebase/firebase";
import { doc, getDoc, updateDoc} from "firebase/firestore";

export function Profile() {
  const { userLoggedIn } = useAuth();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(!open);
  const skills = ["Translation", "Graphic Design", "Writing & Content", "Marketing"];
  const userid = JSON.parse(localStorage.getItem('user')).uid;
  const [profile, setProfile] = useState({
    
        name: '',
        title:'',
        info: '',
        location: '',
        facebook: '',
        twitter: '',
        instagram: '',
        skills: [''],
        coverPhoto: null,
        profilePhoto:null,
    });

    const SkillButton = ({ skill }) => {
      return (
          <button className="button">{skill}</button>
      );
  };
  
  const SkillsContainer = () => {
      return (
          <div id="skills-container">
              {skills.map((skill, index) => (
                  <SkillButton key={index} skill={skill} />
              ))}
          </div>
      );
  };
  useEffect(() => {
    const fetchProfile = async () => {
        const docRef = doc(db, 'users', userid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setProfile(docSnap.data());
        }
    };

    fetchProfile();
}, [userid]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
};

const handleSkillChange = (index, event) => {
    const newSkills = profile.skills.map((skill, skillIndex) => {
        if (index !== skillIndex) return skill;
        return event.target.value;
    });
    setProfile({ ...profile, skills: newSkills });
};

const handleAddSkill = () => {
    setProfile({ ...profile, skills: [...profile.skills, ''] });
};

const handleRemoveSkill = (index) => {
    setProfile({ ...profile, skills: profile.skills.filter((_, skillIndex) => index !== skillIndex) });
};

const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
        setProfile({ ...profile, coverPhoto: URL.createObjectURL(e.target.files[0]) });
    }
};
const handlePhotoChange2 = (e) => {
  if (e.target.files[0]) {
      setProfile({ ...profile, profilePhoto: URL.createObjectURL(e.target.files[0]) });
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
      await updateDoc(doc(db, 'users', userid), profile);
      closeForm();
  } catch (e) {
      console.error('Error updating document: ', e);
  }
};

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
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
                { (JSON.parse(localStorage.getItem('user')).displayName != null) ?
                JSON.parse(localStorage.getItem('user')).displayName : JSON.parse(localStorage.getItem('user')).email }
                  {/* localStorage.getItem("myCat") */}
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
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="gird-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">

            <ProfileInfoCard
              title="Profile Information"
              description="Hi, I'm Alec Thompson, Decisions: If you can't decide, the answer is no. If two equally difficult paths, choose the one more painful in the short term (pain avoidance is creating an illusion of equality)."
              details={{
                "first name": "Alec M. Thompson",
                mobile: "(44) 123 1234 123",
                email: "alecthompson@mail.com",
                location: "USA",
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
                   <PencilIcon onClick={handleOpen} variant="gradient" className="h-4 w-4 cursor-pointer text-blue-gray-500" />
                </Tooltip>
              }
            />
                  <Dialog open={open} handler={handleOpen}>
        <DialogHeader>    <h1>Edit Profile</h1></DialogHeader>
        <DialogBody className="h-[42rem] overflow-scroll">
          
        <div className="form-container">
         <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={profile.name} onChange={handleChange} required />
                    <label>Title:</label>
                    <input type="text" name="title" value={profile.title} onChange={handleChange} required />
                </div>
                <div>
                    <label>Profile Photo:</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange2} />
                    {profile.profilePhoto && <img src={profile.profilePhoto} alt="Profile Preview" className="profile-preview" />}
                </div>
                <div>
                    <label>Info:</label>
                    <input type="text" name="info" value={profile.info} onChange={handleChange} required />
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" name="location" value={profile.location} onChange={handleChange} required />
                </div>
                <div>
                    <label>Facebook URL:</label>
                    <input type="url" name="facebook" value={profile.facebook} onChange={handleChange} />
                </div>
                <div>
                    <label>Twitter URL:</label>
                    <input type="url" name="twitter" value={profile.twitter} onChange={handleChange} />
                </div>
                <div>
                    <label>Instagram URL:</label>
                    <input type="url" name="instagram" value={profile.instagram} onChange={handleChange} />
                </div>
                <div>
                    <label>Cover Photo:</label>
                    <input type="file" accept="image/*" onChange={handlePhotoChange} />
                    {profile.coverPhoto && <img src={profile.coverPhoto} alt="Cover Preview" className="cover-preview" />}
                </div>
                <div className="skills-container">
                    <label>Skills:</label>
                    {profile.skills.map((skill, index) => (
                        <div key={index} className="skill-input">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e)}
                            />
                            <button
                                type="button"
                                className="remove-skill-btn"
                                onClick={() => handleRemoveSkill(index)}
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button type="button" className="add-skill-btn" onClick={handleAddSkill}>
                        Add Skill
                    </button>
                </div>
                <button variant="gradient" color="green" onClick={handleOpen} type="submit">Submit</button>
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
            {/* <div>
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
            </div> */}
          </div>
          <div className="px-4 pb-4">
            <Typography variant="h6" color="blue-gray" className="mb-2">
              {/* Projects */}
            </Typography>
            <Typography
              variant="small"
              className="font-normal text-blue-gray-500"
            >
              {/* add projects here from firebase */}
            </Typography>
            <div className="mt-6 grid grid-cols-1 gap-12 md:grid-cols-2 xl:grid-cols-4">
              {/* {projectsData.map(
                ({ img, title, description, tag, route, members }) => (
                  <Card key={title} color="transparent" shadow={false}>
                    <CardHeader
                      floated={false}
                      color="gray"
                      className="mx-0 mt-0 mb-4 h-64 xl:h-40"
                    >
                      <img
                        src={img}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    </CardHeader>
                    <CardBody className="py-0 px-1">
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {tag}
                      </Typography>
                      <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mt-1 mb-2"
                      >
                        {title}
                      </Typography>
                      <Typography
                        variant="small"
                        className="font-normal text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </CardBody>
                    <CardFooter className="mt-6 flex items-center justify-between py-0 px-1">
                      <Link to={route}>
                        <Button variant="outlined" size="sm">
                          view project
                        </Button>
                      </Link>
                      <div>
                        {members.map(({ img, name }, key) => (
                          <Tooltip key={name} content={name}>
                            <Avatar
                              src={img}
                              alt={name}
                              size="xs"
                              variant="circular"
                              className={`cursor-pointer border-2 border-white ${
                                key === 0 ? "" : "-ml-2.5"
                              }`}
                            />
                          </Tooltip>
                        ))}
                      </div>
                    </CardFooter>
                  </Card>
                )
              )} */}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

export default Profile;
