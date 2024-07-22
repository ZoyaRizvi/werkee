import React, { useState, useEffect } from "react";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";
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
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import { CheckCircleIcon, MinusCircleIcon } from "@heroicons/react/24/solid";

export function Home() {
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [newUser, setNewUser] = useState({ displayName: '', email: '', role: '' });

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

  const handleOpenDialog = (user) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

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
      // Refresh users data
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsersData(users);
      handleCloseAddUserDialog();
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  return (
    <div className="mt-12">
      {/* Statistics Cards */}
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
        {/* Your statistics cards rendering */}
      </div>

      {/* Statistics Charts */}
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {/* Your statistics charts rendering */}
      </div>

      {/* Users Table */}
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
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
                  {["avatar", "name", "email", "role", "actions"].map((el) => (
                    <th
                      key={el}
                      className="border-b border-blue-gray-50 py-3 px-6 text-left"
                    >
                      <Typography
                        variant="small"
                        className="text-[11px] font-medium uppercase text-blue-gray-400"
                      >
                        {el}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {usersData.map(({ img, displayName, email, role, id }, key) => {
                  const className = `py-3 px-5 ${
                    key === usersData.length - 1
                      ? ""
                      : "border-b border-blue-gray-50"
                  }`;

                  return (
                    <tr key={id}>
                      <td className={className}>
                        <Avatar src={img} alt={displayName} size="sm" />
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {displayName}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {email}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-medium"
                        >
                          {role}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Button
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          onClick={() => handleOpenConfirmDialog(id)}
                        >
                          <MinusCircleIcon className="w-5 h-5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardBody>
        </Card>

        {/* Payments Overview */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-2">
              Payments Overview
            </Typography>
            <Typography
              variant="small"
              className="flex items-center gap-1 font-normal text-blue-gray-600"
            >
              <ArrowUpIcon
                strokeWidth={3}
                className="h-3.5 w-3.5 text-green-500"
              />
              <strong>24%</strong> this month
            </Typography>
          </CardHeader>
          <CardBody className="pt-0">
            {/* Your payments data rendering */}
          </CardBody>
        </Card>
      </div>

      {/* Confirm Delete Dialog */}
      {userToDelete && (
        <Dialog open={openConfirmDialog} handler={handleCloseConfirmDialog}>
          <DialogHeader>Confirm Deletion</DialogHeader>
          <DialogBody>
            <Typography>Are you sure you want to delete this user?</Typography>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleCloseConfirmDialog}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button variant="gradient" color="green" onClick={handleConfirmDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Edit User Dialog */}
      {currentUser && (
        <Dialog open={openDialog} handler={handleCloseDialog}>
          <DialogHeader>Edit User</DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <Input
                label="Name"
                value={currentUser.displayName}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, displayName: e.target.value })
                }
              />
              <Input
                label="Email"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
              <Input
                label="Role"
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value })
                }
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleCloseDialog}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button variant="gradient" color="green" onClick={handleEditUser}>
              Save
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Add User Dialog */}
      {openAddUserDialog && (
        <Dialog open={openAddUserDialog} handler={handleCloseAddUserDialog}>
          <DialogHeader>Create New User</DialogHeader>
          <DialogBody>
            <div className="space-y-4">
              <Input
                label="Name"
                value={newUser.displayName}
                onChange={(e) =>
                  setNewUser({ ...newUser, displayName: e.target.value })
                }
              />
              <Input
                label="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <Input
                label="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              />
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="text"
              color="red"
              onClick={handleCloseAddUserDialog}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button variant="gradient" color="green" onClick={handleAddUser}>
              Add
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
}

export default Home;
