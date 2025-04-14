const {
  USER_MESSAGES,
  PAYMENT_STATUSES,
  FRONTEND_URL,
} = require("../constants/user.messages");
const {
  createCashfreeOrder,
  getCashfreeOrderPayments,
} = require("../lib/cashfree");
const db = require("../models");

class OrderController {
  static async fetchAll(req, res) {
    const { offset, limit } = req.query;
    const { userId, role } = req.user;
    const whereCond = role !== "admin" ? { where: { userId: userId } } : {};
    const orders = await db.Order.findAndCountAll({
      offset: offset || 0,
      limit: limit || 100,
      include: {
        model: db.Dish,
        through: db.OrderDish,
        attributes: ["name", "price"],
      },
      ...whereCond,
    });

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.fetchAllOrders,
      data: orders,
    });
  }

  static async create(req, res) {
    const { items, amount, address, status, deliveryFee, discount } = req.body;
    const { userId } = req.user;

    const transaction = await db.sequelize.transaction();
    try {
      const order = await db.Order.create(
        {
          userId,
          amount,
          address,
          status: status || undefined,
          deliveryFee: deliveryFee || 0,
          discount: discount || 0,
          paymentStatus: PAYMENT_STATUSES.None,
        },
        { transaction }
      );

      for (let item of items) {
        await db.OrderDish.create(
          {
            orderId: order.id,
            dishId: item.dishId,
            quantity: item.quantity,
          },
          { transaction }
        );
      }
      const orderWithItems = await db.Order.findByPk(order.id, {
        include: {
          model: db.Dish,
          through: db.OrderDish,
          attributes: ["name", "price", "description"],
        },
        transaction,
      });

      // create cashfree order
      var cfRequest = {
        order_amount: orderWithItems.amount,
        order_currency: "INR",
        order_id: "tomato_" + orderWithItems.uuid,
        customer_details: {
          customer_id: "tomato" + orderWithItems.userId,
          customer_phone: orderWithItems.address.phone,
          customer_name: `${orderWithItems.address.firstName} ${orderWithItems.address.lastName}`,
          customer_email: orderWithItems.address.email,
        },
        order_meta: {
          return_url: FRONTEND_URL + "/checkout?order_id={order_id}",
          // notify_url: BACKEND_URL + "/orders/cashfree-webhook", //TODO: enable it when deployed to server because it required https url
        },
        cart_details: {
          cart_items: orderWithItems.Dishes.map((item) => ({
            item_id: "tomato_" + item.id,
            item_name: item.name,
            item_description: item.description,
            item_image_url: `${FRONTEND_URL}/public/dishes/${item.id}.jpeg`,
            item_original_unit_price: item.price,
            item_discounted_unit_price: 0.0,
            item_quantity: item.OrderDish.quantity,
            item_currency: "INR",
          })),
        },
      };

      const result = await createCashfreeOrder(cfRequest);
      console.log("result cashfree", result);
      await transaction.commit();
      res.status(200).json({
        success: true,
        message: USER_MESSAGES.orderCreated,
        data: { order: orderWithItems, cashifyOrder: result },
      });
    } catch (err) {
      await transaction.rollback();
      res.status(500).json({
        success: false,
        message: err,
        errors: null,
      });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    const { items, amount, address, status, payment } = req.body;

    const order = await db.Order.findByPk(id);
    if (!order || (order && order.userId !== userId)) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.orderDoesntExist,
        errors: null,
      });
    }

    order.userId = userId;
    order.items = items;
    order.amount = amount;
    order.address = address;
    order.status = status;
    order.payment = payment;
    await order.save();

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.orderUpdated,
      data: order,
    });
  }

  static async partialUpdate(req, res) {
    const { fieldName, fieldValue } = req.body;
    return await this.updateOrder(req, res, fieldName, fieldValue);
  }

  static async delete(req, res) {
    const { id } = req.params;
    const { userId } = req.user;
    const order = await db.Order.findByPk(id);
    if (!order || (order && order.userId !== userId)) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.orderDoesntExist,
        errors: null,
      });
    }

    await order.destroy();

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.orderDeleted,
      data: order,
    });
  }

  static async getOrderById(req, res) {
    const { id } = req.params;
    const { id: userId } = req.user;
    const order = await db.Order.findByPk(id);

    if (!order || (order && order.userId !== userId)) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.orderDoesntExist,
        errors: null,
      });
    }

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.orderDisplayed,
      data: order,
    });
  }
  static async updateOrder(req, res, fieldName, fieldValue) {
    const { id } = req.params;
    const { userId, role } = req.user;
    const order = await db.Order.findByPk(id, {
      include: {
        model: db.Dish,
        through: db.OrderDish,
        attributes: ["name", "price"],
      },
    });
    if (!order || (role !== "admin" && order && order.userId !== userId)) {
      return res.status(500).json({
        success: false,
        message: USER_MESSAGES.orderDoesntExist,
        errors: null,
      });
    }

    order[fieldName] = fieldValue;
    await order.save();

    res.status(200).json({
      success: true,
      message: USER_MESSAGES.orderUpdated,
      data: order,
    });
  }
  static async updateStatus(req, res) {
    const { status } = req.body;
    return await OrderController.updateOrder(req, res, "status", status);
  }
  static async cashfreeWebhook(req, res) {
    try {
      const cashfree = req.cashfree;
      let paymentStatus = PAYMENT_STATUSES.Pending;
      const orderId = cashfree.order.order_id.replace("tomato_", "");
      if (cashfree.data.payment.payment_status === "SUCCESS") {
        paymentStatus = PAYMENT_STATUSES.Success;
      } else if (cashfree.data.payment.payment_status === "FAILED") {
        paymentStatus = PAYMENT_STATUSES.Failure;
      }
      const order = await db.Order.findOne({ where: { uuid: orderId } });
      order.paymentStatus = paymentStatus;
      await order.save();
      res.status(200).json({
        success: true,
        message: USER_MESSAGES.orderUpdated,
        data: order,
      });
    } catch (err) {
      console.log("cashfree webhook failed", err);
      return res.status(500).json({
        success: false,
        message: "Invalid Order or Cashfree Webhook",
        errors: null,
      });
    }
  }
  static async validateCheckout(req, res) {
    const { orderId } = req.body;
    try {
      const uuid = orderId.replace("tomato_", "");
      const order = await db.Order.findOne({
        where: { uuid: uuid },
        include: {
          model: db.Dish,
          through: db.OrderDish,
          attributes: ["name", "price"],
        },
      });
      if (!order) {
        return res.status(500).json({
          success: false,
          message: USER_MESSAGES.orderDoesntExist,
          errors: null,
        });
      }
      // fetch order payment status if status not updated yet
      if (order.paymentStatus === PAYMENT_STATUSES.None) {
        const payments = await getCashfreeOrderPayments(orderId);
        if (payments.length) {
          let paymentStatus = PAYMENT_STATUSES.Pending;
          if (
            payments.filter((payment) => payment.payment_status === "SUCCESS")
              .length
          ) {
            paymentStatus = PAYMENT_STATUSES.Success;
          } else if (
            payments.filter((payment) => payment.payment_status === "FAILED")
              .length
          ) {
            paymentStatus = PAYMENT_STATUSES.Failure;
          }
          order.paymentStatus = paymentStatus;
          await order.save();
        }
      }
      res.status(200).json({
        success: true,
        message: "Order validated",
        data: order,
      });
    } catch (err) {
      console.log("Validate Order error", err);
      return res.status(500).json({
        success: false,
        message: "Invalid Order Or Order Expired",
        errors: null,
      });
    }
  }
}

module.exports = OrderController;
