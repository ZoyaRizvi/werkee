import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-tailwind/react';
import {  query, where, collection, getDocs,doc, updateDoc  } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from '../../context/authContext/';

export default function Orders() {
  const { userLoggedIn, dbUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersData, setOrdersData] = useState([]);
  const ordersPerPage = ordersData.length;
  const [user, setUser] = useState(null);
  const DEFAULT_PROFILE_IMAGE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s';
  
  // Fetch orders from Firebase
  const fetchOrders = async () => {
    try {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("RecruiterEmail", "==", dbUser.email));
      
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setOrdersData(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = ordersData.slice(indexOfFirstOrder, indexOfLastOrder);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getUserProfilePhoto = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }
    return DEFAULT_PROFILE_IMAGE;
  };
  
  const avatarSrc = getUserProfilePhoto();

  const FreelancerImg =()=>{
    const order = localStorage.getItem('orders');
    if (order) {
      const parsedUser = JSON.parse(order);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }
    return DEFAULT_PROFILE_IMAGE;
  };
  
  const avatarSrc2 = FreelancerImg();
  const handleStatusChange = async (e, orderId) => {
    const newStatus = e.target.value;
  
    try {
      // Update status in Firestore
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      console.log("Order status updated successfully in Firestore");
  
      // Re-fetch the orders to reflect the updated status
      fetchOrders(); // Re-fetch orders after update
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  return (
<div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
  {/* Header */}
  <div className="flex flex-col sm:flex-row justify-between items-center p-6 sm:p-8 bg-[#fff2e1] rounded-lg shadow-sm">
    <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">All Orders</h1>
    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
      <img src={avatarSrc} alt="Profile" className="w-8 h-8 sm:w-10 sm:h-10 rounded-full" />
    </div>
  </div>
  <br />

  {/* Table for larger screens */}
  <div className="overflow-x-auto hidden md:block">
    <table className="table-auto w-full bg-white border-collapse">
      <thead className="bg-teal-200 text-white">
        <tr>
          <th className="px-6 py-3 text-left font-medium">#Order No.</th>
          <th className="px-6 py-3 text-left font-medium">Date</th>
          <th className="px-6 py-3 text-left font-medium">Project Title</th>
          <th className="px-6 py-3 text-left font-medium">Freelancer</th>
          <th className="px-6 py-3 text-left font-medium">Price</th>
          <th className="px-6 py-3 text-left font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {currentOrders.map((order) => (
          <tr key={order.id} className="border-b hover:bg-gray-100">
            <td className="px-6 py-4">{order.orderNumber}</td>
            <td className="px-6 py-4">{new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</td>
            <td className="px-6 py-4">{order.title}</td>
            <td className="px-6 py-4 flex items-center space-x-2">
              <img src={order.img} alt={avatarSrc} className="h-10 w-10 rounded-full" />
              <span>{order.FreelancerEmail || order.customer}</span>
            </td>
            <td className="px-6 py-4">{order.price}</td>
            <td className="px-6 py-4">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(e, order.id)}
                className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                  order.status === "Pending"
                    ? "bg-blue-100"
                    : order.status === "Delivered"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                <option value="Pending" className="bg-blue-100 text-blue-900">
                  Pending
                </option>
                <option value="Delivered" className="bg-green-500 text-green-900">
                  Delivered
                </option>
                <option value="Cancelled" className="bg-red-500 text-red-900">
                  Cancelled
                </option>
              </select>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  {/* Card layout for smaller screens */}
  <div className="md:hidden space-y-4">
    {currentOrders.map((order) => (
      <div key={order.id} className="bg-white shadow rounded-lg p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Order No.</span>
          <span className="text-sm font-semibold">{order.orderNumber}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Date</span>
          <span className="text-sm">{new Date(order.timestamp.seconds * 1000).toLocaleDateString()}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Freelancer</span>
          <div className="flex items-center space-x-2">
            <img src={order.img} alt={avatarSrc} className="h-8 w-8 rounded-full" />
            <span className="text-sm">{order.FreelancerEmail || order.customer}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Price</span>
          <span className="text-sm">{order.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-600">Status</span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e, order.id)}
            className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${
              order.status === "Pending"
                ? "bg-blue-100"
                : order.status === "Delivered"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            <option value="Pending" className="bg-blue-100 text-blue-900">
              Pending
            </option>
            <option value="Delivered" className="bg-green-500 text-green-900">
              Delivered
            </option>
            <option value="Cancelled" className="bg-red-500 text-red-900">
              Cancelled
            </option>
          </select>
        </div>
      </div>
    ))}
  </div>

  {/* Pagination */}
  <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-4 sm:space-y-0">
    <div className="text-gray-700 text-xs sm:text-sm">Showing {ordersPerPage} entries</div>
    <div className="flex space-x-2">
      <button
        onClick={() => paginate(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 sm:px-4 sm:py-2 ${
          currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
        } rounded-lg text-xs sm:text-sm`}
      >
        Prev
      </button>
      <button
        onClick={() => paginate(currentPage + 1)}
        disabled={indexOfLastOrder >= ordersData.length}
        className={`px-3 py-1 sm:px-4 sm:py-2 ${
          indexOfLastOrder >= ordersData.length ? "bg-gray-300" : "bg-blue-500 text-white"
        } rounded-lg text-xs sm:text-sm`}
      >
        Next
      </button>
    </div>
  </div>
</div>

  
  );
}
