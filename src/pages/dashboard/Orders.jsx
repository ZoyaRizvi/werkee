import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc ,deleteDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { useAuth } from "../../context/authContext/";
import { Typography, Button, Select, Option, Input } from "@material-tailwind/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function COrders() {
  const { dbUser } = useAuth();
  const [currentTab, setCurrentTab] = useState("All Offers");
  const [offersData, setOffersData] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const DEFAULT_PROFILE_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s";

  // Fetch all offers from the "Offers" collection
  const fetchOffers = async () => {
    const offersRef = collection(db, "Offers");
    const q = query(offersRef, where("RecruiterEmail", "==", dbUser.email));

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
    const q = query(ordersRef, where("RecruiterEmail", "==", dbUser.email));

    const querySnapshot = await getDocs(q);
    const orders = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setAcceptedOrders(orders);
  };

  const acceptOffer = async (offerId, FreelancerEmail , title) => {
    try {
      const offerRef = doc(db, "Offers", offerId);
      const offerDoc = await getDoc(offerRef);
  
      if (offerDoc.exists()) {
        const offerData = offerDoc.data();
  
        // Create order entry in 'orders' collection
        const orderRef = doc(collection(db, "orders"), offerId);
        await setDoc(orderRef, {
          ...offerData,
          status: "Accepted",
          timestamp: new Date().toISOString(),
        });
  
        // Create notification entry in 'notifications' collection
        const notificationRef = doc(collection(db, "notifications"), offerId);
        await setDoc(notificationRef, {
          message: `Your offer for "${title}" has been accepted`,
          Email: FreelancerEmail,
          offerId: offerId,
          timestamp: new Date().toISOString(),
          seen: false, // This field tracks if the notification has been seen by the user
        });
  
        // Remove the accepted offer from the 'Offers' collection
        await deleteDoc(offerRef); // This removes the offer from the 'Offers' collection
        setOffersData((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));
  
        toast.success("Offer accepted successfully!");
  
        fetchAcceptedOrders(); // Refresh accepted orders to reflect the changes
  
      } else {
        toast.error("Offer not found!");
      }
    } catch (error) {
      console.error("Error accepting offer:", error);
      toast.error("Failed to accept the offer.");
    }
    setShowModal(false)
  };
  
  

  // Decline an offer by updating its status to "Declined"
  const declineOffer = async (offerId) => {
    try {
      const offerRef = doc(db, "Offers", offerId);
      await updateDoc(offerRef, {
        status: "Declined",
        timestamp: new Date().toISOString(),
      });

      // Update the local state to remove the declined offer from the UI
      setOffersData((prevOffers) => prevOffers.filter((offer) => offer.id !== offerId));

      toast.info("Offer declined successfully!");
    } catch (error) {
      console.error("Error declining offer:", error);
      toast.error("Failed to decline the offer.");
    }
  };

  // Update the status of an order
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Get the order document reference
      const orderRef = doc(db, "orders", orderId);
  
      // Fetch the order data to get the title for the notification
      const orderDoc = await getDoc(orderRef);
      if (!orderDoc.exists()) {
        toast.error("Order not found!");
        return;
      }
  
      const orderData = orderDoc.data();
  
      // Update the status in the orders collection
      await updateDoc(orderRef, { status: newStatus });
  
      // Create a notification for the status update
      const notificationRef = doc(collection(db, "notifications"), orderId);
      await setDoc(notificationRef, {
        message: `Your order "${orderData.title}" status has been changed to ${newStatus}`,
        RecruiterEmail: dbUser.email,  // Assuming dbUser.email is the recruiter email
        FreelancerEmail: orderData.FreelancerEmail,  // Assuming FreelancerEmail is in the order data
        orderId: orderId,
        timestamp: new Date().toISOString(),
        seen: false,  // You can set this to true when the user sees the notification
      });
  
      toast.success(`Order status updated to: ${newStatus}`);
      fetchAcceptedOrders();  // Refresh accepted orders to reflect the changes
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status.");
    }
  };
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validatePaymentForm = () => {
    const { cardNumber, expiryDate, cvv } = paymentForm;
    if (!cardNumber || !expiryDate || !cvv) {
      toast.error("Please fill out all fields.");
      return false;
    }
    // Add more specific validation if needed (e.g., regex for card number, expiry date, CVV)
    return true;
  };

  // Handle the "Pay Now" button click
  const handlePayment = () => {
    if (validatePaymentForm()) {
      acceptOffer(selectedOffer.id, selectedOffer.FreelancerEmail , selectedOffer.title); // Trigger accept offer
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
      {offersData.map((offer) => (
        <div key={offer.id} className="mb-6 p-4 border rounded-lg bg-gray-50 shadow-sm">
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
              <Typography variant="small" color="blue-gray" className="font-medium">Delivery Time (in days):</Typography>
              <Typography className="text-sm  ml-2">{offer.deliveryTime}</Typography>
            </div>

            <div className="flex items-center">
              <Typography variant="small" color="blue-gray" className="font-medium">Revision Offered:</Typography>
              <Typography className="text-sm  ml-2">{offer.revisions}</Typography>
            </div>

            <div className="flex items-center">
              <Typography variant="small" color="blue-gray" className="font-medium">Amount:</Typography>
              <Typography className="text-sm  ml-2">{offer.price}</Typography>
            </div>
          </div>

          <div className="mb-2">
            <Typography variant="small" color="blue-gray" className="font-medium">Additional Service:</Typography>
            <Typography className="text-base">{offer.service}</Typography>
          </div>

          <div className="mb-2">
            <Typography variant="small" color="blue-gray" className="font-medium">Description:</Typography>
            <Typography className="text-base">{offer.description}</Typography>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={() => {
                setSelectedOffer(offer);
                setShowModal(true);
              }}
              size="sm"
              variant="gradient"
              color="green"
            >
              Accept Offer
            </Button>
            <Button onClick={() => declineOffer(offer.id)} size="sm" variant="text" color="red">
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAcceptedOrders = () => (
    <div className="overflow-x-auto mt-6">
      <div className="bg-white shadow-lg rounded-lg p-4">
        <table className="table-auto w-full text-left text-sm text-gray-600">
          <thead className="bg-teal-500 text-white rounded-t-lg">
            <tr>
              <th className="px-6 py-3 font-medium">Order No.</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Project Title</th>
              <th className="px-6 py-3 font-medium">Freelancer's Email</th>
              <th className="px-6 py-3 font-medium">Price</th>
              <th className="px-6 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {acceptedOrders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-teal-50 transition duration-300">
                <td className="px-6 py-4 font-semibold">{order.orderNumber || order.id}</td>
                <td className="px-6 py-4">{new Date(order.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4">{order.title}</td>
                <td className="px-6 py-4">{order.FreelancerEmail}</td>
                <td className="px-6 py-4 text-teal-600 font-semibold">{order.price}</td>
                <td className="px-6 py-4">
                  <Select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="w-full text-gray-600 bg-teal-100 hover:bg-teal-200 rounded-md transition duration-300"
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
    </div>
  );
  
  
  
 
  
  

  // Payment Modal Styling
  const renderPaymentModal = () => (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-auto transform transition-transform duration-300 ease-out scale-100">
        <Typography variant="h6" color="blue-gray" className="font-semibold mb-4">Pay to Werkee</Typography>

        <Input
          label="Card Number"
          name="cardNumber"
          value={paymentForm.cardNumber}
          onChange={handleInputChange}
          required
          className="mb-4"
        /> <br/>

        <div className="flex gap-4">
          <Input
            label="Expiry Date (MM/YY)"
            name="expiryDate"
            value={paymentForm.expiryDate}
            onChange={handleInputChange}
            required
            className="mb-4"
          />
          <Input
            label="CVV"
            name="cvv"
            value={paymentForm.cvv}
            onChange={handleInputChange}
            required
            className="mb-4"
          />
        </div>
        <br/>

        <div className="flex justify-between">
          <Button onClick={() => setShowModal(false)} variant="text" color="red" className="w-24">
            Cancel
          </Button>
          <Button onClick={handlePayment} variant="gradient" color="green" className="w-40">
            Pay Now
          </Button>
        </div>
      </div>
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
                  ? "text-blue-600 border-blue-600 border-b-2"
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

      {/* ToastContainer to display notifications */}
      <ToastContainer />

      {/* Payment Modal */}
      {showModal && renderPaymentModal()}
    </div>
  );
}
