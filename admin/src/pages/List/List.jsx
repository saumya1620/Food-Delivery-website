// import React, { useEffect, useState } from 'react'
// import './List.css'
// import axios from "axios";
// import { toast } from 'react-toastify';

// const List = ({url}) => {
//   const [list,setList] = useState([]);

//   const fetchList = async ()=>{
//     const response = await axios.get(`${url}/api/food/list`);
//     if(response.data.success){
//       setList(response.data.data);
//     }
//     else{
//       toast.error("Error")
//     }
//   }

//   const removeFood =async(foodId)=>{
//     const response = await axios.post(`${url}/api/fodd/remove`,{id:foodId});
//     await fetchList();
//     if(response.data.success){
//       toast.success(response.data.message)
//     }
//     else{
//       toast.error("Error")
//     }
//   }


//   useEffect(()=>{
//     fetchList();
//   },[])

//   return (
//     <div className='list add flex-col'>
//       <p>All Food List</p>
//       <div className='list-table'>
//         <div className="list-table-format title">
//           <b>Image</b>
//           <b>Name</b>
//           <b>Category</b>
//           <b>Price</b>
//           <b>Action</b>
//         </div>
//         {list.map((item,index)=>{
//           return (
//             <div key={index} className='list-table-format'>
//               <img src={`${url}/images/`+item.image} alt="" />
//               <p>{item.name}</p>
//               <p>{item.category}</p>
//               <p>${item.price}</p>
//               <p onClick={()=>removeFood(item._id)}className='cursor'>X</p>
              
//             </div>
//           )

//         })}
//       </div>
        

//     </div>
//   )
// }

// export default List


import React, { useEffect, useState } from 'react';
import './List.css';
import axios from "axios";
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Failed to fetch food list.");
      }
    } catch (error) {
      console.error("Fetch List Error:", error);
      toast.error("Error fetching food list.");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId }); // Fixed typo
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // Fetch list only if the removal is successful
      } else {
        toast.error("Failed to remove item.");
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
    <div className='list add flex-col'>
      <p>All Food List</p>
      <div className='list-table'>
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length === 0 ? (
          <p>No food items available.</p>
        ) : (
          list.map((item, index) => (
            <div key={index} className='list-table-format'>
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <p onClick={() => removeFood(item._id)} className='cursor'>X</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default List;
