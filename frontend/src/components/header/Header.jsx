import React from "react";
import "./header.css";
const Header = () => {
  return (
    <div>
      <div className="header">
        <div className="header-contents">
          <h2>Order your favoraite food here</h2>
          <p>
            Choose from a diverse menu featuring a delectable array of dishes
            crafted with the finest ingredients and culinary expertise. Our
            misson is to satisfy your cravings and elevate your dining
            expertise, one delicious meal at a time.
          </p>

          <button id="explore-menu">View Menu</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
