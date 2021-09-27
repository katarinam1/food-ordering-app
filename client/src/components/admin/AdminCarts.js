import classes from './AdminCarts.module.css';
import CartContext from './../../store/cart-context';
import { useContext, useEffect, useState, Fragment } from 'react';
import { useHistory } from 'react-router-dom';
const AdminCarts = () => {
  const cartCtx = useContext(CartContext);
  const [carts, setCarts] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const fetchCarts = async () => {
      const carts = await cartCtx.getCarts();
      setCarts(carts);
    };
    fetchCarts();
  }, []);

  const deleteCartHandler = async (id) => {
    await cartCtx.deleteCart(id);
    history.go(0);
  };

  const deleteCompletedHandler = async () => {
    await cartCtx.deleteCompleted();
    history.go(0);
  };

  const deleteAbandonedHandler = async () => {
    await cartCtx.deleteAbandoned();
    history.go(0);
  };

  return (
    <div>
      <button className={classes.button} onClick={deleteCompletedHandler}>
        Delete completed carts
      </button>
      <button className={classes.button} onClick={deleteAbandonedHandler}>
        Delete abandoned carts
      </button>
      <table className={classes.table}>
        <tbody>
          <tr>
            <th>Cart Id</th>
            <th>Date created</th>
            <th>Status</th>
            <th>Items</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
          {carts &&
            carts.map((cart, i) => (
              <tr key={cart._id}>
                <td>#{cart._id}</td>{' '}
                <td>
                  {new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'full',
                    timeStyle: 'long',
                  }).format(new Date(cart.createdAt))}
                </td>
                <td>{cart.status}</td>
                <td>
                  {cart.meals.map((mealObj) => {
                    return (
                      <Fragment>
                        <p>
                          {mealObj.meal.name}, qt.{mealObj.quantity}, price
                          {` ${mealObj.meal.price}`}$
                        </p>
                        <p></p>
                      </Fragment>
                    );
                  })}
                </td>
                <td>{cart.price}$</td>
                <td
                  onClick={() => {
                    deleteCartHandler(cart._id);
                  }}
                >
                  <button className={classes['button-table']}>Delete</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCarts;
