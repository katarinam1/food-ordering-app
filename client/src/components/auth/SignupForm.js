import classes from './SignupForm.module.css';
import { useHistory } from 'react-router';
import { useContext, useRef, useState } from 'react';
import PlacesSearch from '../address/PlacesSearch';
import UserContext from '../../store/user-context';

const SignupForm = (props) => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const email = useRef('');
  const password = useRef('');
  const name = useRef('');
  const phone = useRef('');
  const confirmPassword = useRef('');

  const [latlng, setLatLng] = useState([]);
  const [address, setAddress] = useState('');

  const inputs = [email, phone, password, confirmPassword, name];

  const [empty, setEmpty] = useState(Array(5).fill(false));
  const [error, setError] = useState(Array(4).fill(false));
  const [addrEmpty, setAddrEmpty] = useState(false);

  const signupHandler = async (event) => {
    event.preventDefault();
    if (validateBeforeSending()) return;
    const result = await userCtx.signup(
      email.current.value,
      password.current.value,
      confirmPassword.current.value,
      name.current.value,
      latlng,
      address,
      phone.current.value
    );
    if (result.status === 'success') {
      if (result.data.user.role === 'admin') {
        history.push('/admin');
      } else {
        const [lng, lat] = result.data.user.deliveryAddress.coordinates;
        history.push(`/restaurants/address/${lat}/${lng}`);
      }
    } else {
      manageError(result);
    }
  };

  const searchHandler = (result, lat, lng, text) => {
    setLatLng([lng, lat]);
    setAddress(result);
    setAddrEmpty(false);
  };

  const validateBeforeSending = () => {
    const newState = Array(5).fill(false);
    let emptyField = false;
    inputs.forEach((input, i) => {
      if (input.current.value === '') {
        newState[i] = true;
        emptyField = true;
      }
    });

    if (address === '') {
      setAddrEmpty(true);
    }
    if (emptyField) {
      setEmpty(newState);
      return true;
    }

    return false;
  };

  const manageError = (error) => {
    let errors = Array(4).fill(false);

    if (error.includes('email')) errors[0] = true;
    if (error.includes('phone')) errors[1] = true;
    if (error.includes('password:')) errors[2] = true;
    if (error.includes('passwordConfirm:')) errors[3] = true;

    setError(errors);
  };

  const validate = (index) => {
    if (inputs[index].current.value !== '') {
      setEmpty((prevState) => {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      });
    } else {
      setEmpty((prevState) => {
        const newState = [...prevState];
        newState[index] = true;
        return newState;
      });
    }
  };

  return (
    <div className={`${classes.input} ${classes['inner-cell']}`}>
      <p className={classes['p-login']}>Register to become a member.</p>
      <form>
        <input
          onChange={() => {
            validate(4);
          }}
          id="name"
          type="text"
          placeholder="Enter your name"
          ref={name}
          className={empty[4] ? classes['input-error'] : ''}
        />
        <PlacesSearch
          onSearch={searchHandler}
          input={!addrEmpty ? classes.input : `${classes.input} ${classes['input-error']}`}
          placeholder="Enter your delivery address"
        />
        <input
          onChange={() => {
            validate(0);
          }}
          id="email"
          type="text"
          placeholder="Enter your email"
          ref={email}
          className={empty[0] || error[0] ? classes['input-error'] : ''}
        />
        {error[0] && <p className={classes.error}>Please enter a valid email address</p>}
        <input
          onChange={() => {
            validate(1);
          }}
          id="phone"
          type="text"
          placeholder="Enter your phone number"
          ref={phone}
          className={empty[1] || error[1] ? classes['input-error'] : ''}
        />
        {error[1] && (
          <p className={classes.error}>
            {' '}
            Not a valid phone number! Valid format is +3816XXXXXXX(X)
          </p>
        )}
        <input
          onChange={() => {
            validate(2);
          }}
          id="password"
          type="password"
          ref={password}
          placeholder="Enter your password"
          className={empty[2] || error[2] ? classes['input-error'] : ''}
        />
        {error[2] && (
          <p className={classes.error}>
            A password must be 8 characters long and contain a number, a special character and an
            upper case letter
          </p>
        )}
        <input
          onChange={() => {
            validate(3);
          }}
          id="passwordConfirm"
          type="password"
          placeholder="Confirm your password"
          ref={confirmPassword}
          className={empty[3] || error[3] ? classes['input-error'] : ''}
        />
        {error[3] && <p className={classes.error}>Passwords do not match</p>}
        <button onClick={signupHandler} className={classes.myButton}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default SignupForm;
