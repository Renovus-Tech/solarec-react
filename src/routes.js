/* eslint-disable prettier/prettier */
import React from 'react'
import { getCookie } from './helpers/sessionCookie'
import i18n from './helpers/i18n'

// Users
const UserSettings = React.lazy(() => import('./views/pages/user/settings'))
const ClientSettings = React.lazy(() => import('./views/pages/client/settings'))

// Pages
const Overview = React.lazy(() => import('./views/pages/energy/overview'))
const Performance = React.lazy(() => import('./views/pages/energy/performance'))
const Trends = React.lazy(() => import('./views/pages/energy/trends'))
const Certificates = React.lazy(() => import('./views/pages/revenue/certificates-and-offsets'))
const Sales = React.lazy(() => import('./views/pages/revenue/sales'))
const ReportsSettings = React.lazy(() => import('./views/pages/reports/settings'));
const ReportsGenerate = React.lazy(() => import('./views/pages/reports/generate'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: i18n.t('Overview'), element: Overview },
  { path: '/user/settings', exact: true, name: i18n.t('User Settings'), element: UserSettings },
  { path: '/client/settings', exact: true, name: i18n.t('Client Settings'), element: ClientSettings },
  { path: '/modules/energy/overview', exact: true, name: i18n.t('Overview'), element: Overview },
  { path: '/modules/energy/trends', exact: true, name: i18n.t('Trends'), element: Trends },
  { path: '/modules/energy/performance', exact: true, name: i18n.t('Performance'), element: Performance },
  { path: '/modules/revenue/certificates-and-offsets', exact: true, name:  i18n.t('Certificates'), element: Certificates },
  { path: '/modules/revenue/sales', exact: true, name: i18n.t('Sales'), element: Sales },
  { path: '/modules/reports/settings', exact: true, name: i18n.t('Reports - Settings'), element: ReportsSettings },
  { path: '/modules/reports/generate', exact: true, name: i18n.t('Reports - Generate'), element: ReportsGenerate },
]

let filteredRoutes = routes;
if(getCookie('functionalities')) {
  const functionalities = JSON.parse(getCookie('functionalities'))
  filteredRoutes = routes.filter(r => functionalities.indexOf(r.path) > -1 )
}

export default filteredRoutes

