import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";

// Create the context
export const Storecontext = createContext(null);

const Storecontextprovider = (props) => {
  const [cartitems, setcartitems] = useState({});
  const addtocart = (itemId) => {
    if (!cartitems[itemId]) {
      setcartitems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setcartitems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }
  };
  const removefromcart = (itemId) => {
    setcartitems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartitems) {
      if (cartitems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        totalAmount += itemInfo.price * cartitems[item];
      }
    }
    return totalAmount;
  };

  const contextvalue = {
    food_list,
    cartitems,
    setcartitems,
    addtocart,
    removefromcart,
    getTotalCartAmount,
  };

  // Return the context provider and render children inside it
  return (
    <Storecontext.Provider value={contextvalue}>
      {props.children}
    </Storecontext.Provider>
  );
};

export default Storecontextprovider;
