import React, { useState } from 'react';
import { db } from "../../firebase/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useAuth } from '../../context/authContext';
import {
  Avatar,
  Button,
  Input,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

const CreateOfferForm = ({ email }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deliveryTime: '',
    price: '',
    revisions: '',
    additionalServices: [{ service: '', price: '' }],
    buyerInstructions: '',
    images: [],
  });
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);

  const { dbUser } = useAuth();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdditionalServiceChange = (index, e) => {
    const newServices = formData.additionalServices.map((service, i) =>
      index === i ? { ...service, [e.target.name]: e.target.value } : service
    );
    setFormData({ ...formData, additionalServices: newServices });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const addAdditionalService = () => {
    setFormData({
      ...formData,
      additionalServices: [...formData.additionalServices, { service: '', price: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUserEmail = dbUser.email;

    try {
      await addDoc(collection(db, 'messages'), {
        from: currentUserEmail,
        to: email,
        users: [currentUserEmail, email],
        offerDetails: formData,
        timestamp: new Date(),
      });

      console.log('Message stored successfully with all fields!');
    } catch (error) {
      console.error('Error storing message: ', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <Button color="green" variant="outlined" onClick={handleOpen}>
        Create Offer
      </Button>

      <Dialog open={open} handler={handleOpen} className="max-h-screen">
        <div className="overflow-y-auto max-h-[75vh] p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Create an Offer</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-gray-700">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter the title of your offer"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Describe the service you are offering"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-lg font-medium text-gray-700">Delivery Time (in days)</label>
                <input
                  type="number"
                  name="deliveryTime"
                  value={formData.deliveryTime}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700">Price (PKR)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Revisions Offered</label>
              <input
                type="number"
                name="revisions"
                value={formData.revisions}
                onChange={handleChange}
                className="w-full mt-2 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Additional Services</label>
              {formData.additionalServices.map((service, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 mt-4">
                  <input
                    type="text"
                    name="service"
                    value={service.service}
                    onChange={(e) => handleAdditionalServiceChange(index, e)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Service Description"
                  />
                  <input
                    type="number"
                    name="price"
                    value={service.price}
                    onChange={(e) => handleAdditionalServiceChange(index, e)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="Price"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addAdditionalService}
                className="mt-4 px-4 py-2 bg-[teal] text-white font-bold rounded-lg shadow  transition duration-200"
              >
                Add Another Service
              </button>
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Upload Images</label>
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="mt-2 block w-full text-lg text-gray-600 bg-gray-50 border border-gray-300 rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <button
              type="submit" onClick={handleOpen}
              className="w-full py-3 bg-[teal] text-white text-lg font-bold rounded-lg shadow transition duration-200"
            >
              Create Offer
            </button>
          </form>
        </div>

        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
};

export default CreateOfferForm;

