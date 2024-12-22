import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collectionGroup, getDocs } from "firebase/firestore";

const Home= () => {
  const [jobsData, setJobsData] = useState([]);

  // Fetch jobs from Firebase
  const fetchJobs = async () => {
    try {
      const jobsSnapshot = await getDocs(collectionGroup(db, "jobs"));
      const jobs = jobsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setJobsData(jobs);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  // Call fetchJobs when the component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  const handleOpenPostConfirmDialog = (id) => {
    console.log("Open delete confirmation dialog for job ID:", id);
    // Handle delete confirmation logic here
  };

  const handleOpenPostEditDialog = (job) => {
    console.log("Open edit dialog for job:", job);
    // Handle edit dialog logic here
  };

  return (
    <div className="container mx-auto p-6">
      <Typography variant="h4" className="text-center mb-6">
        Project Listings
      </Typography>
      <Card>
        <CardBody>
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                {["Title", "Company", "Location", "Description", "Recruiter Email", ""].map(
                  (header, index) => (
                    <th
                      key={index}
                      className="border-b border-blue-gray-100 py-3 px-5 text-left"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-bold leading-none opacity-70"
                      >
                        {header}
                      </Typography>
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {jobsData.map(
                (
                  { id, title, companyName, jobLocation, description, recruiter_email },
                  index
                ) => {
                  const isLast = index === jobsData.length - 1;
                  const classes = isLast
                    ? "py-3 px-5"
                    : "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-bold"
                        >
                          {title}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {companyName}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {jobLocation}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {description}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal"
                        >
                          {recruiter_email}
                        </Typography>
                      </td>
                      <td className={classes}>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          onClick={() => handleOpenPostConfirmDialog(id)}
                        >
                          <TrashIcon className="h-4 w-4" />
                        </IconButton>
                        <IconButton
                          size="sm"
                          variant="text"
                          color="blue-gray"
                          onClick={() =>
                            handleOpenPostEditDialog({
                              id,
                              title,
                              companyName,
                              jobLocation,
                              description,
                              recruiter_email,
                            })
                          }
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;
