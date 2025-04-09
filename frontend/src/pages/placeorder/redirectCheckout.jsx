import { load } from "@cashfreepayments/cashfree-js";
import { useEffect } from "react";

function RedirectCheckout({ sessionId }) {
  let cashfree;
  var initializeSDK = async function () {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  initializeSDK();

  const doPayment = async () => {
    let checkoutOptions = {
      paymentSessionId: sessionId,
      redirectTarget: "_self",
    };
    cashfree.checkout(checkoutOptions);
  };

  useEffect(() => {
    setTimeout(() => {
      doPayment();
    }, 100);
  }, [sessionId]);

  return null;
}

export default RedirectCheckout;
