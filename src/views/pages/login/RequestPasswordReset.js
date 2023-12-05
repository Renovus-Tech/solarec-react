import { Navigate } from 'react-router-dom'
import DataAPI from '../../../helpers/DataAPI.js'
import { getCookie } from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'

import React, { useState } from 'react'
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
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [message, setMessage] = useState('')
  const { t } = useTranslation()

  const authenticated = getCookie('name') !== false && getCookie('name') !== ''

  const sendPasswordResetRequest = () => {
    DataAPI({
      endpoint: 'security/authenticate/reset/' + email,
      method: 'GET',
    })
      .then((response) => {
        if (response.received) {
          setEmailSent(true)
          setMessage(
            "An e-mail has been sent with the instruction to set your new password. If you don't receive it in the next minute try re-sending the request.",
          )
        } else {
          alert('An error occurred!')
        }
      })
      .catch((e) => {
        alert('An error occurred!')
      })
  }

  const resendRequest = () => {
    setEmailSent(false)
    setMessage('')
  }

  return authenticated ? (
    <Navigate to={'/'} />
  ) : (
    <div className="bg-gradient-custom c-app solar c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="6">
            <CCard className="p-4 border-light shadow">
              <CCardBody>
                {!emailSent ? (
                  <CForm>
                    <h1 className="text-dark-blue">{t('Reset Password')}</h1>
                    <p className="text-muted">{t('Enter your e-mail address')}</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(ev) => {
                          setEmail(ev.target.value)
                        }}
                        value={email}
                        type="text"
                        placeholder={t('E-mail')}
                        autoComplete="username"
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="12">
                        <CButton
                          onClick={sendPasswordResetRequest}
                          color="primary"
                          className="px-4 mr-3"
                        >
                          {t('Send')}
                        </CButton>
                        <CButton color="link" className="px-3 mr-3 text-dark-blue" href="/">
                          {t('Back to Login')}
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                ) : (
                  <div className="text-center">
                    <div className="text-dark mb-3">{message}</div>
                    <CButton onClick={resendRequest} color="primary" className="px-4 mr-3">
                      {t('Re-send email')}
                    </CButton>
                    <CButton color="link" className="px-3 mr-3 text-dark-blue d-block" href="/">
                      {t('Back to Login')}
                    </CButton>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default RequestPasswordReset
