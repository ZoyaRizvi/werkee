import React from 'react'
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';

export const Jobs = ({result}) => {

  return (
    <>
     <div>
       <h3 className=" text-lg font-bold mb-2">{result.lenght}</h3>
      </div>
      <section className='card-container'>{result}</section>
    </>    
  )
}