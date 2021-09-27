import classes from './RestDetail.module.css';
import RestContext from './../../store/rest-context';

import React, { Fragment, useContext, useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import UserContext from '../../store/user-context';

const RestDetail = (props) => {
  const [isVisible, setVisible] = React.useState(false);
  const userCtx = useContext(UserContext);
  const domReference = useRef();
  const history = useHistory();
  const restCtx = useContext(RestContext);
  const path = '/restaurants';

  const mealButtonHandler = async () => {
    let lng, lat;
    if (userCtx._id) {
      [lng, lat] = userCtx.deliveryAddress.coordinates;
      await restCtx.updateCurrentRestaurant(props.id, lat, lng);
    } else await restCtx.updateCurrentRestaurant(props.id);
    history.push(`/restaurants/${props.id}/meals`);
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisible(true);
        observer.unobserve(domReference.current);
      }
    });
    observer.observe(domReference.current);
  }, []);

  const classToUse = isVisible ? 'visible' : '';
  return (
    <div ref={domReference} className={`${classes.row} ${classes[classToUse]}`}>
      <div className={classes['column-left']}>
        {props.index % 2 ? (
          <Fragment>
            {!props.deliveryFrom ? (
              <h2 className={classes.heading} style={{ marginTop: '50px' }}>
                {props.name}
              </h2>
            ) : (
              <h2 className={classes.heading}>{props.name}</h2>
            )}

            {props.deliveryFrom ? (
              <Fragment>
                <p
                  className={classes.details}
                  style={{ cursor: 'pointer', width: '100px', opacity: '80%' }}
                  onClick={() => {
                    props.onViewMap(props.name, props.coords, props.distance);
                  }}
                >
                  View on map
                </p>
                <p className={classes.details}>
                  Delivery time:
                  <span className={classes['details-span']}>
                    {props.deliveryFrom}-{props.deliveryTo} min
                  </span>
                </p>
                <p className={classes.details}>
                  Address:
                  <span className={classes['details-span']}>
                    {props.address}
                  </span>
                </p>

                <p className={classes.details}>
                  Open today:
                  <span className={classes['details-span']}>{props.time}</span>
                </p>
                <p className={classes.details}>
                  {props.tags.map((tag) => (
                    <div key={Math.random()} className={classes.tag}>
                      {tag}
                    </div>
                  ))}
                </p>
              </Fragment>
            ) : (
              <Fragment>
                <p className={classes.details}>
                  Address:
                  <span className={classes['details-span']}>
                    {props.address}
                  </span>
                </p>
                <p className={classes.details}>
                  Open today:
                  <span className={classes['details-span']}>{props.time}</span>
                </p>
                <p className={classes.details}>
                  {props.tags.map((tag) => (
                    <div key={Math.random()} className={classes.tag}>
                      {tag}
                    </div>
                  ))}
                </p>
              </Fragment>
            )}
            <button onClick={mealButtonHandler} className={classes.myButton}>
              Discover meals
            </button>
          </Fragment>
        ) : (
          <img
            className={classes.img}
            alt="restaurant"
            src={`${path}/${props.image}`}
          />
        )}
      </div>
      <div className={classes['column-right']}>
        {props.index % 2 ? (
          <img
            className={classes.img1}
            alt="restaurant"
            src={`${path}/${props.image}`}
          />
        ) : (
          <Fragment>
            {!props.deliveryFrom ? (
              <h2 className={classes.heading} style={{ marginTop: '50px' }}>
                {props.name}
              </h2>
            ) : (
              <h2 className={classes.heading}>{props.name}</h2>
            )}
            {props.deliveryFrom ? (
              <Fragment>
                <p
                  className={classes.details}
                  style={{ cursor: 'pointer', width: '100px', opacity: '80%' }}
                  onClick={() => {
                    props.onViewMap(props.name, props.coords, props.distance);
                  }}
                >
                  View on map
                </p>
                <p className={classes.details}>
                  Delivery time:
                  <span className={classes['details-span']}>
                    {props.deliveryFrom}-{props.deliveryTo} min
                  </span>
                </p>
                <p className={classes.details}>
                  Address:
                  <span className={classes['details-span']}>
                    {props.address}
                  </span>
                </p>
                <p className={classes.details}>
                  Open today:
                  <span className={classes['details-span']}>{props.time}</span>
                </p>{' '}
                <p className={classes.details}>
                  {props.tags.map((tag) => (
                    <div key={Math.random()} className={classes.tag}>
                      {tag}
                    </div>
                  ))}
                </p>
              </Fragment>
            ) : (
              <Fragment>
                {' '}
                <p className={classes.details}>
                  Address:
                  <span className={classes['details-span']}>
                    {props.address}
                  </span>
                </p>
                <p className={classes.details}>
                  Open today:
                  <span className={classes['details-span']}>{props.time}</span>
                </p>
                <p className={classes.details}>
                  {props.tags.map((tag) => (
                    <div key={Math.random()} className={classes.tag}>
                      {tag}
                    </div>
                  ))}
                </p>
              </Fragment>
            )}

            <button onClick={mealButtonHandler} className={classes.myButton}>
              Discover meals
            </button>
          </Fragment>
        )}
      </div>
    </div>
  );
};
export default RestDetail;
