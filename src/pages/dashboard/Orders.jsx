import React from 'react'
import { useState, useEffect } from 'react';
import { Avatar } from '@material-tailwind/react';
import { getDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const ordersData = [
    { id: "#425482", date: "05/09/2020", customer: "Wade Warren", email: "wadewarren@gmail.com", price: "$523", status: "Pending" },
    { id: "#425481", date: "28/08/2020", customer: "Jenny Wilson", email: "jennyw7@gmail.com", price: "$782", status: "Delivered" },
    { id: "#425480", date: "17/08/2020", customer: "Kristin Watson", email: "kristina@gmail.com", price: "$325", status: "Pending" },
    { id: "#425479", date: "07/08/2020", customer: "Kathryn Murphy", email: "kathryn@gmail.com", price: "$652", status: "Delivered" },
    { id: "#425478", date: "02/08/2020", customer: "Albert Flores", email: "albertflores@gmail.com", price: "$854", status: "Pending" },
    { id: "#425477", date: "25/07/2020", customer: "Ronald Richards", email: "richards@gmail.com", price: "$578", status: "Delivered" },
    { id: "#425476", date: "16/07/2020", customer: "Floyd Miles", email: "floydmiles@gmail.com", price: "$365", status: "Canceled" },
    { id: "#425475", date: "13/07/2020", customer: "Brooklyn Simmons", email: "brooklyn@gmail.com", price: "$896", status: "Delivered" },
    { id: "#425474", date: "12/07/2020", customer: "Courtney Henry", email: "courtney@gmail.com", price: "$325", status: "Pending" },
    { id: "#425473", date: "09/07/2020", customer: "Jacob Jones", email: "jacobjones@gmail.com", price: "$474", status: "Canceled" },
  ];
    // Add more orders as needed


export default function Orders() {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 10;
    const [user, setUser] = useState(null);
  
    // Get current orders
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = ordersData.slice(indexOfFirstOrder, indexOfLastOrder);
  
    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    useEffect(() => {
        const fetchUserData = async () => {
          const userId = JSON.parse(localStorage.getItem('user')).uid; // Assuming user ID is stored in localStorage
          const userDoc = await getDoc(doc(db, "users", userId));
          if (userDoc.exists()) {
            setUser(userDoc.data());
          } else {
            console.error("No such user!");
          }
        };
    
        fetchUserData();
      }, []);
  
    return (
        <div className="p-8 bg-gray-50 min-h-screen ">
          {/* Header */}
          <div className="flex justify-between items-center p-8 bg-[#fff2e1] rounded-lg shadow-sm ">
            <h1 className="text-2xl font-bold">All Orders</h1>

            <div className="flex items-center space-x-4">
              <img
                src={user.img}
                alt="Profile"
                className="w-10 h-10 rounded-full"
              />
            
            </div>
          </div><br></br>
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
                  <td className="px-6 py-4">{order.id}</td>
                  <td className="px-6 py-4">{order.date}</td>
                  <td className="px-6 py-4">
                  <Avatar
                  src={user.img}
                  alt={{}}
                  className="h-8 w-8  p-1"
                /> 
                {order.customer}
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