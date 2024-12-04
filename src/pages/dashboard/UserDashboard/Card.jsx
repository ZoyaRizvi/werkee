import React from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import { db, auth, storage, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, ref, uploadBytes, getDownloadURL } from "@/firebase/firebase";


const CustomCard = ({ data }) => {
  const {
    img,
    title,
    tag,
    description
  } = data;

  return (
    <section className="card" style={{ paddingTop: '20px' }}>
      <div className="flex  flex-col sm:flex-row items-start">
        <img src={img} alt="" className="w-20 h-16 object-cover" />
        <div>
          <h3 className="text-lg mb-2 font-semibold pl-3">{title}</h3>
          <h4 className="text-primary mb-1 pl-3">Title : {title}</h4>
          <h4 className="text-base text-primary/70 pb-2 pl-3"> Tag: {tag}</h4>
  
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
          <p className="text-base text-primary/70 pt-3 pl-3">{description}</p>
          <hr className="border-t border-gray-400 my-4 w-full mt-6" />
        </div>
      </div>
    </section>
  );
};

export default CustomCard;


