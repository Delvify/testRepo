import React, { Suspense, useCallback } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { connect } from "react-redux";


import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import clientNavigation from '../../_nav';
import adminNavigation from '../../_adminNav';
// routes config
import clientRoutes from '../../routes';
import adminRoutes from '../../adminRoutes';
import Container from "../../components/layouts/Container";

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));


const loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>;

const mapStateToProps = (state) => ({
  groups: window._.get(state, ['auth', 'user', 'signInUserSession', 'idToken', 'payload', 'cognito:groups'], [])
});

const DefaultLayout = ({ dispatch, ...props }) => {
  const { groups } = props;
  const isAdmin = groups.includes('Admin');

  const navigation = isAdmin ? adminNavigation : clientNavigation;
  const routes = isAdmin ? adminRoutes : clientRoutes;

  const signOut = useCallback((e) => {
    e.preventDefault();
    props.history.push('/login');
  }, [props]);

  return (
    <div className="app">
      <AppHeader fixed>
        <Suspense  fallback={loading()}>
          <DefaultHeader onLogout={e => signOut(e)}/>
        </Suspense>
      </AppHeader>
      <div className="app-body">
        <AppSidebar fixed display="lg">
          <AppSidebarHeader />
          <AppSidebarForm />
          <Suspense>
            <AppSidebarNav navConfig={navigation} {...props} />
          </Suspense>
          <AppSidebarFooter />
          <AppSidebarMinimizer />
        </AppSidebar>
        <main className="main">
          <Container fluid isHome={props.history.location.pathname.includes('onboarding')}>
            <Suspense fallback={loading()}>
              <Switch>
                {routes.map((route, idx) => {
                  return route.component ? (
                    <Route
                      key={idx}
                      path={route.path}
                      exact={route.exact}
                      name={route.name}
                      render={routeProps => (
                        <route.component {...routeProps} />
                      )} />
                  ) : (null);
                })}
                <Redirect from="/" to={ isAdmin ? "/users" : "/onboarding" } />
              </Switch>
            </Suspense>
          </Container>
        </main>
        <AppAside fixed>
          <Suspense fallback={loading()}>
            <DefaultAside />
          </Suspense>
        </AppAside>
      </div>
    </div>
  );
}

export default connect(mapStateToProps)(DefaultLayout);
