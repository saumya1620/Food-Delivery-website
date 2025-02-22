import React, { useContext, useReducer, useState } from "react";
import "./placeorder.css";
import { Storecontext } from "../../context/Storecontext";
import { getAuthToken, getBaseApiUrl } from "../../misc";
import { toast } from "react-toastify";
import axios from "axios";

function FormValuesReducer(state, action) {
  switch (action.type) {
    case "change":
      return {
        ...state,
        [action.payload.fieldName]: action.payload.fieldValue,
      };
    case "reset":
      return { ...action.payload };
    default:
      return state;
  }
}
const initialFormValues = {
  firstName: "Saumya",
  lastName: "Jain",
  email: "saumya@gmail.com",
  street: "nehru",
  city: "chandigarh",
  state: "chandigarh",
  zipcode: "123456",
  country: "India",
  phone: "+91 1234567890",
};

const placeorder = ({ setShowLogin, isSignIn }) => {
  const { cartitems, getTotalCartAmount, resetcart } = useContext(Storecontext);
  const [loading, setLoading] = useState(false);
  const [formValues, dispatch] = useReducer(FormValuesReducer, {
    ...initialFormValues,
  });

  const onChangeField = (name, value) => {
    dispatch({
      type: "change",
      payload: { fieldName: name, fieldValue: value },
    });
  };

  const handleProceedPayment = async () => {
    if (!isSignIn) {
      setShowLogin(true);
    }
    setLoading(true);
    try {
      const result = await axios.post(
        getBaseApiUrl() + "/orders",
        {
          items: Object.keys(cartitems).map((key) => ({
            dishId: Number(key),
            quantity: cartitems[key],
          })),

          deliveryFee: 2,
          amount: getTotalCartAmount() + 2,
          address: { ...formValues },
          payment: true,
        },
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );
      console.log("Order placed: ", result);
      const resp = result.data || {};
      if (resp.success) {
        toast.success(resp.message);
        dispatch({ type: "reset", payload: { ...initialFormValues } });
        resetcart();
        window.location.href = "/Myorders";
      } else {
        toast.error(resp.message);
      }
    } catch (e) {
      console.log("Login failed", e);
      toast.error("Order failed!");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form action="" className="place-order">
        <div className="place-order-left">
          <p className="title">Delivery Information</p>
          <div className="multifields">
            <input
              type="text"
              placeholder="First Name"
              value={formValues["firstName"]}
              onChange={(evt) => onChangeField("firstName", evt.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={formValues["lastName"]}
              onChange={(evt) => onChangeField("lastName", evt.target.value)}
            />
          </div>
          <input
            type="email"
            placeholder="Email adress"
            value={formValues["email"]}
            onChange={(evt) => onChangeField("email", evt.target.value)}
          />
          <input
            type="text"
            placeholder="Street"
            value={formValues["street"]}
            onChange={(evt) => onChangeField("street", evt.target.value)}
          />
          <div className="multifields">
            <input
              type="text"
              placeholder="City"
              value={formValues["city"]}
              onChange={(evt) => onChangeField("city", evt.target.value)}
            />
            <input
              type="text"
              placeholder="State"
              value={formValues["state"]}
              onChange={(evt) => onChangeField("state", evt.target.value)}
            />
          </div>
          <div className="multifields">
            <input
              type="text"
              placeholder="Zip code"
              value={formValues["zipcode"]}
              onChange={(evt) => onChangeField("zipcode", evt.target.value)}
            />
            <input
              type="text"
              placeholder="Country"
              value={formValues["country"]}
              onChange={(evt) => onChangeField("country", evt.target.value)}
            />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={formValues["phone"]}
            onChange={(evt) => onChangeField("phone", evt.target.value)}
          />
        </div>
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />

              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />

              <div className="cart-total-details">
                <b>Total</b>
                <b>
                  ${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}
                </b>
              </div>
            </div>
            <button type="button" onClick={handleProceedPayment}>
              {loading ? "Please wait..." : "PROCEED TO PAYMENT"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default placeorder;
