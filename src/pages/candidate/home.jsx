import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
} from "@material-tailwind/react";
import { collectionGroup, getDocs } from "firebase/firestore";
import Banner from "./UserDashboard/Banner";
import { Jobs } from "./UserDashboard/Jobs";
import CardCustom from "./UserDashboard/Card";
import { db } from "../../firebase/firebase";
import Jobpostingdate from "./Jobpostingdate";
import Location from "./Location";
import './style.css';

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [query, setQuery] = useState("");
  const itemsPerPage = 6;

  // Fetch jobs from Firestore
  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "jobs"));
      const newData = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setJobs(newData);
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

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
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

  // Updated filteredData function to filter by date
  const filteredData = (jobs, selectedCategory, selectedDate, query) => {
    let filteredJobs = jobs;

    // Filter by search query (job title)
    if (query) {
      filteredJobs = filteredJobs.filter((job) =>
        (job.title || "").toLowerCase().includes(query.toLowerCase())
      );
    }

    // Filter by location
    if (selectedCategory) {
      filteredJobs = filteredJobs.filter((job) =>
        job.jobLocation && job.jobLocation.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Filter by selected date (postedDate)
    if (selectedDate) {
      const selectedDateObj = new Date(selectedDate);
      filteredJobs = filteredJobs.filter((job) => {
        const jobPostingDate = new Date(job.postedDate); // Use postedDate from jobs
        return jobPostingDate >= selectedDateObj;
      });
    }

    const { startIndex, endIndex } = calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex);

    return filteredJobs.map((data, i) => <CardCustom key={i} data={data} />);
  };

  const result = filteredData(jobs, selectedCategory, selectedDate, query);

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
            />
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
                          {Math.ceil(jobs.length / itemsPerPage)}
                        </span>
                        <button
                          onClick={nextPage}
                          disabled={currentPage === Math.ceil(jobs.length / itemsPerPage)}
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
          <div className=" bg-white rounded-lg p-8">
            <Location handleChange={handleChange} />
            <Jobpostingdate handleChange={handleDateChange} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
