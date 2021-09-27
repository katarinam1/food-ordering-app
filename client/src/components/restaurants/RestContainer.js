import { Fragment, useContext } from 'react';
import RestDetail from './RestDetail';
import classes from './RestContainer.module.css';
import LoginFormRest from '../auth/LoginFormRest';
import RestContext from './../../store/rest-context';
import UserContext from '../../store/user-context';
import Pagination from './Pagination';

const RestContainer = (props) => {
  const restCtx = useContext(RestContext);
  const userCtx = useContext(UserContext);
  return (
    <Fragment>
      <Pagination />
      <ul className={classes.container}>
        {restCtx.restaurants.map((restaurant, i) => (
          <li key={restaurant._id}>
            <RestDetail
              index={i}
              key={restaurant._id}
              id={restaurant._id}
              name={restaurant.name}
              description={restaurant.description}
              time={restaurant.workingTimeToday}
              image={restaurant.imageCover}
              deliveryFrom={restaurant.deliveryTimeFrom}
              deliveryTo={restaurant.deliveryTimeTo}
              distance={restaurant.distance}
              onViewMap={props.onViewMap}
              coords={restaurant.location.coordinates}
              address={restaurant.location.address}
              tags={restaurant.tags}
            />
          </li>
        ))}
      </ul>
      {!userCtx._id ? (
        <div ref={props.reference} className={classes.sign}>
          {!userCtx._id && <LoginFormRest onLogin={props.onLogin} />}
        </div>
      ) : (
        <div style={{ marginTop: '80px' }}></div>
      )}
    </Fragment>
  );
};

export default RestContainer;
