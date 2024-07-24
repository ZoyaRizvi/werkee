import React, { useState } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
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
import { ProfileInfoCard, MessageCard } from '@/widgets/cards';
import { conversationsData } from '@/data';
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

const skills = [
  'JavaScript',
  'React',
  'Node.js',
  'Python',
  'Java',
  'C++',
  'Ruby',
  'Go',
];
  'Prject Management',
  'DevOps',
  'Content Writing',
  'Video Editing',
  'Marketing',
  'Technical Writing',
  'SQA',
];

export function Profile() {
  const { userLoggedIn } = useAuth();
  const [openSkillTest, setOpenSkillTest] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState('');
  const navigate = useNavigate();

  const handleTabChange = (value) => {
    if (value === 'skillassessment') {
      setOpenSkillTest(true);
    }
  };

  const handleStartTest = (skill) => {
    console.log('Starting test for skill:', skill);
    // Add logic to start the skill test with the selected skill
    navigate('/skillassessment', { state: { skill } });
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

      <Dialog open={openSkillTest} onClose={() => setOpenSkillTest(false)}>
        <DialogTitle>Select a Skill</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={skills}
            freeSolo
            onInputChange={(event, newValue) => setSelectedSkill(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Skill" variant="outlined" />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSkillTest(false)}>Cancel</Button>
          <Button onClick={() => { handleStartTest(selectedSkill); setOpenSkillTest(false); }} disabled={!selectedSkill}>
            Start Test
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Profile;
