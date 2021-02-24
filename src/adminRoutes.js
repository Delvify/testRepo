import React from 'react';

const Users = React.lazy(() => import('./views/Users'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/users', exact: true, name: 'Users', component: Users },
];

export default routes;
