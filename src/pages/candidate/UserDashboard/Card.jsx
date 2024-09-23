import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoIosArrowDroprightCircle } from "react-icons/io";
import { db, storage, auth } from "@/firebase/firebase"; // Adjust the path as necessary
import { collection, addDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth'; // Import auth methods

const CustomCard = ({ data }) => {
  const {
    id, 
    companyName,
    title,
    companyLogo,
    Requirements,
    jobLocation,
    postedDate,
    employmentType,
    experienceLevel,
    description,
    recruiter, 
    jobTitle,
    recruiter_id,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    resume: null,
    coverLetter: ''
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    // Listen to authentication state changes and get the current user
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email); // Set the current user's email
      }
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Upload resume to Firebase Storage
      const resumeRef = ref(storage, `resumes/${formData.resume.name}`);
      await uploadBytes(resumeRef, formData.resume);
      const resumeUrl = await getDownloadURL(resumeRef);

      // Save the form data to Firestore under the specific recruiter
      const recruiterDocRef = doc(db, 'JobResponses', recruiter_id);
      const applicationsCollectionRef = collection(recruiterDocRef, 'applications');

      await addDoc(applicationsCollectionRef, {
        ...formData,
        email: currentUserEmail, // Save the session user's email
        resume: resumeUrl, // Store the download URL of the resume
        jobId: id, // Add jobId to the application data
        jobTitle: title, // Add jobTitle to the application data
        timestamp: new Date()
      });

      console.log("Application submitted successfully");
    } catch (e) {
      console.error("Error adding document: ", e);
    }

    setIsModalOpen(false);
  };

  return (
    <section className="card" style={{ paddingTop: '20px' }}>
      <div className="flex flex-col sm:flex-row items-start">
        <img src={companyLogo} alt="" className="w-20 h-16 object-cover" />
        <div>
          <h3 className="text-lg mb-2 pl-3 font-semibold">{title}</h3>
          <h4 className="text-primary mb-1 pl-3">Company Name: {companyName}</h4>
          <h4 className="text-base text-primary/70 pb-2 pl-3">Requirements: {Requirements}</h4>

          <div className="text-primary/70 text-base flex flex-wrap gap-2 mb-2 pl-2">
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
              {new Date(postedDate).toLocaleDateString()}
            </span>
          </div>
          <p className='text-base text-primary/70 pt-3 pl-3'>{description}</p>
          <div className="flex justify-between items-center p-4 mb-2">
            {/* <Link to={'/dashboard/chat?reference=' + encodeURIComponent(recruiter) + '&job=' + encodeURIComponent(jobTitle)} className='text-black flex items-center'>
              <p className='text-white bg-cyan-500 py-2 px-4 mt-4 rounded flex items-center'><IoChatbubbleEllipsesOutline className='mr-2 items-end' />Message recruiter</p>
            </Link> */}

            <button onClick={() => setIsModalOpen(true)} className="bg-teal-500 text-white py-2 px-4 mt-4 rounded w-32 flex justify-center">
              <span className="mr-2">Apply</span><IoIosArrowDroprightCircle className="text-xl ml-3" />
            </button>
          </div>

          <hr className="border-t border-gray-400 my-4 w-full mt-6" />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-content py-4 text-left px-6">
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Apply for {title}</p>
                <button
                  className="modal-close cursor-pointer z-50"
                  onClick={() => setIsModalOpen(false)}
                >
                  <svg
                    className="fill-current text-black"
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                  >
                    <path d="M14.53 4.53a.75.75 0 00-1.06 0L9 8.94 4.53 4.53a.75.75 0 00-1.06 1.06L7.94 10l-4.47 4.47a.75.75 0 001.06 1.06L9 11.06l4.47 4.47a.75.75 0 001.06-1.06L10.06 10l4.47-4.47a.75.75 0 000-1.06z"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Resume
                  </label>
                  <input
                    type="file"
                    name="resume"
                    onChange={handleFileChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Cover Letter
                  </label>
                  <textarea
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    required
                  ></textarea>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    className="bg-cyan-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    className="bg-gray-300 text-black font-bold py-2 px-4 rounded ml-2 focus:outline-none focus:shadow-outline"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomCard;





