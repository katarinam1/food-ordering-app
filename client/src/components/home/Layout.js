import './../../App.css';
import pasta1 from './../../assets/cover18.jpg';
import Header from './Header';
import { Fragment } from 'react';
import classes from './Layout.module.css';

const Layout = (props) => {
  return (
    <Fragment>
      <Header />
      <div className={classes.content}>
        <div className={classes.left}>
          <div className={classes['left-main']}>{props.children}</div>
        </div>
        <div className={classes.right}>
          <img className={classes.img} src={pasta1} alt="pasta"></img>
        </div>
      </div>
    </Fragment>
  );
};

export default Layout;
