import React, { useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { getAuthToken, getBaseApiUrl } from "../../misc";

const Orders = ({ url }) => {
  const [orders, setOrders] = useState({ count: 0, rows: [] });

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(getBaseApiUrl() + "/orders", {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.data.success) {
        setOrders(response.data.data);
        console.log("Orders:", response.data.data);
      } else {
        toast.error("Failed to fetch orders.");
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      toast.error("Error fetching orders.");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [url]); // Added `url` dependency to re-fetch if `url` changes

  return (
    <div className="order add">
      <h3>Order Page</h3>
      <div className="order-list">
        {orders.count === 0 ? (
          <p>No orders found.</p>
        ) : (
          orders.rows.map((order, index) => (
            <div key={index} className="order-item">
              <img src={assets.parcel_icon} alt="Order Icon" />
              <div>
                <p className="order-item-food">
                  {order.items.map((item, idx) =>
                    idx === order.items.length - 1
                      ? `${item.name} x ${item.quantity}`
                      : `${item.name} x ${item.quantity}, `
                  )}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
