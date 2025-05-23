import React, { useState } from 'react'
import {FiMapPin, FiSearch} from 'react-icons/fi'
const Banner = ({query, handleInputChange}) => {
  return (
    <div className="max-w-screen-2xl container mx-auto xl:px-24 px-4 bg-[#FFF2E1] md:py-20 py-14" style={{"marginTop": "24px"}}>
      <h1 className="font-bold text-primary mb-3 text-5xl">Find your <span className="text-[#51834f]">new project</span> today</h1>
      <p className=" text-black/70 mb-8 text-lg">Endless opportunities are just around the corner—dive in and grab yours.</p>
      <form>
        <div className=" flex justify-start md:flex-row flex-col md:gap-0 gap-4">
          <div className="flex md:rounded-s-md rounded shadow-sm ring-1 ring-inset ring-gray-500 focus-within:ring-2
           focus-within:ring-inset focus-within:ring-[#00F7CE] md:w-1/2 w-full">
            <input type='text' name='title' id='title'placeholder='What projects you are looking for?' className='block flex-1 border-0 
            bg-transparent py-1.5 pl-8 text-gray-900 placeholder:text-gray-400 focus:right-0 sm:text-sm sm:leading-6'
             onChange={handleInputChange}
             value={query}/>
             <FiSearch className="absolute mt-2.5 ml-2 text-gray-400"/>
          </div>
         
          <button onClick={(e) => {e.preventDefault()}} type='submit' className="text-white bg-[#009B81] py-2 px-8 md:rounded-s-none rounded">Search</button>
        </div>
      </form>
    </div>
   
  )
}

export default Banner