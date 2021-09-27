import classes from './AdminAddRestaurant.module.css';
import { Fragment, useContext, useRef, useState } from 'react';
import PlacesSearch from '../address/PlacesSearch';
import RestContext from '../../store/rest-context';

const AdminAddRestaurant = () => {
  const restCtx = useContext(RestContext);
  const name = useRef();
  const prepTime = useRef();
  const tags = useRef();
  const photo = useRef();
  const description = useRef();

  const [latlng, setLatLng] = useState([]);
  const [address, setAddress] = useState('');
  const time = useRef([]);

  time.current = Array(7).fill({
    from: '',
    to: '',
  });

  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  const suggestionHandler = async (result, lat, lng, text) => {
    setLatLng([lng, lat]);
    setAddress(result);
  };

  const setWorkingHoursHandler = () => {
    return time.current.map((element, i) => {
      const [hoursOpenString, minutesOpenString] =
        element.from.value.split(':');
      const open = hoursOpenString * 60 + minutesOpenString * 1;

      const [hoursClosedString, minutesClosedString] =
        element.to.value.split(':');
      const close = hoursClosedString * 60 + minutesClosedString * 1;
      return { day: days[i], open, close };
    });
  };

  const addRestaurantHandler = async (event) => {
    event.preventDefault();
    const form = new FormData();

    const tagsArray = tags.current.value.split(',');
    const workingHours = setWorkingHoursHandler();
    tagsArray.forEach((tag) => {
      form.append('tags', tag.trim());
    });

    workingHours.forEach((work) => {
      form.append('workingHours', JSON.stringify(work));
    });

    form.append('name', name.current.value);
    form.append(
      'location',
      JSON.stringify({
        coordinates: latlng,
        address,
      })
    );
    form.append('photo', photo.current.files[0]);
    form.append('prepTime', +prepTime.current.value);
    form.append('description', description.current.value);

    await restCtx.createRestaurant(form);
  };

  return (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.card}>
          <form>
            <p className={classes['p-card']}>name:</p>
            <input
              className={classes.input}
              type="text"
              maxLength="30"
              ref={name}
            />
            <p className={classes['p-card']}>address:</p>
            <PlacesSearch
              input={classes['input-ing']}
              onSearch={suggestionHandler}
            />
            <p className={classes['p-card']}>working hours:</p>
            <br></br>
            {days.map((el, i) => (
              <Fragment key={Math.random()}>
                <p className={classes['p-card']}>{el}</p>
                <input
                  className={classes['input-time']}
                  type="time"
                  min="00:00"
                  max="24:00"
                  name="from"
                  defaultValue="08:00"
                  ref={(el) =>
                    (time.current[i] = {
                      from: el,
                      to: '',
                    })
                  }
                  // onChange={(event) => setTimeHandler(event, i)}
                  // value={time[i].from}
                />
                :
                <input
                  className={classes['input-time']}
                  name="to"
                  min="00:00"
                  max="24:00"
                  type="time"
                  defaultValue="22:00"
                  ref={(el) => {
                    time.current[i] = { ...time.current[i], to: el };
                  }}
                  // value={time[i].to}
                  // onChange={(event) => setTimeHandler(event, i)}
                />
                <br></br>
              </Fragment>
            ))}

            <p className={classes['p-card']}>picture:</p>
            <input
              className={classes.input}
              type="file"
              name="photo"
              id="photo"
              ref={photo}
            />
            <br></br>
            <p className={classes['p-card']}>tags:</p>
            <input className={classes['input-ing']} ref={tags} type="text" />
            <br></br>
            <p className={classes['p-card']}>avg. preparation time:</p>
            <input
              className={classes['input-price']}
              ref={prepTime}
              type="text"
            />
            <span>min</span>
            <br></br>
            <p className={classes['p-card-descrpition']}>description:</p>
            <textarea
              className={classes['input-des']}
              id="review"
              name="review"
              maxLength="500"
              rows="4"
              cols="50"
              ref={description}
              style={{ fontFamily: 'Roboto' }}
            />
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                addRestaurantHandler(event);
              }}
              className={classes.button}
            >
              Add Restaurant
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminAddRestaurant;
