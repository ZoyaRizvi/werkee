import React, { useState } from 'react';
import { FiCalendar, FiClock, FiDollarSign, FiMapPin } from 'react-icons/fi';
import FreelancerProfile from '../FreelancerProfile';

const CustomCard = ({ data }) => {
  const {
    img,
    title,
    displayName,
    tag,
    description,
    user_name,
    profile_pic,
    uid
    
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(uid)

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="card" style={{ paddingTop: '20px' }}>
      <div className="flex flex-col sm:flex-row items-start">
        <img src={profile_pic} alt="Profile" className="w-20 h-16 object-cover" />
        <div>
          {/* Username that triggers modal */}
          <h2
            className="text-lg mb-2 font-semibold pl-3 cursor-pointer"
            onClick={openModal}
          >
            {user_name}
          </h2>

          <h4 className="text-lg mb-2 font-medium pl-3">Title: {title}</h4>
          <img src={img} alt="Content" className="w-80 h-40 object-cover ml-4 mt-5" />
          <p className="text-base text-primary/70 pt-3 pl-3">{description}</p>
          <h4 className="text-primary mb-1 pl-3 font-semibold mt-2">Tag: {tag}</h4>

          <hr className="border-t border-gray-400 my-4 w-full mt-6" />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-gray-500 opacity-75"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white w-full h-full overflow-y-auto">
            <div className="py-4 text-left px-6">
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3">
                <h3 className="text-2xl font-bold">User Profile</h3>
                <button
                  className="text-black"
                  onClick={closeModal}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              {/* <div>
                <img
                  src={profile_pic}
                  alt="Profile"
                  className="w-32 h-32 rounded-full mx-auto"
                />
                <h4 className="text-lg font-medium text-center mt-4">{user_name}</h4>
                <p className="text-sm text-gray-700 text-center mt-2">{description}</p>
              </div> */}
              <FreelancerProfile uid={uid}/>

              {/* Modal Footer */}
              <div className="flex justify-end pt-4">
                <button
                  onClick={closeModal}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomCard;



