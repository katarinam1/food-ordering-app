import classes from './UserOrders.module.css';
import OrderContext from './../../store/order-context';
import { Fragment, useContext, useState } from 'react';
import Refund from './Refund';

const UserOrders = (props) => {
  const orderCtx = useContext(OrderContext);
  const [showRefundModal, setShowRefundModal] = useState(false);
  // useEffect(()=>{
  //   const fetchOrders = async ()=>{
  //     orderCtx.getOrders();
  //   }
  //   fetchOrders();
  // },[])

  return (
    <div className={classes.container}>
      {showRefundModal && <Refund />}
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Order Date</th>
            <th>Delivery address</th>
            <th>Items</th>
            <th>Coupons</th>
            <th>Total</th>
            <th>Status</th>
            {/* <th>Action</th> */}
          </tr>
          {orderCtx.orders.map((order) => {
            return (
              <tr>
                <td>
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'full',
                    timeStyle: 'long',
                  }).format(new Date(order.createdAt))}
                </td>
                <td>{order.address}</td>
                <td>
                  {order.meals.map((mealObj) => {
                    return (
                      <Fragment>
                        <p
                          key={mealObj.meal._id}
                        >{`${mealObj.meal.name}, qt.${mealObj.quantity}`}</p>
                        <img
                          className={classes['item-img']}
                          src={`/meals/${mealObj.meal.image}`}
                          alt="food"
                        ></img>
                      </Fragment>
                    );
                  })}
                </td>
                <td>
                  {order.coupon
                    ? `"${order.coupon.code}" -${order.coupon.percentOff}%`
                    : 'none'}
                </td>
                {order.coupon ? (
                  <td>
                    {order.meals.map((mealObj, i) => {
                      return (
                        <Fragment>
                          <p
                            className={classes['total-price']}
                            key={mealObj.meal._id}
                          >{`${mealObj.quantity} x ${
                            mealObj.meal.specialOffer
                              ? mealObj.meal.specialOffer
                              : mealObj.meal.price
                          }$`}</p>
                          {i !== order.meals.length - 1 ? '+' : '---------'}
                        </Fragment>
                      );
                    })}
                    <p className={classes['total-price']}>
                      {order.price +
                        order.coupon.amountDiscount -
                        order.deliveryFee}
                      $
                    </p>
                    <p className={classes['total-price']}>+</p>
                    <p className={classes['total-price']}>
                      {order.deliveryFee}$ delivery
                    </p>
                    <p className={classes['total-price']}>---------</p>
                    <p className={classes['total-price']}>
                      {order.price + order.coupon.amountDiscount}$
                    </p>

                    <p className={classes['total-price']}>
                      -{order.coupon.amountDiscount}$<br></br>----------
                    </p>
                    <p>{order.price}$</p>
                  </td>
                ) : (
                  <td className={classes.total}>
                    {order.meals.map((mealObj, i) => {
                      return (
                        <Fragment>
                          <p
                            className={classes['total-price']}
                            key={mealObj.meal._id}
                          >{`${mealObj.quantity} x ${
                            mealObj.meal.specialOffer
                              ? mealObj.meal.specialOffer
                              : mealObj.meal.price
                          }$`}</p>
                          {i !== order.meals.length - 1 ? '+' : '---------'}
                        </Fragment>
                      );
                    })}
                    <p className={classes['total-price']}>
                      {order.price - order.deliveryFee}$
                    </p>
                    <p className={classes['total-price']}>+</p>
                    <p className={classes['total-price']}>
                      {order.deliveryFee}$ delivery
                    </p>
                    <p className={classes['total-price']}>---------</p>
                    <p className={classes['total-price']}>{order.price}$</p>
                  </td>
                )}
                <td>{order.status}</td>
                {/* <td onClick={(event) => refundOrderHandler(event, order._id)}>
                  {order.status !== 'paid' ? (
                    <button disabled={true} className={classes.button}>
                      Request refund
                    </button>
                  ) : (
                    <button className={classes.button}>Request refund</button>
                  )}
                </td> */}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default UserOrders;
