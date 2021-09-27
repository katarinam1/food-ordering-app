import { Fragment, useContext, useEffect, useState } from 'react';
import RestContext from '../../store/rest-context';
import { useParams } from 'react-router-dom';
import classes from './AdminRestDetail.module.css';
import AdminMeals from './AdminMeals';
import AdminUpdateRest from './AdminUpdateRest';
import AdminAddMeal from './AdminAddMeal';

const AdminRestDetail = () => {
  const restCtx = useContext(RestContext);
  const params = useParams();
  const [showMeals, setShowMeals] = useState(false);
  const [showAddMeal, setShowAddMeal] = useState(false);
  const [showUpdateRest, setShowUpdateRest] = useState(false);

  useEffect(() => {
    const fetchRestaurant = async () => {
      await restCtx.updateCurrentRestaurant(params.restId);
    };
    fetchRestaurant();
  }, [params.restId, restCtx]);

  const calcWorkingTime = (open, close) => {
    if (!open && !close) return 'closed';
    const openHour = Math.round(open / 60);
    let openMinutes = open % 60;

    const closeHour = Math.round(close / 60);
    let closeMinutes = close % 60;

    openMinutes = openMinutes < 10 ? `0${openMinutes}` : openMinutes;
    closeMinutes = closeMinutes < 10 ? `0${closeMinutes}` : closeMinutes;

    return `${openHour}.${openMinutes} - ${closeHour}.${closeMinutes}`;
  };

  return (
    <Fragment>
      {restCtx.currentRestaurant && restCtx.currentRestaurant._id && (
        <div className={classes.container}>
          <div>
            <div>
              <p>Name: {restCtx.currentRestaurant.name}</p>
              <p>Address: {restCtx.currentRestaurant.location.address}</p>
              <p>About: "{restCtx.currentRestaurant.description}"</p>
              <p>
                Food:
                {restCtx.currentRestaurant.tags.map((food, i) => {
                  return i < restCtx.currentRestaurant.tags.length - 1
                    ? `${food}, `
                    : `${food}`;
                })}
              </p>
              <div>
                Working time:
                {restCtx.currentRestaurant.workingHours.map((time, i) => {
                  return (
                    <p className={classes.time}>
                      {time.day} : {calcWorkingTime(time.open, time.close)}
                    </p>
                  );
                })}
              </div>
              <p>
                Rating: {restCtx.currentRestaurant.ratingsAverage.toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => {
                setShowMeals((prevValue) => !prevValue);
                setShowAddMeal(false);
                setShowUpdateRest(false);
              }}
              className={classes.button}
            >
              {showMeals ? 'Hide Meals' : 'Show Meals'}
            </button>
            <button
              onClick={() => {
                setShowAddMeal((prevValue) => !prevValue);
                setShowUpdateRest(false);
                setShowMeals(false);
              }}
              className={classes.button}
            >
              {showAddMeal ? 'Hide Form' : 'Add Meal'}
            </button>
            <button
              onClick={() => {
                setShowUpdateRest((prevValue) => !prevValue);
                setShowMeals(false);
                setShowAddMeal(false);
              }}
              className={classes.button}
            >
              {showUpdateRest ? 'Hide update form' : 'Edit Restaurant'}
            </button>
            {showMeals && <AdminMeals />}
            {showAddMeal && <AdminAddMeal />}
            {showUpdateRest && (
              <AdminUpdateRest rest={restCtx.currentRestaurant} />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default AdminRestDetail;
