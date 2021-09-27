import classes from "./Section.module.css";
import RestContainer from "./RestContainer";
import { ReactComponent as Logo } from "./../../assets/arrow.svg";
import { useState, useEffect } from "react";
import Tags from "./Tags";

const Section = (props) => {
  const [footerHidden, setFooterHidden] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", footerHandler);
    return () => window.removeEventListener("scroll", footerHandler);
  }, []);

  const footerHandler = () => {
    setFooterHidden(() => {
      if (
        document.body.scrollTop > 10 ||
        document.documentElement.scrollTop > 10
      )
        return true;
      return false;
    });
  };

  return (
    <section className={classes.section}>
      <RestContainer
        onLogin={props.onLogin}
        reference={props.reference}
        onViewMap={props.onViewMap}
      />
      {!footerHidden && (
        <footer className={classes.footer}>
          <p className={`${classes.p1}`}></p>
        </footer>
      )}
    </section>
  );
};

export default Section;
