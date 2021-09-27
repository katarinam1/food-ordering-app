import { Fragment, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import RestContext from '../../store/rest-context';
import classes from './AdminAllRest.module.css';

const AdminAllRest = () => {
  const restCtx = useContext(RestContext);
  const history = useHistory();

  useEffect(() => {
    const fetchRestaurants = async () => {
      await restCtx.getRestaurants('', 1, 0);
    };
    fetchRestaurants();
  }, [restCtx]);

  return (
    <Fragment>
      <div>
        {restCtx.restaurants.map((rest) => (
          <div className={classes.card}>
            <img
              className={classes['item-img']}
              src={`/restaurants/${rest.imageCover}`}
              alt="food"
            ></img>

            <p className={classes.name}>{rest.name}</p>
            <button
              onClick={() => {
                history.push(`/admin/restaurants/${rest._id}`);
              }}
              className={classes.button}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </Fragment>
  );
};

export default AdminAllRest;
