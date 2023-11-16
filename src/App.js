import {getCookie} from './helpers/sessionCookie.js'
import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import SessionTimeout from './helpers/SessionTimeout';
import './scss/style.scss';
import { useTranslation} from 'react-i18next';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)




// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'));
const RequestPasswordReset = React.lazy(() => import('./views/pages/login/RequestPasswordReset'));
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));
// const PowerCurve = React.lazy(() => import('./views/pages/power-curve/power-curve'));

class App extends Component {

    constructor(props) {
      super(props)
      this.state ={
        authenticated: getCookie('name')!==false && getCookie('name')!==''
      }
    }

    

  render() {

    return (

      this.state.authenticated ?

      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/login" name="Login Page" render={props => <Login {...props}/>} />
              <Route exact path="/register" name="Register Page" render={props => <Register {...props}/>} />
              <Route exact path="/404" name="Page 404" render={props => <Page404 {...props}/>} />
              <Route exact path="/500" name="Page 500" render={props => <Page500 {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />

              
            </Switch>
          </React.Suspense>
          <SessionTimeout />
      </HashRouter>

      :

      <HashRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route path="/requestPasswordReset" name="Request password reset" render={props => <RequestPasswordReset {...props}/>} />
              <Route path="/resetPassword" name="Reset password" render={props => <ResetPassword {...props}/>} />
              <Route path="/" name="Home" render={props => <Login {...props}/>} />

              
            </Switch>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;
