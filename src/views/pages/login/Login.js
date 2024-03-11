import { useNavigate } from 'react-router-dom'
import DataAPI from '../../../helpers/DataAPI.js'
import { setCookie } from '../../../helpers/sessionCookie.js'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import logo from '../../../assets/logo.png'

// eslint-disable-next-line react/prop-types
const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const [authenticated, setAuthenticated] = useState(false)
  const { t } = useTranslation()
  const navigate = useNavigate(); 

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
          setCookie('functionalities', JSON.stringify(response.functionalities.map((f) => f.url)))
          setCookie('dashboard', response.functionalities[0].url)
          
          response.settings.forEach((setting) => {
            if (setting.name === 'language') {
              const language = setting.value ? setting.value : setting.valueDefault
              setCookie('language', language)
            }
          })

          window.location.reload()

          // setAuthenticated(true)
        } else {
          // alert(response.error)
          setError(response.error)
        }
      })
      .catch((e) => {
        // alert('error!')
        setError('Error establishing connection.')
      })
  }

  // return authenticated ? (
  //   <Navigate to={'/'} />
  // ) : (

  return (
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
                      { error !== '' && 
                        <CAlert color="danger" data-testid="error">{error}</CAlert>
                      }
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
                        <CButton
                          color="link"
                          data-testid="password-reset"
                          className="text-dark-blue"
                          // href="/requestPasswordReset"
                          onClick={ () => navigate('/requestPasswordReset')}
                        >
                          {t('Reset password?')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCol>
                <CCol
                  className="text-dark bg-login-right border-light py-5 d-md-down-none text-center d-flex justify-content-center align-items-center flex-column"
                  sm="5"
                >
                    <img src={logo} width="250" alt="Solarec" className="mb-3 mw-100" />
                    <p>{t('Please login with your e-mail and password.')}</p>
                </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
