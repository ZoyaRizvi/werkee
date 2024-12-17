import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';

const CustomCard = ({ data }) => {
  const {
    img,
    title,
    displayName,
    tag,
    description,
  } = data;
  console.log(data); // Add this in your CustomCard component

  return (
    <section className="card" style={{ paddingTop: '20px' }}>
      <div className="flex  flex-col sm:flex-row items-start">
        <img src={img} alt="" className="w-20 h-16 object-cover" />
        <div>
          <h2 className="text-lg mb-2 font-semibold pl-3"> {displayName}</h2>
          <h4 className="text-lg mb-2 font-medium pl-3">Title: {title}</h4>
          
          
          
  
          {/* <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2 pl-2">
            <span className="flex items-center gap-2">
              <FiMapPin />
              {jobLocation}
            </span>
            <span className="flex items-center gap-2">
              <FiClock />
              {employmentType}
            </span>
            <span className="flex items-center gap-2">
              <FiCalendar />
              {new Date(postingDate).toLocaleDateString()}
            </span>
          </div> */}
          <img src={img} alt="" className=" w-80 h-40 object-cover ml-4 mt-5" />
          <p className="text-base text-primary/70 pt-3 pl-3">{description}</p>
          <h4 className="text-primary mb-1 pl-3 font-semibold mt-2">Tag: {tag}</h4>
          
          <hr className="border-t border-gray-400 my-4 w-full mt-6" />
          
        </div>
      </div>
    </section>
  );
};

export default CustomCard;


