import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Exploremenu.css";
// import { menu_list } from "../../assets/assets";
import { getBaseApiUrl } from "../../misc";
const Exploremenu = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);
  const fetchCategories = async () => {
    try {
      const response = await axios.get(getBaseApiUrl() + "/food-categories");
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("API Fetch Error:", error);
      toast.error("Error fetching food categories.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise. Our misson
        is to satisfy your cravings and elevate your dining expertise, one
        delicious meal at a time.
      </p>
      <div className="explore-menu-list">
        {categories.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.name ? "All" : item.name))
              }
              key={index}
              className="explore-menu-list-item"
            >
              <img
                className={category === item.name ? "active" : ""}
                src={`${getBaseApiUrl()}/${item.imagePath}`}
                alt=""
              />
              <p>{item.name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default Exploremenu;
