import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import CardCustom from "./UserDashboard/Card";
import { Jobs } from "./UserDashboard/Jobs";
import { db } from "../../firebase/firebase";
import { collectionGroup, getDocs, getDoc } from "firebase/firestore";
import Banner from "./UserDashboard/Banner";
import Location from "./Location";
import Jobpostingdate from "./Jobpostingdate";
import "./style.css";

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchPost = async () => {
    try {
      const querySnapshot = await getDocs(collectionGroup(db, "projects"));
      const projectData = [];

      for (const doc of querySnapshot.docs) {
        const project = doc.data();

        const candidateWorkDocRef = doc.ref.parent.parent;
        if (candidateWorkDocRef) {
          const candidateWorkDoc = await getDoc(candidateWorkDocRef);
          if (candidateWorkDoc.exists()) {
            const userData = candidateWorkDoc.data();
            projectData.push({
              ...project,
              id: doc.id,
              displayName: userData.displayName || "Unknown User", // Using displayName from Firebase
              profileImage: userData.profileImage || null, // Using profileImage from Firebase
            });
          } else {
            projectData.push({
              ...project,
              id: doc.id,
              displayName: "Unknown User",
              profileImage: null,
            });
          }
        } else {
          projectData.push({
            ...project,
            id: doc.id,
            displayName: "Unknown User",
            profileImage: null,
          });
        }
      }

      setJobs(projectData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects: ", error);
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
    job.title?.toLowerCase().includes(query.toLowerCase())
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
        <div className="mb-4 gap-6">
          <Card className="overflow-hidden xl:col-span-2 border border-blue-gray-100 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 flex items-center justify-between p-6"
            ></CardHeader>
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
          <div className=" bg-white rounded-lg p-8">
            <Location handleChange={handleChange} handleClick={handleClick} />
            <Jobpostingdate
              handleChange={handleChange}
              handleClick={handleClick}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
