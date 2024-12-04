import { useEffect, useState } from "react";
import { projects } from "./projects";
import Card from "./Card";
import Location from "./Location";
import Jobpostingdate from "./Jobpostingdate";
import Banner from "./Banner";
import { db, auth, storage, collection, addDoc, getDocs, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";


const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading]= useState(true);
  const [currentPage, SetCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Candidate_Work"));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching projects:", error);
      setIsLoading(false);
    }
  };
 // console.log(jobs)

//-----handle input change---

  const [query, setQuery] = useState("");
  const handleInputChange = (event) => {
      setQuery(event.target.value)
  }

  //------- filter jobs by titles------
  const filteredItems = projects.filter((project) =>
    project.title.toLowerCase().includes(query.toLowerCase())
  );

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
  const filteredData= (Projects, selected, query)=>{
    let filteredprojects = projects;

    //filtering input items
    if(query){
        filteredprojects= filteredItems;
      }

    //category filtering
    if(selected){
      filteredprojects = filteredprojects.filter(({experienceLevel, postingDate, 
      maxPrice}) =>(
          parseInt(maxPrice) <= parseInt(selected) 
      ));
      console.log(filteredprojects);
    
    }
    //slice the data based on current page 
    const { startIndex, endIndex } = calculatePageRange();
    return filteredProjects.slice(startIndex, endIndex).map((project) => (
      <Card key={projects.id} data={projects} />
    ));
  };

  const result= filteredData(projects, selectedCategory, query);


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