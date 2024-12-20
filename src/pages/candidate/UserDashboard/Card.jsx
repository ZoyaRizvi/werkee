import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { db, storage, auth } from '@/firebase/firebase';
import { collection, addDoc, doc , setDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { onAuthStateChanged } from 'firebase/auth';

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
    recruiter_email,
    user,
    dbUser,
    orderNumber,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('Apply');
  const [formData, setFormData] = useState({
    name: '',
    resume: null,
    coverLetter: '',
    offerAmount: '',
    offerMessage: '',
    title: '',
    deliveryTime: '',
    revisions: '',
    price: '',
    service: '',
    description: '',
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');



  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      
      }
    });
    return () => unsubscribe();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      resume: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (/\d/.test(formData.name)) {
      newErrors.name = 'Name cannot contain numbers';
    }

    if (!formData.resume) {
      newErrors.resume = 'Resume is required';
    }

    if (!formData.coverLetter) {
      newErrors.coverLetter = 'Cover letter is required';
    } else if (!/^[A-Za-z0-9\s]*$/.test(formData.coverLetter)) {
      newErrors.coverLetter = 'Cover letter can only contain text and numbers';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const resumeRef = ref(storage, `resumes/${formData.resume.name}`);
      await uploadBytes(resumeRef, formData.resume);
      const resumeUrl = await getDownloadURL(resumeRef);

      const recruiterDocRef = doc(db, 'JobResponses', recruiter_id);
      const applicationsCollectionRef = collection(recruiterDocRef, 'applications');

      await addDoc(applicationsCollectionRef, {
        ...formData,
        email: currentUserEmail,
        resume: resumeUrl,
        jobId: id,
        jobTitle: title,
        timestamp: new Date(),
      });

      console.log('Application submitted successfully');
      setIsModalOpen(false);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    if (!formData.title) {
      newErrors.title = 'Title is required';
    }
    if (!formData.deliveryTime) {
      newErrors.deliveryTime = 'Delivery time is required';
    }
    if (!formData.revisions) {
      newErrors.revisions = 'Revisions are required';
    }
    if (!formData.price) {
      newErrors.price = 'Price is required';
    }
    if (!formData.service) {
      newErrors.service = 'Service is required';
    }
    if (!formData.description) {
      newErrors.description = 'Description is required';
    }
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    const orderNumber = Math.floor(100000 + Math.random() * 90000);

    // Generate a custom orderId or use orderNumber as the ID (adjust as needed)
    const offerId = `offer_${orderNumber}`;
    
    try {
      const offerData = {
        title: formData.title,
        deliveryTime: formData.deliveryTime,
        revisions: formData.revisions,
        price: formData.price,
        service: formData.service,
        description: formData.description,
        RecruiterEmail: recruiter_email,
        FreelancerEmail: currentUserEmail,
        timestamp: new Date(),
        orderNumber:offerId,
        status: 'Pending',
      };
    
      // Use orderId as the document ID in the 'orders' collection
      const offersCollectionRef = doc(db, "Offers", offerId); // This uses the orderId as the document ID
    
      // Set the data to this document
      await setDoc(offersCollectionRef, offerData);
    
      console.log('Offer submitted successfully');
      setIsModalOpen(false);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
    
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
          <p className="text-base text-primary/70 pt-3 pl-3">{description}</p>
          <div className="flex justify-between items-center p-4 mb-2">
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-teal-500 text-white py-2 px-4 mt-4 rounded w-32 flex justify-center"
            >
              <span className="mr-2">Apply</span>
              <IoIosArrowDroprightCircle className="text-xl ml-3" />
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
              {/* Modal Header */}
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">
                  {currentTab === 'Apply' ? 'Apply for Position' : 'Make an Offer'}
                </p>
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

              {/* Tabs */}
              <div className="relative mb-6">
                <div className="flex border-b border-gray-200">
                  {['Apply', 'Make an Offer'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setCurrentTab(tab)}
                      className={`flex-1 py-2 text-center font-medium ${
                        currentTab === tab
                          ? 'text-blue-600 border-blue-600 border-b-2'
                          : 'text-gray-500'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div
                  className="absolute bottom-0 left-0 h-1 bg-blue-600 transition-transform duration-300"
                  style={{ transform: `translateX(${currentTab === 'Make an Offer' ? '100%' : '0'})`, width: '50%' }}
                />
              </div>

              {/* Tab Content */}
              {currentTab === 'Apply' && (
                <form onSubmit={handleSubmit}>
                  {/* Apply Form */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Resume</label>
                    <input
                      type="file"
                      name="resume"
                      onChange={handleFileChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.resume && <p className="text-red-500 text-xs italic">{errors.resume}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Cover Letter</label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.coverLetter && <p className="text-red-500 text-xs italic">{errors.coverLetter}</p>}
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-500 text-white py-2 px-4 rounded w-full"
                  >
                    Submit Application
                  </button>
                </form>
              )}

              {currentTab === 'Make an Offer' && (
                <form onSubmit={handleOfferSubmit}>
                  {/* Make an Offer Form */}
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Time (Days)</label>
                    <input
                      type="text"
                      name="deliveryTime"
                      value={formData.deliveryTime}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.deliveryTime && <p className="text-red-500 text-xs italic">{errors.deliveryTime}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Revisions</label>
                    <input
                      type="text"
                      name="revisions"
                      value={formData.revisions}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.revisions && <p className="text-red-500 text-xs italic">{errors.revisions}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Price</label>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.price && <p className="text-red-500 text-xs italic">{errors.price}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Service</label>
                    <input
                      type="text"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.service && <p className="text-red-500 text-xs italic">{errors.service}</p>}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                    />
                    {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
                  </div>

                  <button
                    type="submit"
                    className="bg-teal-500 text-white py-2 px-4 rounded w-full"
                  >
                    Submit Offer
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomCard;
