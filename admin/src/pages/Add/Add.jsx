import React, { useState } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { getAuthToken, getBaseApiUrl } from "../../misc";
import { useReducer } from "react";

function formReducer(state, action) {
  switch (action.type) {
    case "name":
    case "description":
    case "price":
    case "category":
    case "type":
      return { ...state, [action.type]: action.payload };
    case "reset":
      return {
        name: "",
        description: "",
        price: "",
        category: "",
        type: "",
      };
    default:
      return state;
  }
}

const Add = ({}) => {
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [data, dispatch] = useReducer(formReducer, {
    name: "",
    description: "",
    price: "",
    category: "",
    type: "",
  });

  useEffect(() => {
    axios
      .get(getBaseApiUrl() + "/food-categories")
      .then(function (result) {
        if (result.data.success) {
          setCategories(result.data.data);
        } else {
          setCategories([]);
        }
      })
      .catch(function (ex) {
        console.log("Error while fetching food categories", ex);
      });
  }, []);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    dispatch({ type: name, payload: value });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!image) {
      toast.error("Please upload an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("categoryId", data.category);
      formData.append("type", data.type);
      formData.append("dishImage", image);

      const response = await axios.post(getBaseApiUrl() + "/dishes", formData, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      });
      if (response.data.success) {
        dispatch({ type: "reset" });
        setImage(null);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Add Food Error:", error);
      toast.error("Error adding food item.");
    }
  };

  return (
    <div className="add">
      <form className="flex-col" onSubmit={onSubmitHandler}>
        <div className="add-img-upload flex-col">
          <p>Upload Image</p>
          <label htmlFor="image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_area}
              alt="Upload Preview"
            />
          </label>
          <input
            type="file"
            id="image"
            hidden
            required
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="add-product-name flex-col">
          <p>Product Name</p>
          <input
            type="text"
            name="name"
            placeholder="Type"
            required
            value={data.name}
            onChange={onChangeHandler}
          />
        </div>

        <div className="add-product-description flex-col">
          <p>Product Description</p>
          <textarea
            name="description"
            rows="6"
            placeholder="Write Content Here"
            required
            value={data.description}
            onChange={onChangeHandler}
          />
        </div>

        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Product Category</p>
            <select
              name="category"
              value={data.category}
              required
              onChange={onChangeHandler}
            >
              <option value="">--select--</option>
              {categories.map((category) => (
                <option key={`f-cat-${category.id}`} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="add-price flex-col">
            <p>Product Price</p>
            <input
              type="number"
              name="price"
              placeholder="$20"
              required
              value={data.price}
              onChange={onChangeHandler}
            />
          </div>
          <div className="add-price flex-col">
            <p>Dish Type</p>
            <select
              name="type"
              value={data.type}
              required
              onChange={onChangeHandler}
            >
              <option value="">--select--</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>
          </div>
        </div>

        <button type="submit" className="add-btn">
          ADD
        </button>
      </form>
    </div>
  );
};

export default Add;
