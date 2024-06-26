import React, { Component, Suspense } from 'react'
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom'
import { getCookie } from './helpers/sessionCookie.js'
import './scss/style.scss'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const RequestPasswordReset = React.lazy(() => import('./views/pages/login/RequestPasswordReset'))
const ResetPassword = React.lazy(() => import('./views/pages/login/ResetPassword'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      authenticated: getCookie('name') !== false && getCookie('name') !== '',
    }
  }
  render() {
    return this.state.authenticated ? (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route exact path="/login" name="Login Page" element={<Login />} />
            {/* <Route exact path="/register" name="Register Page" element={<Register />} /> */}
            <Route exact path="/404" name="Page 404" element={<Page404 />} />
            <Route exact path="/500" name="Page 500" element={<Page500 />} />
            <Route path="*" name="Home" element={<DefaultLayout />} />
          </Routes>
        </Suspense>
      </HashRouter>
    ) : (
      <HashRouter>
        <Suspense fallback={loading}>
          <Routes>
            <Route path="/requestPasswordReset" name="Request password reset" element={<RequestPasswordReset />} />
            <Route path="/resetPassword" name="Reset password" element={<ResetPassword />} />
            <Route path="*" name="Home" element={<Login />} />
          </Routes>
        </Suspense>
      </HashRouter>
    )
  }
}

export default App
