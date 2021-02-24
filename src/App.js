import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Provider } from "react-redux";
import { connect } from "react-redux";
import config from './aws-exports'
import Amplify, { Auth } from 'aws-amplify';


import store from "./store";
import './App.scss';
import { logoutUser, setCurrentUser } from "./actions/authAction";

import "../node_modules/slick-carousel/slick/slick.css";
import "../node_modules/slick-carousel/slick/slick-theme.css";

Amplify.configure(config);

const loadingComponent = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

// Containers
const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

// Pages
const Login = React.lazy(() => import('./views/Pages/Auth/Login'));
const Register = React.lazy(() => import('./views/Pages/Auth/Register'));
const ResetPassword = React.lazy(() => import('./views/Pages/Auth/ResetPassword'));
const ForgotPassword = React.lazy(() => import('./views/Pages/Auth/ForgotPassword'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
const Page500 = React.lazy(() => import('./views/Pages/Page500'));

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const App = (props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const retrieveUser = async() => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        await store.dispatch(setCurrentUser(user));
        setLoading(false);
      } catch (error) {
          console.log('Auth Error', error);
          setLoading(false);
      }
    };
    retrieveUser();
  }, []);


  const PrivateRoute = ({ component: Component, auth, ...others }) => {
    return (
      <Route
        {...others}
        render={ props => loading ? loadingComponent() : window._.isEmpty(window._.get(auth, ['user', 'signInUserSession'], null)) ? <Redirect to={{ pathname: "/login", search: props.location.search }} /> : <Component {...props} /> }
      />
    );
  };

  const EnhancedPrivateRoute = connect(mapStateToProps)(PrivateRoute);

  return (
    <Provider store={store}>
      <BrowserRouter>
          <React.Suspense fallback={loadingComponent()}>
            <Switch>
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/reset" name="Reset Password" render={props => <ResetPassword {...props}/>} />
              <Route exact path="/forgot-password" name="Forgot Password" render={props => <ForgotPassword {...props}/>} />
              <Switch>
                <EnhancedPrivateRoute path="/" name="Home" component={DefaultLayout} {...props} />
              </Switch>
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
