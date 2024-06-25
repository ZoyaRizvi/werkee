import { useEffect, useState } from "react";
import { Jobs } from "./Jobs";
import Card from "./Card";
import Location from "./Location";
import Jobpostingdate from "./Jobpostingdate";
// import Banner from "./Banner";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [currentPage, SetCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() =>{
    setIsLoading(true);
    fetch("jobs.json").then(res => res.json()).then(data =>{
      // console.log(data)
      setJobs(data);
      setIsLoading(false)
    })
  },[])
 // console.log(jobs)

//-----handle input change---

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
      setQuery(event.target.value)
  }

  //------- filter jobs by titles------
  const filteredItems = jobs.filter((job) => job.jobTitle.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  console.log(filteredItems)

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
  const filteredData= (jobs, selected, query)=>{
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
      console.log(filteredJobs);
    
    }
    //slice the data based on current page 
    const {startIndex,endIndex}= calculatePageRange();
    filteredJobs= filteredJobs.slice(startIndex, endIndex)
    return filteredJobs.map((data, i) => <Card key={i} data={data}/>)


  }

  const result= filteredData(jobs, selectedCategory, query);


  return (
    

    <div >
      <Banner query={query} handleInputChange={handleInputChange}/>

      {/*main content */}

      <div className=" bg-[#] md:grid grid-cols-4 gap-8 lg:px-24 px-4 py-12">
        {/*  Left side */}
        <div className=" bg-white rounded p-4"><Location handleChange = {handleChange} handleClick= {handleClick}/>
        <Jobpostingdate handleChange = {handleChange} handleClick= {handleClick}/></div>
        
        {/*  job cards */}
        <div className=" bg-white rounded p-4 col-span-2">
          <Jobs result= {result}/>

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

        {/*  Right side 
        <div className=" bg-white rounded p-4">Right</div>*/}
        
        
      </div>


    </div>
  )
}

export default Home