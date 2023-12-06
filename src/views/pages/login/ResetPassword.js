import { Navigate, useSearchParams } from 'react-router-dom'

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

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState(false)
  const [changed, setChanged] = useState(false)
  const [message, setMessage] = useState('')
  const { t, i18n } = useTranslation()

  const authenticated = getCookie('name') !== false && getCookie('name') !== ''

  const [queryParameters] = useSearchParams()
  const hasParameters = queryParameters.get('reset_token')!==null

  const sendResetPassword = () => {
    const reset_token = queryParameters.get('reset_token')

    DataAPI({
      endpoint: 'security/authenticate/reset',
      method: 'POST',
      body: {
        id: reset_token,
        newPassword: newPassword,
        newPasswordConfirm: newPasswordConfirm,
      },
    })
      .then((response) => {
        if (response.changed) {
          setChanged(true)
          setMessage(t('Your password was updated'))

          // window.location.reload();
        } else {
          alert(t('An error occurred!'))
        }
      })
      .catch((e) => {
        alert(t('An error occurred!'))
      })
  }

  return (authenticated || !hasParameters) ? (
    <Navigate to={'/'} />
  ) : (
    <div className="bg-gradient-custom c-app solar c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={changed ? '4' : '5'}>
            <CCard className="p-4 border-light shadow">
              <CCardBody>
                {!changed ? (
                  <CForm>
                    <h1 className="text-dark-blue">{t('Reset Password')}</h1>
                    <p className="text-muted">{t('Enter your e-mail address')}</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(ev) => {
                          setNewPassword(ev.target.value)
                        }}
                        type="password"
                        placeholder="New Password"
                        maxLength={100}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={(ev) => {
                          setNewPasswordConfirm(ev.target.value)
                        }}
                        type="password"
                        placeholder="Confirm New Password"
                        maxLength={100}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs="12">
                        <CButton onClick={sendResetPassword} color="primary" className="px-4 mr-3">
                          Send
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                ) : (
                  <div>
                    <CRow className="justify-content-center text-dark text-center">
                      <CCol>
                        <h5>{message}</h5>
                      </CCol>
                    </CRow>
                    <CRow className="text-center">
                      <CCol>
                        <CButton
                          onClick={() => window.open('/', '_top')}
                          color="primary"
                          className="px-4 mt-3"
                        >
                          {t('Go to Login')}
                        </CButton>
                      </CCol>
                    </CRow>
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

export default ResetPassword
