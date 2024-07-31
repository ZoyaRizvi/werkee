import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";

const CustomCard = ({ data }) => {
  const {
    companyName,
    title,
    companyLogo,
    Requirements,
    jobLocation,
    postingDate,
    employmentType,
    experienceLevel,
    description,
    recruiter_id,
  } = data;

  return (
    <section className="card" style={{ paddingTop: '20px' }}>
      <div className="flex gap-4 flex-col sm:flex-row items-start">
        <img src={companyLogo} alt="" className="w-16 h-16 object-cover" />
        <div>
          <h3 className="text-lg mb-2 font-semibold">{title}</h3>
          <h4 className="text-primary mb-1">Company Name: {companyName}</h4>
          <h4 className="text-base text-primary/70 pb-2"> Requirements: {Requirements}</h4>
  
          <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2">
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
          </div>
          <p className="text-base text-primary/70 pt-3">{description}</p>
          <div className="flex justify-between items-center p-4 mb-2 pl-44">
            <Link
              to={
                '/dashboard/chat?reference=' +
                encodeURI(recruiter_id) +
                '&' +
                'job=' +
                encodeURI(title)
              }
              className="text-black flex items-center"
            >
              <p className="text-white bg-cyan-500 py-2 px-4 mt-4 rounded flex items-center">
                <IoChatbubbleEllipsesOutline className="mr-2 items-end" />
                Message recruiter
              </p>
            </Link>
          </div>
          <hr className="border-t border-gray-400 my-4 w-full mt-6" />
        </div>
      </div>
    </section>
  );
};

export default CustomCard;


