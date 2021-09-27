import { useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
// import UserContext from "../../store/user-context";
import classes from './MealModal.module.css';

const MealModal = (props) => {
  const cartCtx = useContext(CartContext);
  // const userCtx = useContext(UserContext);
  const [amount, setAmount] = useState(1);
  const [buttonText, setButtonText] = useState('Add to Cart');
  const [totalPrice, setTotalPrice] = useState(
    props.meal.specialOffer > 0 ? props.meal.specialOffer : props.meal.price
  );

  const incHandler = () => {
    setAmount((amountBefore) => {
      let value = +amountBefore;
      if (value < 10) value++;

      const price = props.meal.specialOffer
        ? props.meal.specialOffer
        : props.meal.price;

      setTotalPrice(price * value);

      return value;
    });
  };

  const decHandler = () => {
    setAmount((amountBefore) => {
      let value = +amountBefore;
      if (value > 1) value--;

      const price = props.meal.specialOffer
        ? props.meal.specialOffer
        : props.meal.price;

      setTotalPrice(price * value);
      return value;
    });
  };

  const addToCartHandler = async () => {
    try {
      const mealId = props.meal._id;
      const quantity = amount;
      setButtonText('Adding...');
      await cartCtx.addMeal(mealId, quantity);
      setButtonText('Added!');
      setTimeout(() => {
        props.onClose();
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div id="modal" className={classes.modal}>
      <div className={classes.content}>
        <div className={classes.left}>
          <img
            src={`/meals/${props.meal.image}`}
            alt="meal"
            className={classes.img}
          />
        </div>
        <div className={classes.right}>
          <span
            onClick={() => {
              props.onClose();
            }}
            className={classes.close}
          >
            &times;
          </span>
          <p className={classes.title}>{props.meal.name}</p>
          <p className={classes.description}>{props.meal.description}</p>
          <p className={classes.ingtitle}>ingredients:</p>
          <p className={classes.ingredients}>
            {props.meal.ingredients.toString().split(',').join(', ')}
          </p>
          {props.meal.specialOffer > 0 && (
            <p className={classes['price-old']}>
              <p className={classes.strikeout}>{props.meal.price}$</p>
            </p>
          )}
          <p className={classes.price}>{totalPrice}$</p>
          <div className={classes.amount}>
            <div className={classes.group}>
              <button onClick={decHandler} className={classes.button}>
                <i className="fa fa-minus" aria-hidden="true"></i>
              </button>
              <div className={classes.input}>{amount}</div>
              <button onClick={incHandler} className={classes.button}>
                <i className="fa fa-plus" aria-hidden="true"></i>
              </button>
            </div>{' '}
          </div>{' '}
          <button onClick={addToCartHandler} className={classes.add}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MealModal;
