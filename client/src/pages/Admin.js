import { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import AdminInterface from './../components/admin/AdminInterface';
import AdminOrders from '../components/admin/AdminOrders';
import AdminCarts from '../components/admin/AdminCarts';
import AdminCoupons from '../components/admin/AdminCoupons';
import AdminRest from '../components/admin/AdminRest';
import AdminRestDetail from '../components/admin/AdminRestDetail';

const Admin = () => {
  return (
    <Fragment>
      <AdminInterface>
        <Switch>
          <Route path="/admin/orders" exact>
            <AdminOrders />
          </Route>
          <Route path="/admin/carts">
            <AdminCarts />
          </Route>
          <Route path="/admin/coupons">
            <AdminCoupons />
          </Route>
          <Route path="/admin/restaurants/:restId/" exact>
            <AdminRestDetail />
          </Route>
          <Route path="/admin/restaurants">
            <AdminRest />
          </Route>
        </Switch>
      </AdminInterface>
    </Fragment>
  );
};

export default Admin;
