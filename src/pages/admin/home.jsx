import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  const [openPostEditDialog, setOpenPostEditDialog] = useState(false);
  const [openPostConfirmDialog, setOpenPostConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [postToDelete, setPostToDelete] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [postsData, setPostsData] = useState([]);
  const [newUser, setNewUser] = useState({ displayName: '', email: '', role: '' });
  const [newPost, setNewPost] = useState({ jobTitle: '', companyName: '', jobLocation: '', postingDate: '' });
  const [currentPost, setCurrentPost] = useState(null);
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const projectId = "Yshu6K2j2CZzuu7CbAICFshK0gd2";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsersData(users);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobsCollection = collection(db, `projects/${projectId}/jobs`);
        const jobsSnapshot = await getDocs(jobsCollection);
        const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setJobsData(jobs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching jobs: ", error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, [projectId]);
    
  

  const handleOpenConfirmDialog = (userId) => {
    setUserToDelete(userId);
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
    setUserToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteDoc(doc(db, "users", userToDelete));
        setUsersData(usersData.filter(user => user.id !== userToDelete));
        handleCloseConfirmDialog();
      } catch (error) {
        console.error("Error deleting user: ", error);
      }
    }
  };

  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
    setNewUser({ displayName: '', email: '', role: '' });
  };

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        ...newUser,
        img: '', // Optionally handle user avatar image
        createdAt: serverTimestamp(), // Add creation timestamp
      });
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersData(users);
      handleCloseAddUserDialog();
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  const handleOpenPostEditDialog = (post) => {
    setCurrentPost(post);
    setOpenPostEditDialog(true);
  };

  const handleClosePostEditDialog = () => {
    setOpenPostEditDialog(false);
    setCurrentPost(null);
  };

  const handleUpdatePost = async () => {
    if (currentPost) {
      try {
        await updateDoc(doc(db, "projects", currentPost.id), currentPost);
        const querySnapshot = await getDocs(collection(db, "projects"));
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPostsData(posts);
        handleClosePostEditDialog();
      } catch (error) {
        console.error("Error updating post: ", error);
      }
    }
  };

  const handleOpenPostConfirmDialog = (postId) => {
    setPostToDelete(postId);
    setOpenPostConfirmDialog(true);
  };

  const handleClosePostConfirmDialog = () => {
    setOpenPostConfirmDialog(false);
    setPostToDelete(null);
  };

  const handleConfirmPostDelete = async () => {
    if (postToDelete) {
      try {
        await deleteDoc(doc(db, "projects", postToDelete));
        setPostsData(postsData.filter(post => post.id !== postToDelete));
        handleClosePostConfirmDialog();
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    }
  };

  const handleOpenAddPostDialog = () => {
    setOpenAddPostDialog(true);
  };

  const handleCloseAddPostDialog = () => {
    setOpenAddPostDialog(false);
    // setNewPost({ jobTitle: '', companyName: '', jobLocation: '', postingDate: '' });
  };

  const handleAddPost = async () => {
    try {
      await addDoc(collection(db, "projects"), {
        ...newPost,
        createdAt: serverTimestamp(), // Add creation timestamp
      });
      const querySnapshot = await getDocs(collection(db, "projects"));
      const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPostsData(posts);
      handleCloseAddPostDialog();
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="mt-12">
      {/* Users Table */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Users
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{usersData.length}</strong> registered
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray" onClick={handleOpenAddUserDialog}>
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleOpenAddUserDialog}>Create User</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["avatar", "name", "email", "role", ""].map((header, index) => (
                    <th key={index} className="border-b border-blue-gray-100 py-3 px-5 text-left">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal leading-none opacity-70"
                      >
                        {header}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-5">
                      <Avatar
                        src={user.img || ""}
                        alt={user.displayName}
                        size="sm"
                        variant="circular"
                      />
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="blue-gray" className="font-bold">
                        {user.displayName}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="blue-gray">
                        {user.email}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <Typography variant="small" color="blue-gray">
                        {user.role}
                      </Typography>
                    </td>
                    <td className="py-3 px-5">
                      <IconButton
                        variant="text"
                        color="red"
                        onClick={() => handleOpenConfirmDialog(user.id)}
                      >
                        <TrashIcon strokeWidth={2} className="h-5 w-5" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Posts Table */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Posts
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <strong>{jobsData.length}</strong> available
              </Typography>
            </div>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            {loading ? (
              <Typography variant="small" color="blue-gray" className="text-center">
                Loading jobs...
              </Typography>
            ) : (
              <table className="w-full min-w-[640px] table-auto">
                <thead>
                  <tr>
                    {["Job Title", "Company Name", "Location", "Description", ""].map((header, index) => (
                      <th key={index} className="border-b border-blue-gray-100 py-3 px-5 text-left">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {header}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {jobsData.map((job) => (
                    <tr key={job.id}>
                      <td className="py-3 px-5">
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {job.title}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography variant="small" color="blue-gray">
                          {job.companyName}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography variant="small" color="blue-gray">
                          {job.jobLocation}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <Typography variant="small" color="blue-gray">
                          {job.description}
                        </Typography>
                      </td>
                      <td className="py-3 px-5">
                        <IconButton variant="text" color="red">
                          <TrashIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                        <IconButton variant="text" color="blue">
                          <PencilIcon strokeWidth={2} className="h-5 w-5" />
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Dialogs */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogHeader>Confirm Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this user? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleConfirmDelete}
          >
            Confirm
          </Button>
          <Button
            variant="text"
            color="blue"
            onClick={handleCloseConfirmDialog}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogHeader>Add New User</DialogHeader>
        <DialogBody>
          <Input
            label="Display Name"
            value={newUser.displayName}
            onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <Input
            label="Role"
            value={newUser.role}
            onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={handleAddUser}
          >
            Add User
          </Button>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseAddUserDialog}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openPostEditDialog} onClose={handleClosePostEditDialog}>
        <DialogHeader>Edit Post</DialogHeader>
        <DialogBody>
          <Input
            label="Job Title"
            value={currentPost?.jobTitle || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, jobTitle: e.target.value })}
          />
          <Input
            label="Description"
            value={currentPost?.description || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
          />
          <Input
            label="Company Name"
            value={currentPost?.companyName || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, companyName: e.target.value })}
          />
          <Input
            label="Job Location"
            value={currentPost?.jobLocation || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, jobLocation: e.target.value })}
          />
          <Input
            label="Recruiter"
            value={currentPost?.recruiter || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, recruiter: e.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={handleUpdatePost}
          >
            Update Post
          </Button>
          <Button
            variant="text"
            color="red"
            onClick={handleClosePostEditDialog}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openPostConfirmDialog} onClose={handleClosePostConfirmDialog}>
        <DialogHeader>Confirm Post Deletion</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this post? This action cannot be undone.
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleConfirmPostDelete}
          >
            Confirm
          </Button>
          <Button
            variant="text"
            color="blue"
            onClick={handleClosePostConfirmDialog}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={openAddPostDialog} onClose={handleCloseAddPostDialog}>
        <DialogHeader>Add New Post</DialogHeader>
        <DialogBody>
          <Input
            label="Job Title"
            value={newPost.jobTitle}
            onChange={(e) => setNewPost({ ...newPost, jobTitle: e.target.value })}
          />
          <Input
            label="Description"
            value={newPost.description}
            onChange={(e) => setNewPost({ ...newPost, description: e.target.value })}
          />
          <Input
            label="Company Name"
            value={newPost.companyName}
            onChange={(e) => setNewPost({ ...newPost, companyName: e.target.value })}
          />
          <Input
            label="Job Location"
            value={newPost.jobLocation}
            onChange={(e) => setNewPost({ ...newPost, jobLocation: e.target.value })}
          />
          <Input
            label="Recruiter"
            value={newPost.recruiter}
            onChange={(e) => setNewPost({ ...newPost, recruiter: e.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue"
            onClick={handleAddPost}
          >
            Add Post
          </Button>
          <Button
            variant="text"
            color="red"
            onClick={handleCloseAddPostDialog}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default Home;