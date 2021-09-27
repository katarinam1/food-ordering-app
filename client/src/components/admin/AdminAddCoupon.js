import classes from './AdminAddCoupon.module.css';
import { Fragment, useContext, useRef } from 'react';
import OrderContext from '../../store/order-context';

const AdminAddCoupon = () => {
  const orderCtx = useContext(OrderContext);
  const couponName = useRef('');
  const discount = useRef();
  const quantity = useRef();
  const date = useRef();
  const restricted = useRef();
  const description = useRef();
  const minimumPrice = useRef();

  const postCouponHandler = async (event) => {
    event.preventDefault();

    const dateTimeStamp = new Date(date.current.value).getTime();

    await orderCtx.createCoupon(
      couponName.current.value,
      +discount.current.value,
      +quantity.current.value,
      minimumPrice.current.value * 100,
      dateTimeStamp / 1000,
      restricted.current.checked,
      description.current.value
    );
  };

  return (
    <Fragment>
      <div className={classes.form}>
        <form action="/action_page.php">
          <label className={classes.label} htmlFor="fname">
            Coupon Name (no spaces and special characters)
          </label>
          <input
            ref={couponName}
            className={classes.input}
            type="text"
            id="fname"
          />

          <label className={classes.label} htmlFor="discount">
            Discount (number)
          </label>
          <input
            ref={discount}
            className={classes.input}
            type="text"
            id="discount"
          />

          <label className={classes.label} htmlFor="count">
            Coupon Quantity (optional)
          </label>
          <input
            ref={quantity}
            className={classes.input}
            type="text"
            id="count"
          />

          <label className={classes.label} htmlFor="count">
            Minimum Order Price (optional)
          </label>
          <input
            ref={minimumPrice}
            className={classes.input}
            type="text"
            id="count"
          />

          <label className={classes.label} htmlFor="expire">
            Expiration date: (optional)
          </label>
          <input ref={date} className={classes.input} type="date" id="expire" />

          <label className={classes.label} htmlFor="restrict">
            Restrict to first time order only:
          </label>
          <input
            ref={restricted}
            type="checkbox"
            id="restrict"
            name="restrict"
          />

          <label className={classes.label} htmlFor="description">
            Description: (optional)
          </label>
          <textarea
            ref={description}
            id="description"
            className={classes.textarea}
          ></textarea>

          <input
            onClick={postCouponHandler}
            type="submit"
            value="Submit"
            className={classes.input}
          />
        </form>
      </div>
    </Fragment>
  );
};

export default AdminAddCoupon;
