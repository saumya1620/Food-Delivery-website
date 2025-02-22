import React, { useContext, useEffect, useState } from "react";
import "./myorders.css";
import { Storecontext } from "../../context/Storecontext";
import { assets } from "../../assets/assets";
import { getAuthToken, getBaseApiUrl } from "../../misc";
import { toast } from "react-toastify";
import axios from "axios";
const Myorders = () => {
  const [orders, setOrders] = useState({ count: 0, rows: [] });
  const fetchOrders = async () => {
    try {
      const response = await axios.get(getBaseApiUrl() + "/orders", {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch Orders Error:", error);
      toast.error("Error fetching my orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {orders.rows.map((order, index) => {
          return (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.Dishes.map((item, index) => {
                  if (index === order.Dishes.length - 1) {
                    return item.name + " x " + item.OrderDish.quantity;
                  } else {
                    return item.name + " x " + item.OrderDish.quantity + ", ";
                  }
                })}
              </p>
              <p>${order.amount}</p>
              <p>Items:{order.Dishes.length}</p>
              <p>
                <span>&#x25cf;</span>
                <b>{order.status}</b>
              </p>
              <button>Track Order</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Myorders;
