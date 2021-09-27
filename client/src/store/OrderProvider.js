import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import OrderContext from './order-context';
import UserContext from './user-context';

const OrderProvider = (props) => {
  const userCtx = useContext(UserContext);
  const [orderState, setOrderState] = useState({
    orders: [],
  });

  const [couponState, setCouponState] = useState({
    coupons: [],
  });

  useEffect(() => {
    if (userCtx._id) {
      fetchOrdersHandler();
      fetchCouponsHandler();
    }
  }, [userCtx]);

  const fetchOrdersHandler = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/orders/`,
      });
      const { orders } = response.data.data;
      setOrderState({ orders });
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const createOrderHandler = async (meals, price, address, user) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `/api/v1/orders/`,
        data: {
          meals,
          price,
          address,
          user,
        },
      });
      //fetchorders handler
      console.log(response, 'response');
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const updateOrderStatusHandler = async (id, status) => {
    try {
      const response = await axios({
        method: 'PATCH',
        url: `/api/v1/orders/${id}`,
        data: {
          status,
        },
      });
      fetchOrdersHandler();
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const createCouponHandler = async (
    name,
    discount,
    quantity,
    minimumPrice,
    expirationDate,
    restrict,
    description
  ) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `/api/v1/orders/create-coupon`,
        data: {
          name,
          discount,
          date: expirationDate || null,
          maxRedemptions: quantity || null,
          firstTime: restrict || null,
          description: description || null,
          minimumAmount: minimumPrice || null,
        },
      });

      console.log(response);
      return response;
    } catch (error) {
      console.log(error.response);
    }
  };

  const fetchCouponsHandler = async () => {
    try {
      const response = await axios({
        method: 'GET',
        url: `/api/v1/orders/fetch-coupons`,
      });

      setCouponState({ coupons: response.data.promotionCodes.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  const deleteCouponHandler = async (id) => {
    try {
      const response = await axios({
        method: 'DELETE',
        url: `/api/v1/orders/delete-coupon`,
        data: {
          coupon: id,
        },
      });
      fetchCouponsHandler();
      // setCouponState({ coupons: response.data.promotionCodes.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  const refundOrderHandler = async (id) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `/api/v1/orders/refund-order/${id}`,
      });
      fetchOrdersHandler();
      // setCouponState({ coupons: response.data.promotionCodes.data });
    } catch (error) {
      console.log(error.response);
    }
  };

  const orderContext = {
    orders: orderState.orders,
    coupons: couponState.coupons,
    deleteCoupon: deleteCouponHandler,
    getCoupons: fetchCouponsHandler,
    createCoupon: createCouponHandler,
    refundOrder: refundOrderHandler,
    updateOrderStatus: updateOrderStatusHandler,
    createOrder: createOrderHandler,
    getOrders: fetchOrdersHandler,
  };

  return (
    <OrderContext.Provider value={orderContext}>
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
