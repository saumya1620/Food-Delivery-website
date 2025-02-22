import React, { useCallback, useEffect, useState } from "react";
import "./Orders.css";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";
import { getAuthToken, getBaseApiUrl } from "../../misc";
const currency = "$";

const ORDER_STATUSES = {
  Pending: "Pending",
  Accepted: "Food Processing",
  Processing: "Preparing Food",
  OutForDelivery: "Out for Delivery",
  Delivered: "Delivered",
  Rejected: "Rejected",
  Cancelled: "Cancelled",
};
const Orders = ({}) => {
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
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      toast.error("Error fetching orders.");
    }
  };
  const onStatusChange = useCallback(
    async (status, orderId) => {
      try {
        const response = await axios.patch(
          getBaseApiUrl() + `/orders/${orderId}/update-status`,
          {
            status,
          },
          {
            headers: { Authorization: `Bearer ${getAuthToken()}` },
          }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          console.log("Order Status Updated:", response.data.data);
          const foundIndex = orders.rows.findIndex(
            (item) => item.id === response.data.data.id
          );
          if (foundIndex >= 0) {
            orders.rows[foundIndex] = { ...response.data.data };
            console.log("Matched Row updated", orders.rows[foundIndex]);
            setOrders({ ...orders });
          }
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("API Fetch Error:", error);
        toast.error("Error fetching orders.");
      }
    },
    [orders]
  );

  useEffect(() => {
    fetchAllOrders();
  }, []);
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
                  {order.Dishes.map(
                    (item) => `${item.name} x ${item.OrderDish.quantity}`
                  )}
                </p>
                <p className="order-item-name">
                  {order.address.firstName + " " + order.address.lastName}
                </p>
                <div className="order-item-address">
                  <p>{order.address.street + ","}</p>
                  <p>
                    {order.address.city +
                      ", " +
                      order.address.state +
                      ", " +
                      order.address.country +
                      ", " +
                      order.address.zipcode}
                  </p>
                </div>
                <p className="order-item-phone">{order.address.phone}</p>
              </div>
              <p>Items : {order.Dishes.length}</p>
              <p>
                {currency}
                {order.amount}
              </p>
              <select
                onChange={(e) => onStatusChange(e.target.value, order.id)}
                value={order.status}
              >
                {Object.keys(ORDER_STATUSES).map((item) => (
                  <option value={item}>{ORDER_STATUSES[item]}</option>
                ))}
              </select>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
