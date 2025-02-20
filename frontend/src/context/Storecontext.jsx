import { createContext, useState, useEffect } from "react";
import { food_list } from "../assets/assets";
import { getBaseApiUrl } from "../misc";
import axios from "axios";
// Create the context
export const Storecontext = createContext(null);

const Storecontextprovider = (props) => {
  const [dishes, setDishes] = useState([]);
  const fetchDishes = async () => {
    try {
      const response = await axios.get(getBaseApiUrl() + "/dishes");
      if (response.data.success) {
        setDishes(response.data.data);
      } else {
        // toast.error(response.data.message);
        console.log("Error while fetching dishes", response.data.message);
      }
    } catch (error) {
      console.error("API Fetch dishes Error:", error);
      // toast.error("Error fetching food categories.");
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

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

  const resetcart = () => {
    setcartitems({});
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartitems) {
      if (cartitems[item] > 0) {
        let itemInfo = dishes.rows.find(
          (product) => product.id === Number(item)
        );
        totalAmount += itemInfo.price * cartitems[item];
      }
    }
    return totalAmount;
  };

  const contextvalue = {
    dishes,
    cartitems,
    setcartitems,
    addtocart,
    removefromcart,
    resetcart,
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
