import classes from './CartItem.module.css';
import { useRef } from 'react';
const CartItem = (props) => {
  const quantity = useRef();
  return (
    <div className={classes.main}>
      <div className={classes.remove}>
        <span
          onClick={() => {
            props.onRemove(props.id);
          }}
        >
          &times;
        </span>
      </div>
      <div className={classes['item-img']}>
        <img src={`/meals/${props.image}`} alt="food" className={classes.img} />
      </div>
      <div className={classes['item-name']}>
        <span>{props.name}</span>
      </div>
      <div className={classes['item-quantity']}>
        <input
          ref={quantity}
          type="text"
          onChange={() => {
            props.onChange(props.id, quantity.current.value);
          }}
          className={classes.input}
          placeholder={props.quantity}
          maxLength="1"
        />
      </div>
      <div className={classes['item-price']}>
        {props.specialOffer ? (
          <p>${props.specialOffer * props.quantity}</p>
        ) : (
          <p>${props.price * props.quantity}</p>
        )}
      </div>
    </div>
  );
};

export default CartItem;
