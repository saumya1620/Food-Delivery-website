import React, { useContext } from "react";
import "./Fooddisplay.css";
// import { food_list } from '../../assets/assets'
import { Storecontext } from "../../context/Storecontext";
import Fooditem from "../fooditem/Fooditem";
import { getBaseApiUrl } from "../../misc";
const Fooddisplay = ({ category }) => {
  const { dishes } = useContext(Storecontext);
  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {(dishes.rows || []).map((item, index) => {
          if (category === "All" || category === item.categoryId) {
            return (
              <Fooditem
                key={index}
                id={item.id}
                name={item.name}
                description={item.description}
                price={item.price}
                image={`${getBaseApiUrl()}/${item.imageUrl}`}
              />
            );
          }
          // return  <Fooditem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image}/>
        })}
      </div>
    </div>
  );
};

export default Fooddisplay;
