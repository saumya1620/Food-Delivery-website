import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import { getAuthToken, getBaseApiUrl } from "../../misc";

const List = ({ url }) => {
  const [list, setList] = useState({ count: 0, rows: [] });

  const fetchList = async () => {
    try {
      const response = await axios.get(getBaseApiUrl() + "/dishes");
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Fetch List Error:", error);
      toast.error("Error fetching food list.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.delete(
        getBaseApiUrl() + `/dishes/${foodId}`,
        {
          headers: { Authorization: `Bearer ${getAuthToken()}` },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Fetch list only if the removal is successful
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Remove Food Error:", error);
      toast.error("Error removing item.");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <div className="list add flex-col">
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Type</b>
          <b>Action</b>
        </div>
        {list.count === 0 ? (
          <p>No food items available.</p>
        ) : (
          list.rows.map((item, index) => (
            <div key={index} className="list-table-format">
              <img
                src={`${getBaseApiUrl()}/${item.imageUrl}`}
                alt={item.name}
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p>${item.type}</p>
              <p onClick={() => removeFood(item.id)} className="cursor">
                X
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
