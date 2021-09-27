import classes from "./UserInfo.module.css";
import PlacesSearch from "../address/PlacesSearch";
import { useContext, useRef, useState, Fragment } from "react";
import { useHistory } from "react-router";
import UserContext from "../../store/user-context";
import UserPassword from "./UserPassword";

const UserInfo = (props) => {
  const name = useRef();
  const email = useRef();
  const number = useRef();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPhone, setErrorPhone] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    coordinates: [],
    address: "",
  });

  const userCtx = useContext(UserContext);
  const history = useHistory();

  const getAddressHandler = async (result, lat, lng, text) => {
    setDeliveryAddress({
      coordinates: [lng, lat],
      address: result,
    });
  };

  const updateUserHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    const response = await userCtx.update(
      name.current.value,
      deliveryAddress.coordinates,
      deliveryAddress.address,
      email.current.value,
      number.current.value
    );
    if (response.status === "success") {
      setErrorEmail(false);
      setErrorPhone(false);
    } else manageError(response);
    setIsLoading(false);
    // history.go(0);
  };

  const manageError = (error) => {
    if (error.includes("phoneNumber:")) {
      setErrorPhone(true);
    }
    if (error.includes("email:")) {
      setErrorEmail(true);
    }
  };

  return (
    <Fragment>
      {isLoading ? (
        <div className={classes.loader} />
      ) : (
        <div className={classes.container}>
          {userCtx._id && showPasswordForm ? (
            <UserPassword
              isLoading={setIsLoading}
              onButton={() => {
                setShowPasswordForm(false);
              }}
            />
          ) : (
            <form className={classes.form}>
              <div className={classes["input-container"]}>
                <p className={classes.label}>Name:</p>
                <input
                  ref={name}
                  className={classes.input}
                  defaultValue={`${userCtx.name}`}
                />
              </div>

              <div className={classes["input-container"]}>
                <p className={classes.label}>Delivery address:</p>
                {/* <input className={classes.input} defaultValue="Kralja Petra I" /> */}
                <PlacesSearch
                  onSearch={getAddressHandler}
                  placeholder={`${userCtx.deliveryAddress.address}`}
                  input={classes.input}
                />
              </div>
              <div className={classes["input-container"]}>
                <p className={classes.label}>Email:</p>
                <input
                  ref={email}
                  className={
                    errorEmail ? classes["input-error"] : classes.input
                  }
                  defaultValue={`${userCtx.email}`}
                />
                {errorEmail && (
                  <p className={classes.error}>
                    Please provide a valid email address
                  </p>
                )}
              </div>
              <div className={classes["input-container"]}>
                <p className={classes.label}>Phone Number:</p>
                <input
                  className={
                    errorPhone ? classes["input-error"] : classes.input
                  }
                  ref={number}
                  defaultValue={`${userCtx.phoneNumber}`}
                />

                {errorPhone && (
                  <p className={classes.error}>
                    Not a valid phone number! Valid format is +3816XXXXXXX(X)
                  </p>
                )}
              </div>
              <button
                onClick={() => {
                  setShowPasswordForm(true);
                }}
                className={classes.password}
              >
                Change password?
              </button>
              <button onClick={updateUserHandler} className={classes.button}>
                Update
              </button>
            </form>
          )}
        </div>
      )}
    </Fragment>
  );
};

export default UserInfo;
