import classes from './Tags.module.css';
import { useContext, Fragment } from 'react';
import { useLocation } from 'react-router-dom';
import RestContext from './../../store/rest-context';

const Tags = (props) => {
  const restCtx = useContext(RestContext);

  const location = useLocation();

  const tagsArray = restCtx.tags;

  const tagHandler = async (event) => {
    if (location.pathname.includes('.')) {
      const [lat, lng] = location.pathname.match(/\b\d+(?:.\d+)?/g);
      await restCtx.getRestaurantsWithin(lat, lng, event.target.textContent);
    } else {
      await restCtx.getRestaurants(event.target.textContent);
    }
  };

  return (
    <Fragment>
      <div className={classes.wrapper}>
        {tagsArray.map((tag) => (
          <button
            key={Math.random()}
            onClick={tagHandler}
            className={classes.button}
          >
            {tag}
          </button>
        ))}
      </div>
    </Fragment>
  );
};

export default Tags;
