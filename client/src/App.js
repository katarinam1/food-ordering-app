import "./App.css";
import { Redirect, Route, Switch } from "react-router";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Restaurants from "./pages/Restaurants";
import Meals from "./pages/Meals";
import UserProvider from "./store/UserProvider";
import CartProvider from "./store/CartProvider";
import RestProvider from "./store/RestProvider";
import ReviewProvider from "./store/ReviewProvider";
import OrderProvider from "./store/OrderProvider";
import Signup from "./pages/Signup";
import User from "./pages/User";
import Admin from "./pages/Admin";
import Layout from "./components/home/Layout";

const App = () => {
  return (
    <UserProvider>
      <OrderProvider>
        <CartProvider>
          <RestProvider>
            <Switch>
              <Route path="/restaurants/address/:lat?/:lng?" exact>
                <Restaurants />
              </Route>
              <Route path="/restaurants/:restId/meals">
                <ReviewProvider>
                  <Meals />
                </ReviewProvider>
              </Route>
              <Route path="/user/account" exact>
                <ReviewProvider>
                  <User />
                </ReviewProvider>
              </Route>
              <Route path="/admin">
                <Admin />
              </Route>
              <Route>
                <Layout>
                  <Switch>
                    <Route path="/" exact>
                      <Redirect to="/home" />
                    </Route>
                    <Route path="/home">
                      <Home />
                    </Route>
                    <Route path="/login">
                      <Login />
                    </Route>
                    <Route path="/signup">
                      <Signup />
                    </Route>
                  </Switch>
                </Layout>
              </Route>
            </Switch>
          </RestProvider>
        </CartProvider>
      </OrderProvider>
    </UserProvider>
  );
};

export default App;
