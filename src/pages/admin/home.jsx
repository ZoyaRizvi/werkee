import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import { collection, collectionGroup, getDocs } from "firebase/firestore";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement,ChartDataLabels, Title, Tooltip, Legend, ArcElement);

const Home = () => {
  const [jobsData, setJobsData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [titleData, setTitleData] = useState({});

  // Fetch jobs from Firebase
  const fetchJobs = async () => {
    try {
      const jobsSnapshot = await getDocs(collectionGroup(db, "jobs"));
      const jobs = jobsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobsData(jobs);

      // Get the current year
      const currentYear = new Date().getFullYear();

      // Initialize monthly data array
      const months = Array(12).fill(0);
      const titlesCount = {};

      jobs.forEach((job) => {
        if (job.postedDate) {
          const postedDate = new Date(job.postedDate);
          const jobYear = postedDate.getFullYear();
          const jobMonth = postedDate.getMonth(); // 0 = January

          // Only count projects from the current year
          if (jobYear === currentYear) {
            months[jobMonth]++;
          }
        }

        // Titles data
        if (job.title) {
          titlesCount[job.title] = (titlesCount[job.title] || 0) + 1;
        }
      });

      setMonthlyData(months);
      setTitleData(titlesCount);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const monthlyChartData = {
    labels: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    datasets: [
      {
        label: "Projects Posted",
        data: monthlyData,
        backgroundColor: monthlyData.map((count) =>
          count > 10 ? "rgba(54, 162, 235, 0.6)" :
          count > 5 ? "rgba(0, 0, 255, 0.6)" :
          "rgba(75, 192, 192, 0.6)"
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Posted Projects",
      },
    },
    scales: {
      y: {
        suggestedMin: 0,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  const titleChartData = {
    labels: Object.keys(titleData),
    datasets: [
      {
        label: "Job Titles",
        data: Object.values(titleData),
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: "rgba(255, 255, 255, 1)",
        borderWidth: 1,
      },
    ],
  };


  return (
    <div className="container mx-auto p-6">
      {/* Monthly Jobs Chart */}
      <div className="mb-8">
        <Card className="w-full">
        <CardBody>
            <Typography variant="h6" className="text-center mb-4">
              Projects Posted Per Month (Current Year)
            </Typography>
            <div className="w-full">
              <Bar data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Job Titles Distribution Chart */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="h-auto">
          <CardBody>
            <Typography variant="h6" className="text-center mb-4">
              Job Titles Distribution
            </Typography>
            <Pie data={titleChartData} />
          </CardBody>
        </Card>
        {/* Accepted and Declined Offers */}
      
      </div>
      
{/* Existing Table */}
<Typography variant="h4" className="text-center mb-6">
        Project Listings
      </Typography>
      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-left">
              <thead>
                <tr>
                  {[
                    "Title",
                    "Company",
                    "Location",
                    "Description",
                    "Recruiter Email",
                    "",
                  ].map((header, index) => (
                    <th
                      key={index}
                      className="border-b border-blue-gray-100 py-3 px-5 text-left"
                    >
                      <Typography variant="small" className="font-bold">
                        {header}
                      </Typography>
                    </th>
                  ))}
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
                        <td className={classes}>{title}</td>
                        <td className={classes}>{companyName}</td>
                        <td className={classes}>{jobLocation}</td>
                        <td className={classes}>{description}</td>
                        <td className={classes}>{recruiter_email}</td>
                        <td className={classes}>
                          <IconButton
                            size="sm"
                            variant="text"
                            onClick={() => console.log("Delete job ID:", id)}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </IconButton>
                          {/* <IconButton
                            size="sm"
                            variant="text"
                            onClick={() => console.log("Edit job ID:", id)}
                          >
                            <PencilIcon className="h-4 w-4" />
                          </IconButton> */}
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Home;