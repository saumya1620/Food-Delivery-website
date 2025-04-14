const CASHFREE_API_KEY = process.env.CASHFREE_API_KEY;
const CASHFREE_API_SECRET = process.env.CASHFREE_API_SECRET;
const CASHFREE_API_URL = process.env.CASHFREE_API_URL;
export async function createCashfreeOrder(request) {
  try {
    const CashfreeApi = await import("cashfree-pg");
    const { Cashfree } = CashfreeApi;
    var cashfree = new Cashfree(
      Cashfree.SANDBOX,
      "171580437fb8d1e5f4bf4074f2085171",
      "2d1883835fdfeb4e10096bae2e43073f52b46541"
    );
    console.log("Running create order", request);

    // const cfRequest = new Cashfree.PGCreateOrderRequest(request);

    const result = await cashfree.PGCreateOrder(request);
    console.log("Order created", result);
    return result;
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
