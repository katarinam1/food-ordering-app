import { useRef, useState, useContext } from 'react';
import { useHistory } from 'react-router';
import classes from './LoginForm.module.css';
import UserContext from '../../store/user-context';

const LoginForm = (props) => {
  const email = useRef('');
  const password = useRef('');
  const [emailEmpty, setEmailEmpty] = useState(false);
  const [passwordEmpty, setPasswordEmpty] = useState(false);
  const [error, setError] = useState({
    status: false,
    message: '',
  });

  const userCtx = useContext(UserContext);
  const history = useHistory();

  const validateBeforeSending = () => {
    let emptyField = false;

    if (!email.current.value) {
      setEmailEmpty(true);
      emptyField = true;
    }

    if (!password.current.value) {
      setPasswordEmpty(true);
      emptyField = true;
    }

    return emptyField;
  };

  const manageErrorHandler = (error) => {
    setError({
      status: true,
      message: error,
    });
    setEmailEmpty(true);
    setPasswordEmpty(true);
  };

  const loginHandler = async (event) => {
    event.preventDefault();
    if (validateBeforeSending()) return;

    const result = await userCtx.login(email.current.value, password.current.value);
    if (result.status === 'success') {
      if (result.data.user.role === 'admin') {
        history.push('/admin');
      } else {
        const [lng, lat] = result.data.user.deliveryAddress.coordinates;
        history.push(`/restaurants/address/${lat}/${lng}`);
      }
    } else {
      manageErrorHandler(result);
    }
  };

  return (
    <div className={`${classes.input} ${classes['inner-cell']}`}>
      <p className={classes['p-login']}>
        You are<br></br> one step away from ordering.
      </p>
      <form>
        <input
          onChange={() => {
            setEmailEmpty(false);
            setError({ status: false, message: '' });
          }}
          id="email"
          type="text"
          placeholder="Enter your email"
          ref={email}
          className={emailEmpty ? classes['input-error'] : ''}
        />
        <input
          onChange={() => {
            setPasswordEmpty(false);
            setError({ status: false, message: '' });
          }}
          id="password"
          type="password"
          placeholder="Enter your password"
          ref={password}
          className={passwordEmpty ? classes['input-error'] : ''}
        />
        {error.status && <p className={classes.error}>{error.message}</p>}
        <button onClick={loginHandler} className={classes.myButton}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default LoginForm;
