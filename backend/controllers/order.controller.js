const {
  USER_MESSAGES,
  PAYMENT_STATUSES,
  FRONTEND_URL,
} = require("../constants/user.messages");
const { createCashfreeOrder } = require("../lib/cashfree");
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
    const order = await db.Order.create({
      userId,
      amount,
      address,
      status: status || undefined,
      deliveryFee: deliveryFee || 0,
      discount: discount || 0,
      paymentStatus: PAYMENT_STATUSES.None,
    });

    for (let item of items) {
      await db.OrderDish.create({
        orderId: order.id,
        dishId: item.dishId,
        quantity: item.quantity,
      });
    }
    const orderWithItems = await db.Order.findByPk(order.id, {
      include: {
        model: db.Dish,
        through: db.OrderDish,
        attributes: ["name", "price", "description"],
      },
    });

    // create cashfree order
    var cfRequest = {
      order_amount: orderWithItems.amount,
      order_currency: "INR",
      order_id: "tomato_" + orderWithItems.uuid,
      customer_details: {
        customer_id: "tomato_" + orderWithItems.userId,
        customer_phone: orderWithItems.address.phone,
        customer_name: `${orderWithItems.address.firstName} ${orderWithItems.address.lastName}`,
        customer_email: orderWithItems.address.email,
      },
      order_meta: {
        return_url: FRONTEND_URL + "/checkout?order_id={order_id}",
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
    await createCashfreeOrder(cfRequest)
      .then((result) => {
        res.status(200).json({
          success: true,
          message: USER_MESSAGES.orderCreated,
          data: { order: orderWithItems, cashifyOrder: result },
        });
      })
      .catch((err) => {
        res.status(200).json({
          success: false,
          message: err,
          errors: null,
        });
      });
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
}

module.exports = OrderController;
