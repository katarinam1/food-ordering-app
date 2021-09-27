import React from "react";

const OrderContext = React.createContext({
  orders: [],
  coupons: [],
  createCoupon: async (
    name,
    discount,
    quantity,
    minimumPrice,
    expirationDate,
    restrict,
    description
  ) => {},
  deleteCoupon: async (id) => {},
  refundOrder: async (id) => {},
  getCoupons: async () => {},
  // cancelOrder: async (id) => {},
  updateOrderStatus: async (id, status) => {},
  getOrders: async () => {},
  createOrder: async (meals, price, address, user) => {},
}); //fill up context with default data, will not be used, only for auto completion

export default OrderContext;
