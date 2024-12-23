import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "../../context/authContext/";
import { Typography, Button, Select, Option } from "@material-tailwind/react";

export default function COrders() {
  const { dbUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("All Offers");
  const [offersData, setOffersData] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);

  const DEFAULT_PROFILE_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s";

  // Fetch all offers from the "Offers" collection
  const fetchOffers = async () => {
    const offersRef = collection(db, "Offers");
    const q = query(offersRef, where("FreelancerEmail", "==", dbUser.email));

    const querySnapshot = await getDocs(q);
    const offers = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setOffersData(offers);
  };

  // Fetch accepted orders from the "Orders" collection
  const fetchAcceptedOrders = async () => {
    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("FreelancerEmail", "==", dbUser.email)
    );

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAcceptedOrders(orders);
  };

  // Accept an offer and clone it to the "Orders" collection
  const acceptOffer = async (offerId) => {
    const offerRef = doc(db, "Offers", offerId);
    const offerDoc = await getDoc(offerRef);

    if (offerDoc.exists()) {
      const offerData = offerDoc.data();

      const orderRef = doc(collection(db, "orders"), offerId);
      await setDoc(orderRef, {
        ...offerData,
        status: "Accepted",
        timestamp: new Date().toISOString(),
      });

      alert("Offer accepted and cloned to Orders!");
      fetchOffers();
      fetchAcceptedOrders();
    } else {
      alert("Offer not found!");
    }
  };

  // Decline an offer by updating its status to "Declined"
  const declineOffer = async (offerId) => {
    const offerRef = doc(db, "Offers", offerId);
    await updateDoc(offerRef, {
      status: "Declined",
      timestamp: new Date().toISOString(),
    });

    alert("Offer declined successfully!");
    fetchOffers();
  };

  // Update the status of an order
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      alert(`Order status updated to: ${newStatus}`);
      fetchAcceptedOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update order status.");
    }
  };

  useEffect(() => {
    fetchOffers();
    fetchAcceptedOrders();
  }, [dbUser]);

  const getUserProfilePhoto = () => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.img ? parsedUser.img : DEFAULT_PROFILE_IMAGE;
    }
    return DEFAULT_PROFILE_IMAGE;
  };

  const avatarSrc = getUserProfilePhoto();

  const renderAllOffers = () => (
    <div className="mt-4 w-full p-6 bg-white shadow-lg rounded-xl border border-gray-300">
    {offersData
      .filter((offer) => offer.status !== "Accepted") // Filter out accepted offers
      .map((offer) => (
        <div
          key={offer.id}
          className={`mb-6 p-4 border rounded-lg shadow-sm ${
            offer.status === "Declined" ? "bg-red-50" : "bg-gray-50"
          }`}
        >
          {offer.status === "Declined" ? (
            <>
              <Typography variant="h6" color="red" className="font-semibold mb-2">
                Offer Declined
              </Typography>
              <Typography className="text-lg font-bold mb-4">{offer.title}</Typography>
  
              <Button
                onClick={() => removeOffer(offer.id)}
                size="sm"
                variant="gradient"
                color="red"
              >
                Remove Offer
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" color="blue-gray" className="font-semibold mb-2">
                Offer Details:
              </Typography>
              <div className="mb-2">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Title:
                </Typography>
                <Typography className="text-lg font-bold">{offer.title}</Typography>
              </div>
              <div className="mb-2 flex flex-wrap gap-4">
                <div className="flex items-center">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Delivery Time (in days):
                  </Typography>
                  <Typography className="text-sm  ml-2">{offer.deliveryTime}</Typography>
                </div>
  
                <div className="flex items-center">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Revision Offered:
                  </Typography>
                  <Typography className="text-sm  ml-2">{offer.revisions}</Typography>
                </div>
  
                <div className="flex items-center">
                  <Typography variant="small" color="blue-gray" className="font-medium">
                    Amount:
                  </Typography>
                  <Typography className="text-sm  ml-2">{offer.price}</Typography>
                </div>
              </div>
  
              <div className="mb-2">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Additional Service:
                </Typography>
                <Typography className="text-base">{offer.service}</Typography>
              </div>
  
              <div className="mb-2">
                <Typography variant="small" color="blue-gray" className="font-medium">
                  Description:
                </Typography>
                <Typography className="text-base">{offer.description}</Typography>
              </div>

            </>
          )}
        </div>
      ))}
  </div>
  
  );

  // Remove offer from the database permanently
  const removeOffer = async (offerId) => {
    try {
      const offerRef = doc(db, "Offers", offerId);
      await updateDoc(offerRef, { status: "Deleted" });
      setOffersData((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
      alert("Offer removed successfully!");
    } catch (error) {
      console.error("Error removing offer:", error);
      alert("Failed to remove offer.");
    }
  };


  const renderAcceptedOrders = () => (
    <div className="overflow-x-auto mt-4">
      <table className="table-auto w-full bg-white border-collapse">
        <thead className="bg-teal-200 text-white">
          <tr>
            <th className="px-6 py-3 text-left font-medium">Order No.</th>
            <th className="px-6 py-3 text-left font-medium">Date</th>
            <th className="px-6 py-3 text-left font-medium">Project Title</th>
            <th className="px-6 py-3 text-left font-medium">Recruiter's Email</th>
            <th className="px-6 py-3 text-left font-medium">Price</th>
            <th className="px-6 py-3 text-left font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {acceptedOrders.map((order) => (
            <tr key={order.id} className="border-b hover:bg-gray-100">
              <td className="px-6 py-4">{order.orderNumber || order.id}</td>
              <td className="px-6 py-4">{new Date(order.timestamp).toLocaleDateString()}</td>
              <td className="px-6 py-4">{order.title}</td>
              <td className="px-6 py-4">{order.RecruiterEmail}</td>
              <td className="px-6 py-4">{order.price}</td>
              <td className="px-6 py-4">
                <Select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  className="w-full"
                  variant="standard"
                >
                  <Option value="Pending">Pending</Option>
                  <Option value="Delivered">Delivered</Option>
                  <Option value="Cancelled">Cancelled</Option>
                  <Option value="Accepted">Accepted</Option>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center p-8 bg-[#fff2e1] rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold">Offers</h1>
        <div className="flex items-center space-x-4">
          <img src={avatarSrc} alt="Profile" className="w-10 h-10 rounded-full" />
        </div>
      </div>

      <div className="relative mt-6">
        <div className="flex border-b border-gray-200">
          {["All Offers", "Accepted Orders"].map((tab) => (
            <button
              key={tab}
              onClick={() => setCurrentTab(tab)}
              className={`flex-1 py-2 text-center font-medium ${currentTab === tab
                ? "text-teal-600 border-teal-600 border-b-2"
                : "text-gray-500"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {currentTab === "All Offers" && renderAllOffers()}
      {currentTab === "Accepted Orders" && renderAcceptedOrders()}
    </div>
  );
}
