import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiMapPin } from 'react-icons/fi';
import { IoIosArrowDroprightCircle } from 'react-icons/io';
import { db, storage , auth } from '@/firebase/firebase';
import { doc, setDoc } from 'firebase/firestore';
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
    description,
    recruiter_email,
  } = data;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '', // Title will be auto-filled
    deliveryTime: '',
    revisions: '',
    price: '',
    service: '',
    description: '',
  });
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Effect to fetch the current user's email on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserEmail(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  // When modal is opened, pre-fill the title and reset other fields
  const openModal = () => {
    setFormData({
      title: title, // Automatically set the job title in the form
      deliveryTime: '', // Empty by default
      revisions: '',
      price: '',
      service: '',
      description: '', // Empty by default
    });
    setIsModalOpen(true);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission for making an offer
  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
  
    // Validate required fields
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
    const offerId = `offer_${orderNumber}`;
  
    try {
      // Create offer data
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
        orderNumber: offerId,
        status: 'Pending',
      };
  
      // Save offer data to Firestore
      const offersCollectionRef = doc(db, "Offers", offerId);
      await setDoc(offersCollectionRef, offerData);
  
      console.log('Offer submitted successfully');
  
      // Add a new notification to the notification collection
      const notificationMessage = `You have a new offer on ${formData.title}`;
  
      // Create notification data
      const notificationData = {
        message: notificationMessage,
        Email: recruiter_email,  // The recruiter is the recipient of the notification
        timestamp: new Date(),
        isRead: false,  // Set to false initially, meaning the recruiter hasn't read the notification yet
      };
  
      // Save the notification data to Firestore
      const notificationCollectionRef = doc(db, "notifications", offerId);  // We use the offerId to associate it with the offer
      await setDoc(notificationCollectionRef, notificationData);
  
      console.log('Notification added successfully');
  
      // Close the modal after submitting the offer
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
              onClick={openModal}
              className="bg-teal-500 text-white py-2 px-4 mt-4 rounded w-40 flex justify-center"
            >
              <span className="mr-2 ">Make Offer</span>
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
              <div className="flex justify-between items-center pb-3">
                <p className="text-2xl font-bold">Make an Offer</p>
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

              <form onSubmit={handleOfferSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title} // Automatically set the title field
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    disabled
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">Delivery Time (Days)</label>
                  <input
                    type="number"
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
                    type="number"
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
                    type="number"
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
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CustomCard;

