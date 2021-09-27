import classes from './AdminCoupons.module.css';
import { Fragment, useContext, useState } from 'react';
import OrderContext from '../../store/order-context';
import AdminAddCoupon from './AdminAddCoupon';

const AdminCoupons = () => {
  const orderCtx = useContext(OrderContext);

  const [showAddForm, setShowAddForm] = useState(false);

  const deleteCouponHandler = async (id) => {
    await orderCtx.deleteCoupon(id);
  };

  return (
    <Fragment>
      <button
        className={classes.button}
        onClick={() => {
          setShowAddForm((prevValue) => {
            return !prevValue;
          });
        }}
      >
        {showAddForm ? 'Hide form' : 'Add a coupon'}
      </button>
      {showAddForm && <AdminAddCoupon />}
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Coupon Name</th>
            <th>Discount</th>
            <th>Description</th>
            <th>First time order</th>
            <th>Quantity</th>
            <th>Minimum price amount</th>
            <th>Expiration Date</th>
            <th>Number of times used</th>
            <th>Action</th>
          </tr>
          {orderCtx.coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.coupon.percent_off} %</td>
              <td>{coupon.metadata.description}</td>
              <td>{coupon.restrictions.first_time_transaction.toString()}</td>
              <td>
                {coupon.coupon.max_redemptions
                  ? coupon.coupon.max_redemptions
                  : 'no limit'}
              </td>
              <td>{coupon.restrictions.minimum_amount / 100}$</td>
              <td>
                {coupon.expires_at
                  ? new Date(coupon.expires_at * 1000).toLocaleDateString()
                  : 'none'}
              </td>
              <td>{coupon.times_redeemed}</td>
              <td
                onClick={() => {
                  deleteCouponHandler(coupon.coupon.id);
                }}
              >
                <button className={classes['button-table']}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Fragment>
  );
};

export default AdminCoupons;
