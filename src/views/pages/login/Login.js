import { Navigate } from 'react-router-dom'
import DataAPI from '../../../helpers/DataAPI.js'
import { setCookie } from '../../../helpers/sessionCookie.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/logo-solarec.png'
// import LanguageSwitcher from 'src/views/others/LanguageSwitcher.js'

// eslint-disable-next-line react/prop-types
const Login = ({clickLogin}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const { t } = useTranslation()

  const authenticateUser = () => {
    setLoading(true)
    DataAPI({
      endpoint: 'security/authenticate',
      method: 'POST',
      body: {
        email: username,
        password: password,
      },
    })
      .then((response) => {
        setLoading(false)
        if (response.authenticated) {
          console.log('response~~~~~~', response)

          setCookie('name', response.name)
          setCookie('user', response.id && response.id)
          setCookie('client', response.client.id && response.client.id)
          setCookie('location', response.location.id)
          setCookie('parkType', response.location.type)
          // let functionalities = [...response.functionalities, {'url':'/modules/power-curve/benchmark'}, {'url':'/modules/power-curve/analysis'}];
          // setCookie('functionalities', JSON.stringify(functionalities.map((f) => f.url)))
          setCookie('functionalities', JSON.stringify(response.functionalities.map((f) => f.url)))
          setCookie('dashboard', response.functionalities[0].url)

          setAuthenticated(true)
          window.location.reload()
        } else {
          alert('wrong user!')
        }
      })
      .catch((e) => {
        alert('error!')
      })
  }

  return authenticated ? (
    <Navigate to={'/'} />
  ) : (
    <div className="bg-gradient-custom c-app solar c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="12" lg="9" xl="8" className="px-4">
            <CCard className="shadow p-0 d-flex overflow-hidden">
              <CCardBody className="p-0">
                <CRow className="m-0 flex-column-reverse flex-sm-row">
                <CCol className="p-5 p-sm-5">
                
                  <CForm>
                    <h1 className="text-dark-blue">{t('Login')}</h1>
                    <p className="text-muted">{t('Sign In to your account')}</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(ev) => {
                          setUsername(ev.target.value)
                        }}
                        value={username}
                        type="text"
                        data-testid="username"
                        placeholder={t('E-mail')}
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(ev) => {
                          setPassword(ev.target.value)
                        }}
                        type="password"
                        data-testid="password"
                        placeholder={t('Password')}
                        autoComplete="current-password"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="6">
                        <CButton 
                          onClick={authenticateUser}
                          data-testid="login-button"
                          color="primary" 
                          disabled={loading}
                          className="px-4 mr-1">
                          {t('Login')}
                        </CButton>
                      </CCol>
                      <CCol
                        xs="6"
                        className="text-end d-flex justify-content-end align-items-center px-0"
                      >
                        {/* <a href="/requestPasswordReset" className="text-dark-blue">{t('Reset password?')}</a> */}
                        <CButton
                          color="link"
                          data-testid="password-reset"
                          className="text-dark-blue"
                          href="/requestPasswordReset"
                        >
                          {t('Reset password?')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                {/* </CCardBody> */}
                </CCol>
                <CCol
                  className="text-dark bg-login-right border-light py-5 d-md-down-none text-center d-flex justify-content-center align-items-center flex-column"
                  sm="5"
                >
                  {/* <CCardBody className="text-center"> */}
                      <img src={logo} width="250" alt="Solarec" className="mb-3 mw-100" />
                      <p>{t('Please login with your e-mail and password.')}</p>
                  {/* </CCardBody> */}
                </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {/* <LanguageSwitcher /> */}
      </CContainer>
    </div>
  )
}

export default Login
