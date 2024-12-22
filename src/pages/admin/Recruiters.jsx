import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, query, where, getDocs,collectionGroup, addDoc, deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export function Recruiters() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  // const [openAddPostDialog, setOpenAddPostDialog] = useState(false);
  // const [openPostEditDialog, setOpenPostEditDialog] = useState(false);
  // const [openPostConfirmDialog, setOpenPostConfirmDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  // const [postToDelete, setPostToDelete] = useState(null);
  const [usersData, setUsersData] = useState([]);
  // const [jobsData, setJobsData] = useState([]);
  const [newUser, setNewUser] = useState({ displayName: '', email: '', role: '' });
  // const [newPost, setNewPost] = useState({ title: '', companyName: '', jobLocation: '', description: '', recruiter: '' });
  // const [currentPost, setCurrentPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();
  const currentUserId = auth.currentUser?.uid;
  const projectId = "Yshu6K2j2CZzuu7CbAICFshK0gd2";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Query the users collection for recruiters
        const q = query(
          collection(db, "users"),
          where("role", "==", "recruiter")
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsersData(users);
      } catch (error) {
        console.error("Error fetching recruiters: ", error);
      }
    };

    fetchUsers();
  }, []);

  // useEffect(() => {
  //   const fetchJobs = async () => {
  //     try {
        
  //       const jobsSnapshot = await getDocs(collectionGroup(db, "jobs"));
  //       const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setJobsData(jobs);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error("Error fetching jobs: ", error);
  //       setLoading(false);
  //     }
  //   };

  //   fetchJobs();
  // }, [projectId]);

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
        img: '',
        createdAt: serverTimestamp(),
      });
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user => user.id !== currentUserId); // Exclude the logged-in user
      setUsersData(users);
      handleCloseAddUserDialog();
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  // const handleOpenPostEditDialog = (post) => {
  //   setCurrentPost(post);
  //   setOpenPostEditDialog(true);
  // };

  // const handleClosePostEditDialog = () => {
  //   setOpenPostEditDialog(false);
  //   setCurrentPost(null);
  // };

  // const handleUpdatePost = async () => {
  //   if (currentPost) {
  //     try {
  //       await updateDoc(doc(db, `Jobsposted/${projectId}/jobs`, currentPost.id), currentPost);
  //       const jobsSnapshot = await getDocs(collection(db, `Jobsposted/${projectId}/jobs`));
  //       const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //       setJobsData(jobs);
  //       handleClosePostEditDialog();
  //     } catch (error) {
  //       console.error("Error updating post: ", error);
  //     }
  //   }
  // };

  // const handleOpenPostConfirmDialog = (postId) => {
  //   setPostToDelete(postId);
  //   setOpenPostConfirmDialog(true);
  // };

  // const handleClosePostConfirmDialog = () => {
  //   setOpenPostConfirmDialog(false);
  //   setPostToDelete(null);
  // };

  // const handleConfirmPostDelete = async () => {
  //   if (postToDelete) {
  //     try {
  //       await deleteDoc(doc(db, `Jobsposted/${projectId}/jobs`, postToDelete));
  //       setJobsData(jobsData.filter(post => post.id !== postToDelete));
  //       handleClosePostConfirmDialog();
  //     } catch (error) {
  //       console.error("Error deleting post: ", error);
  //     }
  //   }
  // };

  // const handleOpenAddPostDialog = () => {
  //   setOpenAddPostDialog(true);
  // };

  // const handleCloseAddPostDialog = () => {
  //   setOpenAddPostDialog(false);
  //   setNewPost({ title: '', companyName: '', jobLocation: '', description: '', recruiter: '' });
  // };

  // const handleAddPost = async () => {
  //   try {
  //     await addDoc(collection(db, `Jobsposted/${projectId}/jobs`), {
  //       ...newPost,
  //       createdAt: serverTimestamp(),
  //     });
  //     const jobsSnapshot = await getDocs(collection(db, `Jobsposted/${projectId}/jobs`));
  //     const jobs = jobsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  //     setJobsData(jobs);
  //     handleCloseAddPostDialog();
  //   } catch (error) {
  //     console.error("Error adding post: ", error);
  //   }
  // };

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
                Recruiter
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
                  {["Avatar", "Name", "Email", "Role", ""].map((header, index) => (
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
                {usersData.map(({ img, id, displayName, email, role }, index) => {
                  const isLast = index === usersData.length - 1;
                  const classes = isLast
                    ? "py-3 px-5"
                    : "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <Avatar src={img} alt={displayName} />
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {displayName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {role}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleOpenConfirmDialog(id)}>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      {/* Jobs Table */}
      {/* <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 flex items-center justify-between p-6"
          >
            <div>
              <Typography variant="h6" color="blue-gray" className="mb-1">
                Jobs
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon strokeWidth={3} className="h-4 w-4 text-blue-gray-200" />
                <strong>{jobsData.length}</strong> available
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton size="sm" variant="text" color="blue-gray" onClick={handleOpenAddPostDialog}>
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleOpenAddPostDialog}>Create Job</MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Title", "Company", "Location", "Description", "Recruiter", ""].map((header, index) => (
                    <th key={index} className="border-b border-blue-gray-100 py-3 px-5 text-left">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none opacity-70"
                      >
                        {header}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {jobsData.map(({ id, title, companyName, jobLocation, description, recruiter }, index) => {
                  const isLast = index === jobsData.length - 1;
                  const classes = isLast
                    ? "py-3 px-5"
                    : "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-bold">
                          {title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {companyName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {jobLocation}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography variant="small" color="blue-gray" className="font-normal">
                          {recruiter}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleOpenPostConfirmDialog(id)}>
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton size="sm" variant="text" color="blue-gray" onClick={() => handleOpenPostEditDialog({ id, title, companyName, jobLocation, postingDate, recruiter })}>
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div> */}

      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogHeader>Create User</DialogHeader>
        <DialogBody>
          <Input
            label="Display Name"
            value={newUser.displayName}
            onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })}
          />
          <Input
            label="Email"
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
          <Button variant="text" color="blue-gray" onClick={handleCloseAddUserDialog}>
            Cancel
          </Button>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogFooter>
      </Dialog>

      {/* Add Job Dialog */}
      {/* <Dialog open={openAddPostDialog} onClose={handleCloseAddPostDialog}>
        <DialogHeader>Create Job</DialogHeader>
        <DialogBody>
          <Input
            label="title"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Input
            label="Company"
            value={newPost.companyName}
            onChange={(e) => setNewPost({ ...newPost, companyName: e.target.value })}
          />
          <Input
            label="Location"
            value={newPost.jobLocation}
            onChange={(e) => setNewPost({ ...newPost, jobLocation: e.target.value })}
          />
          <Input
            label="Description"
            value={newPost.postingDate}
            onChange={(e) => setNewPost({ ...newPost, postingDate: e.target.value })}
          />
          <Input
            label="Recruiter"
            value={newPost.recruiter}
            onChange={(e) => setNewPost({ ...newPost, recruiter: e.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={handleCloseAddPostDialog}>
            Cancel
          </Button>
          <Button onClick={handleAddPost}>Add Job</Button>
        </DialogFooter>
      </Dialog> */}

      {/* Edit Job Dialog */}
      {/* <Dialog open={openPostEditDialog} onClose={handleClosePostEditDialog}>
        <DialogHeader>Edit Job</DialogHeader>
        <DialogBody>
          <Input
            label="title"
            value={currentPost?.title || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value })}
          />
          <Input
            label="Company"
            value={currentPost?.companyName || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, companyName: e.target.value })}
          />
          <Input
            label="Location"
            value={currentPost?.jobLocation || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, jobLocation: e.target.value })}
          />
          <Input
            label="Description"
            value={currentPost?.description || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value })}
          />
          <Input
            label="Recruiter"
            value={currentPost?.recruiter || ''}
            onChange={(e) => setCurrentPost({ ...currentPost, recruiter: e.target.value })}
          />
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={handleClosePostEditDialog}>
            Cancel
          </Button>
          <Button onClick={handleUpdatePost}>Update Job</Button>
        </DialogFooter>
      </Dialog> */}

      {/* Confirm User Deletion Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this user?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={handleCloseConfirmDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogFooter>
      </Dialog>

      {/* Confirm Job Deletion Dialog */}
      {/* <Dialog open={openPostConfirmDialog} onClose={handleClosePostConfirmDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>
          Are you sure you want to delete this job?
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="blue-gray" onClick={handleClosePostConfirmDialog}>
            Cancel
          </Button>
          <Button onClick={handleConfirmPostDelete}>Delete</Button>
        </DialogFooter>
      </Dialog> */}
    </div>
  );
}


export default Recruiters;
