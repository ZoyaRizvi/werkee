import React, { useEffect, useState } from "react";
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
} from "@material-tailwind/react";
import { EllipsisVerticalIcon, ArrowUpIcon } from "@heroicons/react/24/outline";
import { ordersOverviewData } from "@/data";
import Banner from "./UserDashboard/Banner";
import { Jobs } from "./UserDashboard/Jobs";
import CardCustom from "./UserDashboard/Card";
import { db } from "../../firebase/firebase";
import { collectionGroup, getDocs } from "firebase/firestore";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "jobs"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
  
      // Sort the jobs by the timestamp field in descending order (latest first)
      const sortedJobs = newData.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
      setJobs(sortedJobs);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching jobs: ", error);
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    setIsLoading(true);
    fetchPost();
  }, []);

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = jobs.filter((job) =>
    job.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  const calculatePageRange = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return { startIndex, endIndex };
  };

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredItems.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const filteredData = (jobs, selected, query) => {
    let filteredJobs = jobs;

    if (query) {
      filteredJobs = filteredItems;
    }

    if (selected) {
      filteredJobs = filteredJobs.filter(
        ({ experienceLevel, postingDate, maxPrice }) =>
          parseInt(maxPrice) <= parseInt(selected)
      );
    }

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);
    return filteredJobs.map((data, i) => <CardCustom key={i} data={data} />);
  };

  const result = filteredData(jobs, selectedCategory, query);

  return (
    <>
      <Banner query={query} handleInputChange={handleInputChange} />
      <div className="mt-12">
        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            >
              {/* <div>
                <Typography variant="h6" color="blue-gray" className="mb-1">
                  Projects: Viewing as Recruiter
                </Typography>
              </div> */}
              {/* <Menu placement="left-start">
                <MenuHandler>
                  <IconButton size="sm" variant="text" color="blue-gray">
                    <EllipsisVerticalIcon
                      strokeWidth={3}
                      fill="currentColor"
                      className="h-6 w-6"
                    />
                  </IconButton>
                </MenuHandler>
                <MenuList>
                  <MenuItem>Action</MenuItem>
                  <MenuItem>Another Action</MenuItem>
                  <MenuItem>Something else here</MenuItem>
                </MenuList>
              </Menu> */}
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
              {isLoading ? (
                <Typography>Loading...</Typography>
              ) : (
                <div className="bg-[#] md:grid grid-cols-4 gap-8 lg:px-24 px-4">
                  <div className="bg-white rounded p-4 col-span-4">
                    <Jobs result={result} />
                    {result.length > 0 && (
                      <div className="flex justify-center mt-4 space-x-8">
                        <button
                          onClick={prevPage}
                          disabled={currentPage === 1}
                          className="hover:underline"
                        >
                          Previous
                        </button>
                        <span className="mx-2">
                          Page {currentPage} of{" "}
                          {Math.ceil(filteredItems.length / itemsPerPage)}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={
                            currentPage ===
                            Math.ceil(filteredItems.length / itemsPerPage)
                          }
                          className="hover:underline"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
          <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6"
            >
              <Typography variant="h6" color="blue-gray" className="mb-2">
                Orders Overview
              </Typography>
              <Typography
                variant="small"
                className="flex items-center gap-1 font-normal text-blue-gray-600"
              >
                <ArrowUpIcon
                  strokeWidth={3}
                  className="h-3.5 w-3.5 text-teal-500"
                />
                <strong>24%</strong> this month
              </Typography>
            </CardHeader>
            <CardBody className="pt-0">
              {ordersOverviewData.map(
                ({ icon, color, title, description }, key) => (
                  <div key={title} className="flex items-start gap-4 py-3">
                    <div
                      className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${
                        key === ordersOverviewData.length - 1
                          ? "after:h-0"
                          : "after:h-4/6"
                      }`}
                    >
                      {React.createElement(icon, {
                        className: `!w-5 !h-5 ${color}`,
                      })}
                    </div>
                    <div>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="block font-medium"
                      >
                        {title}
                      </Typography>
                      <Typography
                        as="span"
                        variant="small"
                        className="text-xs font-medium text-blue-gray-500"
                      >
                        {description}
                      </Typography>
                    </div>
                  </div>
                )
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Home;