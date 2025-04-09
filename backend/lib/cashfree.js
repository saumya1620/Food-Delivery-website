export async function createCashfreeOrder(request) {
  const Cashfree = await import("cashfree-pg");

  Cashfree.XClientId = "171580437fb8d1e5f4bf4074f2085171";
  Cashfree.XClientSecret = "2d1883835fdfeb4e10096bae2e43073f52b46541";
  Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

  console.log("Hello ", Cashfree);
  return new Promise((resolve, reject) => {
    console.log("Running create order", request);
    Cashfree.PGCreateOrder("2025-01-01", request)
      .then((response) => {
        console.log("Order created successfully:", response.data);
        resolve(response.data);
      })
      .catch((error) => {
        console.error("Error:", error.response.data.message);
        // cb(error.response.data.message, null);
        reject(error.response.data.message);
      });
  });
}

// var request = {
//     "order_amount": 1.00,
//     "order_currency": "INR",
//     "order_id": "devstudio_7315748700009226229",
//     "customer_details": {
//         "customer_id": "devstudio_user",
//         "customer_phone": "8474090589"
//     },
//     "order_meta": {
//         "return_url": "https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}"
//     }
// };
