import { useParams } from "react-router-dom";

const Checkout = () => {
  const params = useParams();

  return (
    <div>Checkout page after success payment {params.order_id || "--"}</div>
  );
};

export default Checkout;
