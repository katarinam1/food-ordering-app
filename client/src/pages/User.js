import { Fragment } from 'react';
import UserAccount from '../components/user/UserAccount';
import Header from './../components/user/Header';

const User = () => {
  return (
    <Fragment>
      <Header></Header>
      <UserAccount />
    </Fragment>
  );
};

export default User;
