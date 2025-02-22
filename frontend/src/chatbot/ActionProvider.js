class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  trackOrder = () => {
    const message = this.createChatBotMessage(
      "🚚 Please enter your order ID to track your delivery."
    );
    this.addMessageToState(message);
  };

  showOffers = () => {
    const message = this.createChatBotMessage(
      `🎉 Current Offers:
      - 20% off on orders above ₹500
      - Buy 1 Get 1 Free on Pizzas 🍕
      - Free Dessert with any main course order 🍰`
    );
    this.addMessageToState(message);
  };

  deliveryTime = () => {
    const message = this.createChatBotMessage(
      "⏳ Our average delivery time is <strong>30-45 minutes</strong>. It may vary depending on your location and order size."
    );
    this.addMessageToState(message);
  };

  paymentHelp = () => {
    const message = this.createChatBotMessage(
      `💳 Payment Methods:<br/><br/>
      - UPI (Google Pay, Paytm, PhonePe)<br/>
      - Credit/Debit Cards<br/>
      - Cash on Delivery (COD)<br/><br/>
      If you're facing issues, please contact our support.`
    );
    this.addMessageToState(message);
  };

  defaultResponse = () => {
    const message = this.createChatBotMessage(
      "🤔 I'm not sure I understand. Can you please ask in a different way?"
    );
    this.addMessageToState(message);
  };

  addMessageToState = (message) => {
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, message],
    }));
  };
}

export default ActionProvider;
