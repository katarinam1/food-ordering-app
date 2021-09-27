import { Fragment, useContext, useState } from 'react';
import CartContext from '../../store/cart-context';
// import UserContext from "../../store/user-context";
import RestContext from '../../store/rest-context';
import { loadStripe } from '@stripe/stripe-js';
import CartItem from './CartItem';
import classes from './CartModal.module.css';
import UserContext from '../../store/user-context';

const stripePromise = loadStripe(
  'pk_test_51J2xBPD0ioNmiL5bDgynj9QVqVrRQmkcQPoujaVCpzjam7gcr7KH6hENqcm43rg4RzlgsLQ6L2sNqcE76GOYxARi00r0Qy8U0l'
);

const CartModal = () => {
  const cartCtx = useContext(CartContext);
  const userCtx = useContext(UserContext);
  const restCtx = useContext(RestContext);

  const [isLoading, setIsLoading] = useState(false);

  const removeItemHandler = async (id) => {
    setIsLoading(true);
    await cartCtx.removeMeal(id);
    setIsLoading(false);
  };

  const updateItemHandler = async (id, amount) => {
    try {
      setIsLoading(true);
      await cartCtx.removeMeal(id);
      await cartCtx.addMeal(id, +amount);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleOrder = async (event) => {
    await cartCtx.launchOrder(
      stripePromise,
      restCtx.currentRestaurant.distance
    );
  };

  return (
    <Fragment>
      {isLoading && <div className={classes.loader} />}
      <div
        className={classes.popup}
        style={isLoading ? { opacity: '60%' } : {}}
      >
        <div className={classes.cart}>
          <p className={classes['main-title']}>Shopping Cart</p>
          <div className={classes.review}>
            <div className={classes.labels}>
              <div className={classes.item}>
                <span>Item</span>
              </div>
              <div className={classes.quantity}>
                <span>Quantity</span>
              </div>
              <div className={classes.price}>
                <span>Price</span>
              </div>
            </div>

            {cartCtx.meals.map((mealObj, i) => (
              <CartItem
                key={mealObj.meal._id}
                id={mealObj.meal._id}
                price={mealObj.meal.price}
                name={mealObj.meal.name}
                image={mealObj.meal.image}
                quantity={mealObj.quantity}
                onChange={updateItemHandler}
                specialOffer={mealObj.meal.specialOffer}
                onRemove={removeItemHandler}
              />
            ))}
            <div className={classes.subtotal}>
              <span className={classes.title}>Subtotal</span>
              <span className={classes.total}>${cartCtx.price}</span>
            </div>
            <div className={classes.order}>
              {!userCtx._id ? (
                <button
                  disabled
                  title="Please log in to order"
                  role="link"
                  onClick={handleOrder}
                  className={classes.disabledButton}
                >
                  order
                </button>
              ) : (
                <button
                  role="link"
                  onClick={handleOrder}
                  className={classes.myButton}
                >
                  order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default CartModal;
