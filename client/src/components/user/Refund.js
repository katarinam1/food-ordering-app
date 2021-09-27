import classes from "./Refund.module.css";

const Refund = () => {
  return (
    <div className={classes.message}>
      <div className={classes["message-content"]}>
        <span className={classes.close}>&times;</span>
        <p className={classes["message-title"]}>Please choose a reason:</p>
        <label className={classes.container}>
          <input
            className={classes.input}
            type="radio"
            checked="checked"
            name="radio"
          />{" "}
          <p className={classes.option}>
            Missing items: The customer didn’t receive an item
          </p>
          <span className={classes.checkmark}></span>
        </label>
        <label className={classes.container}>
          <p className={classes.option}>
            Incorrect quantity: The customer received an item but it was not as
            ordered
          </p>
          <input className={classes.input} type="radio" name="radio" />
          <span className={classes.checkmark}></span>
        </label>
        <label className={classes.container}>
          <p className={classes.option}>
            Incorrect orders: The customer received an entire order that was
            incorrect or not theirs
          </p>
          <input className={classes.input} type="radio" name="radio" />
          <span className={classes.checkmark}></span>
        </label>
        <button>send request</button>
      </div>
    </div>
  );
};

export default Refund;
