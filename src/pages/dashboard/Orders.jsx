import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs, doc, updateDoc, getDoc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
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
  // const [updateOrderStatus, setUpdateOrderStatus]= useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const DEFAULT_PROFILE_IMAGE =
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUFJ4m3HGM8397IWhGhLphaU38QtqrcYQoUg&s";

    const fetchOffers = async () => {
      const offersRef = collection(db, "Offers");
      const q = query(offersRef, where("RecruiterEmail", "==", dbUser.email));
    
      const querySnapshot = await getDocs(q);
      const offers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      // Sort offers by timestamp in descending order after fetching data
      const sortedOffers = offers.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setOffersData(sortedOffers);
    };
    
    const fetchAcceptedOrders = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("RecruiterEmail", "==", dbUser.email));
    
      const querySnapshot = await getDocs(q);
      const orders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    
      // Sort orders by timestamp in descending order after fetching data
      const sortedOrders = orders.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setAcceptedOrders(sortedOrders);
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
              size="me"
              variant="gradient"
              color="green"
            >
              Accept Offer
            </Button>
            <Button onClick={() => declineOffer(offer.id)} size="me" variant="gradient" color="red" >
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
              <tr key={order.id}>
                <td className="px-6 py-4">{order.id}</td>
                <td className="px-6 py-4">{new Date(order.timestamp).toLocaleDateString()}</td>
                <td className="px-6 py-4">{order.title}</td>
                <td className="px-6 py-4">{order.FreelancerEmail}</td>
                <td className="px-6 py-4">{order.price}</td>
                <td className="px-6 py-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <Typography variant="h4" className="font-semibold">Order Management</Typography>

      <div className="flex items-center justify-start gap-4 mt-6">
        <Button
          onClick={() => setCurrentTab("All Offers")}
          size="sm"
          variant={currentTab === "All Offers" ? "filled" : "outlined"}
          color="teal"
        >
          All Offers
        </Button>
        <Button
          onClick={() => setCurrentTab("Accepted Orders")}
          size="sm"
          variant={currentTab === "Accepted Orders" ? "filled" : "outlined"}
          color="teal"
        >
          Accepted Orders
        </Button>
      </div>

      {currentTab === "All Offers" && renderAllOffers()}
      {currentTab === "Accepted Orders" && renderAcceptedOrders()}

      {/* Modal for Payment Form */}
      {showModal && (
        <div className="fixed inset-0 z-10 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <Typography variant="h6">Payment Details</Typography>
            <div className="mt-4">
              <Input
                name="cardNumber"
                value={paymentForm.cardNumber}
                onChange={handleInputChange}
                label="Card Number"
                className="mb-4"
              />
              <Input
                name="expiryDate"
                value={paymentForm.expiryDate}
                onChange={handleInputChange}
                label="Expiry Date"
                className="mb-4"
              />
              <Input
                name="cvv"
                value={paymentForm.cvv}
                onChange={handleInputChange}
                label="CVV"
                className="mb-4"
              />
            </div>
            <div className="flex justify-between mt-6">
              <Button variant="outlined" color="red" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="filled" color="green" onClick={handlePayment}>
                Pay Now
              </Button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}
