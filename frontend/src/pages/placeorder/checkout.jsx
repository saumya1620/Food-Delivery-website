import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getAuthToken, getBaseApiUrl } from "../../misc";
import { toast } from "react-toastify";
import axios from "axios";

const Checkout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  const handleFetchOrder = async (orderId) => {
    try {
      const result = await axios.post(
        getBaseApiUrl() + "/orders/validate-checkout",
        {
          orderId,
        },
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );
      // console.log("Order Validated ", result);
      const resp = result.data || {};
      if (resp.success) {
        setOrder(resp.data);
      } else {
        toast.error(resp.message);
      }
    } catch (e) {
      console.log("Order validate failed", e);
      toast.error("Order validation failed!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const orderId = searchParams.get("order_id");

    if (orderId) {
      handleFetchOrder(orderId);
    }
  }, []);

  const handleDownloadInvoice = () => {};

  return (
    <div className="checkout-complete">
      {loading ? (
        <div className="loading">Please wait...</div>
      ) : order ? (
        <div>
          <h2 className={`confirmation-${order.paymentStatus.toLowerCase()}`}>
            {order.paymentStatus === "Success"
              ? "Order Confirmed!"
              : "Order Failed!"}
          </h2>

          {order.paymentStatus === "Success" && (
            <div className="address">
              <div className="address-caption">
                Your food will be delivered soon at address:
              </div>
              <div>
                {order.address.firstName} {order.address.lastName}
              </div>
              <div>{order.address.street}</div>
              <div>
                {order.address.city}, {order.address.state},{" "}
                {order.address.country} {order.address.zipcode}
              </div>
              <div>Phone: {order.address.phone}</div>
            </div>
          )}

          <div className="order">
            <div className="order-caption">
              Order #{order.id}, Status [{order.status}]
            </div>
            <ul className="order-items">
              {order.Dishes.map((dish) => {
                return (
                  <li
                    key={dish.OrderDish.orderId + dish.dishId}
                    className="order-item"
                  >
                    <span>{dish.name}</span> <span>x</span>{" "}
                    <span>{dish.OrderDish.quantity}</span>
                  </li>
                );
              })}
            </ul>
            <div className="order-amount">
              Total Paid Amount: {order.amount} (incl. {order.deliveryFee}{" "}
              delivery fee)
            </div>
          </div>

          <div className="cart-total">
            <button type="button" onClick={handleDownloadInvoice}>
              Download Invoice
            </button>

            <button type="button" onClick={() => navigate("/")}>
              Explore more
            </button>
          </div>
        </div>
      ) : (
        <div>Invalid Order</div>
      )}
    </div>
  );
};

export default Checkout;
