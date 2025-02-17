import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "FoodBot",
  initialMessages: [
    createChatBotMessage(
      `Hi there! I'm FoodBot 🤖. How can I assist you today?`,
      {
        widget: "options",
      }
    ),
  ],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#F28C28", 
    },
    chatButton: {
      backgroundColor: "#F28C28", 
    },
  },
  widgets: [
    {
      widgetName: "options",
      widgetFunc: (props) => {
        const options = [
          {
            text: "🚚 Track Order",
            handler: props.actionProvider.trackOrder,
            id: 2,
          },
          {
            text: "🎁 Offers & Discounts",
            handler: props.actionProvider.showOffers,
            id: 3,
          },
          {
            text: "⏳ Delivery Time",
            handler: props.actionProvider.deliveryTime,
            id: 4,
          },
          {
            text: "💳 Payment Issues",
            handler: props.actionProvider.paymentHelp,
            id: 5,
          },
        ];
        return (
          <div>
            {options.map((option) => (
              <button
                key={option.id}
                onClick={option.handler}
                style={{
                  margin: "5px",
                  padding: "10px",
                  background: "#f8b400",
                  color: "#fff",
                  borderRadius: "5px",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {option.text}
              </button>
            ))}
          </div>
        );
      },
    },
  ],
};

export default config;
