import { useContext, useRef, useState } from "react";
import UserContext from "../../store/user-context";
import classes from "./UserPassword.module.css";

const UserPassword = (props) => {
  const userCtx = useContext(UserContext);
  const currentPassword = useRef();
  const password = useRef();
  const passwordConfirm = useRef();

  const inputs = [currentPassword, password, passwordConfirm];

  const [successMessage, setSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emptyFieldError, setEmptyFieldError] = useState([false, false, false]);
  const [error, setError] = useState([
    {
      status: false,
      message: "",
    },
    {
      status: false,
      message: "",
    },
    {
      status: false,
      message: "",
    },
  ]);

  const validateBeforeSending = () => {
    const newState = Array(3).fill(false);
    let emptyField = false;
    inputs.forEach((input, i) => {
      if (input.current.value === "") {
        newState[i] = true;
        emptyField = true;
      }
    });
    if (emptyField) {
      setEmptyFieldError(newState);
      return true;
    }

    return false;
  };

  const validate = (index) => {
    if (inputs[index].current.value !== "") {
      setEmptyFieldError((prevState) => {
        const newState = [...prevState];
        newState[index] = false;
        return newState;
      });
    } else {
      setEmptyFieldError((prevState) => {
        const newState = [...prevState];
        newState[index] = true;
        return newState;
      });
    }
  };

  const updatePasswordHandler = async (event) => {
    event.preventDefault();

    if (validateBeforeSending()) return;

    setIsLoading(true);
    const response = await userCtx.updatePassword(
      currentPassword.current.value,
      password.current.value,
      passwordConfirm.current.value
    );

    if (response.status === "success") {
      setSuccessMessage(true);
      setError(Array(3).fill({ status: false, message: "" }));
    } else manageError(response);
    setIsLoading(false);
  };

  const manageError = (error) => {
    let messages = Array(3).fill({ status: false, message: "" });

    if (error.includes("current"))
      messages = generateMessages(messages, 0, "Password is not correct");

    if (error.includes("password:"))
      messages = generateMessages(
        messages,
        1,
        "A password must be 8 characters long and contain a number, a special character and an upper case letter"
      );

    if (error.includes("passwordConfirm:"))
      messages = generateMessages(messages, 2, "Passwords do not match");

    if (messages.length)
      setError((prevErrors) => {
        const newErrors = [...prevErrors];
        messages.forEach((message, i) => {
          newErrors[i].status = message.status;
          newErrors[i].message = message.message;
        });
        return newErrors;
      });
  };

  const generateMessages = (messagesArr, index, message) => {
    return messagesArr.map((messageEl, i) =>
      i === index ? { status: true, message } : messageEl
    );
  };

  return isLoading ? (
    <div className={classes.loader} />
  ) : (
    <form className={classes.form}>
      {successMessage && (
        <p className={classes.message}>Password successfully updated!</p>
      )}
      <div className={classes["input-container"]}>
        <p className={classes.label}>Current password:</p>
        <input
          onChange={() => {
            validate(0);
          }}
          ref={currentPassword}
          type="password"
          className={
            emptyFieldError[0] || error[0].status
              ? classes["input-error"]
              : classes.input
          }
        />

        {error[0].status && <p className={classes.error}>{error[0].message}</p>}
      </div>
      <div className={classes["input-container"]}>
        <p className={classes.label}>New password:</p>
        <input
          onChange={() => {
            validate(1);
          }}
          ref={password}
          type="password"
          className={
            emptyFieldError[1] || error[1].status
              ? classes["input-error"]
              : classes.input
          }
        />

        {error[1].status && <p className={classes.error}>{error[1].message}</p>}
      </div>
      <div className={classes["input-container"]}>
        <p className={classes.label}>Confirm password:</p>
        <input
          onChange={() => {
            validate(2);
          }}
          ref={passwordConfirm}
          type="password"
          className={
            emptyFieldError[2] || error[2].status
              ? classes["input-error"]
              : classes.input
          }
        />
        {error[2].status && <p className={classes.error}>{error[2].message}</p>}
      </div>
      <button
        onClick={() => {
          props.onButton();
        }}
        className={classes.password}
      >
        Change personal information?
      </button>
      <button onClick={updatePasswordHandler} className={classes.button}>
        Update
      </button>
    </form>
  );
};
export default UserPassword;
