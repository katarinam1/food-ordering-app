import { useRef } from "react";
import { useHistory } from "react-router";
import classes from "./LoginFormRest.module.css";
const LoginFormRest = (props) => {
  const history = useHistory();
  const email = useRef("");
  const password = useRef("");

  const loginHandler = (event) => {
    event.preventDefault();
    props.onLogin(email.current.value, password.current.value);
  };

  return (
    <div className={classes.container}>
      <p className={classes.text}>Log in to order.</p>
      <p className={classes.small}>
        Don't have an account?
        <p
          onClick={() => {
            history.push("/signup");
          }}
          className={classes["small-bold"]}
        >
          Sign up
        </p>
      </p>
      <form className={classes.form}>
        <div className={classes["input-container"]}>
          <input
            className={classes.input}
            id="email"
            type="text"
            placeholder="Email address"
            ref={email}
          />
        </div>
        <div className={classes["input-container"]}>
          <input
            className={classes.input}
            id="password"
            type="password"
            placeholder="Password"
            ref={password}
          />
        </div>
        <button onClick={loginHandler} className={classes.myButton}>
          Submit
        </button>
      </form>
    </div>
  );
};
export default LoginFormRest;
