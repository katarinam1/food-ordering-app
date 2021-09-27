import classes from './AdminUpdateRest.module.css';
import { Fragment, useContext, useRef, useState } from 'react';
import PlacesSearch from '../address/PlacesSearch';
import RestContext from '../../store/rest-context';
import { useHistory } from 'react-router-dom';

const AdminUpdateRest = (props) => {
  const restCtx = useContext(RestContext);
  const history = useHistory();
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

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  const suggestionHandler = async (result, lat, lng, text) => {
    const street = result.split(', ')[0];
    const city = result.split(', ')[1].replace(/[0-9]/g, '');
    setLatLng([lng, lat]);
    setAddress(street.concat(`, ${city}`));
  };

  const setWorkingHoursHandler = () => {
    return time.current.map((element, i) => {
      const [hoursOpenString, minutesOpenString] = element.from.value.split(':');
      const open = hoursOpenString * 60 + minutesOpenString * 1;

      const [hoursClosedString, minutesClosedString] = element.to.value.split(':');
      const close = hoursClosedString * 60 + minutesClosedString * 1;
      return { day: days[i], open, close };
    });
  };

  const updateRestaurantHandler = async () => {
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

    if (latlng.length && address !== '') {
      form.append(
        'location',
        JSON.stringify({
          type: 'Point',
          coordinates: latlng,
          address,
        })
      );
    }
    if (photo) form.append('photo', photo.current.files[0]);
    form.append('prepTime', +prepTime.current.value);
    form.append('description', description.current.value);

    await restCtx.updateRestaurant(props.rest._id, form);
    history.go(0);
  };

  const convertTime = (time) => {
    let timeHour = Math.round(time / 60);
    let timeMinutes = time % 60;

    if (timeHour === 0 && timeMinutes === 0) return null;

    timeHour = timeHour < 10 ? `0${timeHour}` : timeHour;
    timeMinutes = timeMinutes < 10 ? `0${timeMinutes}` : timeMinutes;

    return `${timeHour}:${timeMinutes}`;
  };

  //   return `${openHour}.${openMinutes} - ${closeHour}.${closeMinutes}`;{};
  return (
    <Fragment>
      {console.log(props.rest)}
      <div className={classes.container}>
        <div className={classes.card}>
          <form>
            <p className={classes['p-card']}>name:</p>
            <input
              className={classes.input}
              type="text"
              maxLength="30"
              ref={name}
              defaultValue={props.rest.name}
            />
            <p className={classes['p-card']}>address:</p>
            <PlacesSearch
              input={classes['input-ing']}
              onSearch={suggestionHandler}
              placeholder={props.rest.location.address}
            />
            <p className={classes['p-card']}>working hours:</p>
            <br></br>
            {props.rest.workingHours.map((el, i) => (
              <Fragment key={Math.random()}>
                <p className={classes['p-card']}>{el.day}</p>
                <input
                  className={classes['input-time']}
                  type="time"
                  max="24:00"
                  name="from"
                  defaultValue={convertTime(el.open)}
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
                  max="24:00"
                  type="time"
                  defaultValue={convertTime(el.close)}
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
            <img
              className={classes['item-img']}
              src={`/restaurants/${props.rest.imageCover}`}
              alt="food"
            ></img>
            <input className={classes.input} type="file" name="photo" id="photo" ref={photo} />
            <br></br>
            <p className={classes['p-card']}>tags:</p>
            <input
              className={classes['input-ing']}
              ref={tags}
              type="text"
              defaultValue={props.rest.tags.join(', ')}
            />
            <br></br>
            <p className={classes['p-card']}>avg. preparation time:</p>
            <input
              className={classes['input-price']}
              ref={prepTime}
              type="text"
              defaultValue={props.rest.prepTime}
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
              defaultValue={props.rest.description}
            />
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                updateRestaurantHandler();
              }}
              className={classes.button}
            >
              Update Restaurant
            </button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default AdminUpdateRest;
