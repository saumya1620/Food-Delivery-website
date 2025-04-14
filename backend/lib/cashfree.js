const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY;
const CASHFREE_API_SECRET = process.env.CASHFREE_API_SECRET;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;
export async function createCashfreeOrder(request) {
  try {
    const options = {
      method: "POST",
      headers: {
        "x-api-version": "2025-01-01",
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_API_SECRET,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    };

    const response = await fetch(CASHFREE_API_URL + "/orders", options);
    const json = await response.json();
    console.log("Order created", json);
    return json;
  } catch (err) {
    console.log("Error while creating order in cashfree", err);
    throw new Error(err);
  }
}

export async function getCashfreeOrderPayments(orderId) {
  try {
    const options = {
      method: "GET",
      headers: {
        "x-api-version": "2025-01-01",
        "x-client-id": CASHFREE_API_KEY,
        "x-client-secret": CASHFREE_API_SECRET,
        "Content-Type": "application/json",
      },
    };

    const response = await fetch(
      CASHFREE_API_URL + `/orders/${orderId}/payments`,
      options
    );
    const json = await response.json();
    console.log("Order payment details", json);
    return json;
  } catch (err) {
    console.log("Error while fetching order payments in cashfree", err);
    throw new Error(err);
  }
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
