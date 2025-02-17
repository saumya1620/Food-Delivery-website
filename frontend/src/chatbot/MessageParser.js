class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();

    if (
      lowerCaseMessage.includes("menu") ||
      lowerCaseMessage.includes("food")
    ) {
      this.actionProvider.showMenu();
    } else if (
      lowerCaseMessage.includes("track") ||
      lowerCaseMessage.includes("order")
    ) {
      this.actionProvider.trackOrder();
    } else if (
      lowerCaseMessage.includes("offer") ||
      lowerCaseMessage.includes("discount")
    ) {
      this.actionProvider.showOffers();
    } else if (lowerCaseMessage.includes("delivery")) {
      this.actionProvider.deliveryTime();
    } else if (
      lowerCaseMessage.includes("payment") ||
      lowerCaseMessage.includes("upi") ||
      lowerCaseMessage.includes("card")
    ) {
      this.actionProvider.paymentHelp();
    } else {
      this.actionProvider.defaultResponse();
    }
  }
}

export default MessageParser;
