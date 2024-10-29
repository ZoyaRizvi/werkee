import React, { useState, useEffect } from 'react';
import { Avatar } from '@material-tailwind/react';
import {  query, where, collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from '../../context/authContext/';

export default function Orders() {
  const { userLoggedIn, dbUser } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [ordersData, setOrdersData] = useState([]);
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center p-8 bg-[#fff2e1] rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">All Orders</h1>
        <div className="flex items-center space-x-4">
          <img src={avatarSrc} alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>
      <br />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="table-auto w-full bg-white border-collapse">
          <thead className="bg-teal-200 text-white">
            <tr>
              <th className="px-6 py-3 text-left font-medium">#Order No.</th>
              <th className="px-6 py-3 text-left font-medium">Date</th>
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
                <td className="px-6 py-4">
                  <Avatar src={order.img} alt={avatarSrc} className="h-10 w-10 p-1" /> 
                  {order.FreelancerEmail || order.customer}
                </td>
                <td className="px-6 py-4">{order.price}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full text-white ${
                      order.status === "Pending"
                        ? "bg-blue-100"
                        : order.status === "Delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-gray-700">Showing {ordersPerPage} entries</div>
        <div>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 mr-2 ${
              currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"
            } rounded-lg`}
          >
            Prev
          </button>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastOrder >= ordersData.length}
            className={`px-4 py-2 ${
              indexOfLastOrder >= ordersData.length
                ? "bg-gray-300"
                : "bg-blue-500 text-white"
            } rounded-lg`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
