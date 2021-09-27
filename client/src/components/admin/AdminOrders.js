import classes from './AdminOrders.module.css';
import { Fragment, useContext } from 'react';
import OrderContext from '../../store/order-context';

const AdminOrders = () => {
  const orderCtx = useContext(OrderContext);

  const updateOrderHandler = async (event, id, status) => {
    const initialText = event.target.textContent;
    event.target.textContent = 'Updating...';
    await orderCtx.updateOrderStatus(id, status);
    event.target.textContent = 'Updated!';
    setTimeout(() => {
      event.target.textContent = initialText;
    }, 1000);
  };

  return (
    <Fragment>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Order Date</th>
            <th>Delivery Address</th>
            <th>Items</th>
            <th>Coupons</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
          {orderCtx.orders.map((order) => (
            <tr key={order._id}>
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
                    <p
                      key={mealObj.meal._id}
                    >{`${mealObj.meal.name}, qt.${mealObj.quantity}`}</p>
                  );
                })}
              </td>
              <td>
                {order.coupon ? (
                  <Fragment>
                    <p>code: "{order.coupon.code}"</p>
                    <p>discount: {order.coupon.percentOff}%</p>
                  </Fragment>
                ) : (
                  <p>none</p>
                )}
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
              <td
                onClick={(event) => {
                  if (event.target.textContent === 'Cancel')
                    updateOrderHandler(event, order._id, 'cancelled');
                  else updateOrderHandler(event, order._id, 'accepted');
                }}
              >
                <button
                  disabled={order.status === 'refunded'}
                  className={classes['button-table']}
                >
                  Cancel
                </button>
                <button
                  disabled={order.status === 'refunded'}
                  className={classes['button-table']}
                >
                  Accept
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default AdminOrders;
