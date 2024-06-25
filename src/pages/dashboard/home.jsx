import React from "react";
import { useEffect, useState } from "react";
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
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
} from "@heroicons/react/24/outline";
import {
  projectsTableData,
  ordersOverviewData,
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import Banner from "./UserDashboard/Banner";
import { Jobs } from "./UserDashboard/Jobs";
import CardCustom from "./UserDashboard/Card";
import Location from "./UserDashboard/Location";
import Jobpostingdate from "./UserDashboard/Jobpostingdate";
import { db } from "../../firebase/firebase";
import { collection, getDocs } from "firebase/firestore";
import './UserDashboard/style.css'

export function Home() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [currentPage, SetCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchPost = async () => {

    await getDocs(collection(db, "projects"))
        .then((querySnapshot)=>{
            const newData = querySnapshot.docs
                .map((doc) => ({...doc.data(), id:doc.id }))
            setJobs(newData)
            console.log(jobs, newData)
        }).catch(function(error) {
          console.log(error);
        });
    }

  useEffect(() =>{
    setIsLoading(true);
    // Add firestore here instead of json
    fetchPost().then(res => res.json()).then(data =>{
        console.log(data)
        setJobs(data);
        setIsLoading(false)
    }).catch(function(error) {
      console.log(error);
    });
    // fetch("../src/data/projects-data.json").then(res => res.json()).then(data =>{
    //   console.log(data)
    //   setJobs(data);
    //   setIsLoading(false)
    // })
  },[])

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
      setQuery(event.target.value)
  }

  //------- filter jobs by titles------
  const filteredItems = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  // console.log(filteredItems)

  // ------------radio filters-----------
  const handleChange =(event) =>{
     setSelectedCategory(event.target.value)
  }

  // ----------button based filters-----------
  const handleClick = (event)=>{
     setSelectedCategory(event.target.value)
  }
   
  // ------Calculate the index range-----
  const calculatePageRange = () =>{
    const startIndex = (currentPage -1) *itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return{startIndex,endIndex};
  }

  // -----function for the next page-----
const nextPage = () =>{
    if(currentPage < Math.ceil(filteredItems.length / itemsPerPage)){
        SetCurrentPage(currentPage + 1);
  }
} 

 // -----function for the previous page-----
const prevPage = () =>{
    if(currentPage > 1){
        SetCurrentPage(currentPage - 1);
    }
}

  // ----------main function-----
  const filteredData = (jobs, selected, query)=>{
    let filteredJobs = jobs;

    //filtering input items
    if(query){
        filteredJobs= filteredItems;
      }

    //category filtering
    if(selected){
      filteredJobs = filteredJobs.filter(({experienceLevel, postingDate, 
      maxPrice}) =>(
          parseInt(maxPrice) <= parseInt(selected) 
      ));
      // console.log(filteredJobs);
    }
    //slice the data based on current page 
    const {startIndex,endIndex}= calculatePageRange();
    filteredJobs = filteredJobs.slice(startIndex, endIndex)
    return filteredJobs.map((data, i) => <CardCustom key={i} data={data}/>)
  }

  const result = filteredData(jobs, selectedCategory, query);

  return (
    <>
    <Banner query={query} handleInputChange={handleInputChange}/>
         <div className=" bg-[#] md:grid grid-cols-4 gap-8 lg:px-12 px-4 py-12">
        {/*  Left side */}
       
        
        {/*  job cards */}
        <div className=" bg-white rounded-lg my-2 p-4 col-span-3">
          <Card className="mt-5"> <Jobs result= {result}/></Card>
         
          

          {/*  Pagination here */}
          {
            result.length > 0 ? (
              <div className=" flex justify-center mt-4 space-x-8">
              <button onClick={prevPage} disabled={currentPage == 1} className="hover:underline">Previous</button>
              <span className=" mx-2">Page {currentPage} of {Math.ceil(filteredItems.length / itemsPerPage)}</span>
              <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredItems.length /itemsPerPage)} className="hover:underline">
                Next</button>
              </div>
            ):""
          }
          </div>
          <div className=" bg-white rounded-lg p-8"><Location handleChange = {handleChange} handleClick= {handleClick}/>
        <Jobpostingdate handleChange = {handleChange} handleClick= {handleClick}/></div>

        
        
        
      </div>
    </>
    
  );
}

export default Home;
