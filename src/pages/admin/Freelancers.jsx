import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import {
  CheckCircleIcon,
  TrashIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Freelancers() {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [monthlyData, setMonthlyData] = useState(Array(12).fill(0));
  const [newUser, setNewUser] = useState({
    displayName: "",
    email: "",
    role: "",
  });
  const auth = getAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(
          collection(db, "users"),
          where("role", "==", "candidate")
        );

        const querySnapshot = await getDocs(q);
        const users = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setUsersData(users);

        // Process data for the chart
        const months = Array(12).fill(0);
        const currentYear = new Date().getFullYear();
  
        users.forEach((user) => {
          if (user.createdAt) {
            const registrationDate = user.createdAt.toDate();
            const month = registrationDate.getMonth();
            const year = registrationDate.getFullYear();
  
            // Only count registrations from the current year
            if (year === currentYear) {
              months[month]++;
            }
          }
        });
  
        setMonthlyData(months);
      } catch (error) {
        console.error("Error fetching candidates: ", error);
      }
    };
  
    fetchUsers();
  }, []);
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
        setUsersData(usersData.filter((user) => user.id !== userToDelete));
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
  };

  const handleAddUser = async () => {
    try {
      await addDoc(collection(db, "users"), {
        ...newUser,
        img: "",
        createdAt: serverTimestamp(),
      });
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((user) => user.id !== auth.currentUser.uid); // Exclude the logged-in user
      setUsersData(users);
      handleCloseAddUserDialog();
    } catch (error) {
      console.error("Error adding user: ", error);
    }
  };

  // Chart data and options
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Candidates Registered",
        data: monthlyData,
        backgroundColor: monthlyData.map((count) => {
          if (count > 10) {
            return "rgba(54, 162, 235, 0.6)"; // Red for > 7
          } else if (count > 5) {
            return "rgba(255, 206, 86, 0.6)"; // Blue for > 5 and <= 7
          } else {
            return "rgba(75, 192, 192, 0.6)"; // Yellow for <= 5
          }
        }),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      }
      
    ],
  };


  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Registrations of Recruiters",
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          min: 1, // Starts the Y-axis from 1
          stepSize: 1, // Increments by 1
        },
      },
    },
  };
  
  return (
    <div className="mt-12">
      {/* Chart */}
      <div className="mb-8">
        <Card>
          <CardHeader floated={false} shadow={false} className="p-6">
            <Typography variant="h6" color="blue-gray">
              Candidates Registration Chart
            </Typography>
          </CardHeader>
          <CardBody>
            <Bar data={data} options={options} />
          </CardBody>
        </Card>
      </div>

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
                Candidate
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <CheckCircleIcon
                  strokeWidth={3}
                  className="h-4 w-4 text-blue-gray-200"
                />
                <strong>{usersData.length}</strong> registered
              </Typography>
            </div>
            <Menu placement="left-start">
              <MenuHandler>
                <IconButton
                  size="sm"
                  variant="text"
                  color="blue-gray"
                  onClick={handleOpenAddUserDialog}
                >
                  <EllipsisVerticalIcon
                    strokeWidth={3}
                    fill="currentColor"
                    className="h-6 w-6"
                  />
                </IconButton>
              </MenuHandler>
              <MenuList>
                <MenuItem onClick={handleOpenAddUserDialog}>
                  Create User
                </MenuItem>
              </MenuList>
            </Menu>
          </CardHeader>
          <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
            <table className="w-full min-w-[640px] table-auto">
              <thead>
                <tr>
                  {["Avatar", "Name", "Email", "Role", ""].map(
                    (header, index) => (
                      <th
                        key={index}
                        className="border-b border-blue-gray-100 py-3 px-5 text-left"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                        >
                          {header}
                        </Typography>
                      </th>
                    )
                  )}
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
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {displayName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {role}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          onClick={() => handleOpenConfirmDialog(id)}
                        >
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

      {/* Add User Dialog */}
      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogHeader>Create User</DialogHeader>
        <DialogBody>
          <Input
            label="Display Name"
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
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleCloseAddUserDialog}
          >
            Cancel
          </Button>
          <Button onClick={handleAddUser}>Add User</Button>
        </DialogFooter>
      </Dialog>

      {/* Confirm User Deletion Dialog */}
      <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
        <DialogHeader>Confirm Delete</DialogHeader>
        <DialogBody>Are you sure you want to delete this user?</DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="blue-gray"
            onClick={handleCloseConfirmDialog}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete}>Delete</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default Freelancers;
