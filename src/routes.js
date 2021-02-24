import React from 'react';

const ConfigSmartSKU = React.lazy(() => import('./views/Configurations/SmartSKU'));
const ConfigSmartVision = React.lazy(() => import('./views/Configurations/SmartVision'));
const TestSmartSKU = React.lazy(() => import('./views/Test/SmartSKU'));
const TestSmartVision = React.lazy(() => import('./views/Test/SmartVision'));
const Settings = React.lazy(() => import('./views/Settings'));
const Transactions = React.lazy(() => import('./views/Conversions'));
const Overviews = React.lazy(() => import('./views/Overview'));
const Campaigns = React.lazy(() => import('./views/Campaigns'));
const Upload = React.lazy(() => import('./views/Upload'));
const Onboarding = React.lazy(() => import('./views/Onboarding'));
const Deployment = React.lazy(() => import('./views/Deployment'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },

  { path: '/config/smart-sku', exact: true, name: 'Smart SKU', component: ConfigSmartSKU },
  { path: '/config/smart-vision', exact: true, name: 'Smart Vision', component: ConfigSmartVision },
  { path: '/test/smart-sku', exact: true, name: 'Smart SKU', component: TestSmartSKU },
  { path: '/test/smart-vision', exact: true, name: 'Smart Vision', component: TestSmartVision },
  // { path: '/settings', exact: true, name: 'Settings', component: Settings },
  // { path: '/conversions', exact: true, name: 'Conversion Report', component: Transactions },
  // { path: '/overview', exact: true, name: 'Overview', component: Overviews },
  // { path: '/campaigns', exact: true, name: 'Campaign Report', component: Campaigns },
  { path: '/upload', exact: true, name: 'Upload Product Feed', component: Upload },
  { path: '/onboarding', exact: true, name: 'Onboarding', component: Onboarding },
  { path: '/deploy', exact: true, name: 'Deploy', component: Deployment },
];

export default routes;
