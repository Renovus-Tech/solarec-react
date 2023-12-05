import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CAlert,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import DataAPI from '../../../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'

const Settings = () => {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [changing, setChanging] = useState(false)
  const [message, setMessage] = useState('')
  const [differentPassword, setDifferentPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [generatorsLoaded, setGeneratorsLoaded] = useState(false)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    DataAPI({
      endpoint: 'security/authenticate/current',
      method: 'GET',
    }).then((response) => {
      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      } else if (!generatorsLoaded && response) {
        setGeneratorsLoaded(true)
      }

      setName(response.name)
      setEmail(response.email)
    })
  }

  const enableSave = () => {}

  const saveNewPassword = () => {
    if (newPassword !== newPasswordConfirm) {
      setDifferentPassword(true)
    } else {
      setChanging(true)
      DataAPI({
        endpoint: 'security/authenticate/reset',
        method: 'POST',
        body: {
          newPassword: newPassword,
          newPasswordConfirm: newPasswordConfirm,
        },
      }).then((response) => {
        if (response.changed) {
          setPasswordChanged(true)
          setChangePassword(false)
          setMessage('Your password was updated.')
        } else {
          setErrorMessage(response.error)
        }
      })
    }
  }

  return (
    <div>
      <CRow>
        <CCol>
          <CCard sm="7" className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <h3 id="settings" className="card-title mb-0">
                    {t('User Settings')}
                  </h3>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
              <CRow className="">
                <CCol>
                  <CForm>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={enableSave}
                        value={name}
                        type="text"
                        placeholder={t('Name')}
                        disabled
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        onChange={enableSave}
                        value={email}
                        type="text"
                        placeholder={t('E-mail')}
                        disabled
                      />
                    </CInputGroup>

                    {passwordChanged && <CAlert color="success">{message}</CAlert>}
                    {errorMessage !== '' && <CAlert color="danger">{errorMessage}</CAlert>}

                    {changePassword ? (
                      <div>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={freeSet.cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            onChange={(ev) => {
                              setDifferentPassword(false)
                              setNewPassword(ev.target.value)
                            }}
                            type="password"
                            placeholder={t('New Password')}
                            maxLength={100}
                          />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupText>
                            <CIcon icon={freeSet.cilLockLocked} />
                          </CInputGroupText>
                          <CFormInput
                            onChange={(ev) => {
                              setDifferentPassword(false)
                              setNewPasswordConfirm(ev.target.value)
                            }}
                            type="password"
                            placeholder={t('Confirm New Password')}
                            maxLength={100}
                          />
                          {differentPassword && (
                            <div className={'text-danger mt-1 w-100'}>
                              {t('Please make sure your passwords match.')}
                            </div>
                          )}
                        </CInputGroup>
                        <CRow xs={{ gutterX: 2 }}>
                          <CCol xs="auto">
                            <CButton
                              onClick={saveNewPassword}
                              color="primary"
                              className="px-4 mr-3"
                              disabled={newPassword === '' || changing}
                            >
                              {t('Save new password')}
                            </CButton>
                          </CCol>
                          <CCol xs="auto">
                            <CButton
                              onClick={() => setChangePassword(false)}
                              color="secondary"
                              className="px-4"
                              disabled={changing}
                            >
                              {t('Cancel')}
                            </CButton>
                          </CCol>
                        </CRow>
                      </div>
                    ) : (
                      <CRow xs={{ gutterX: 2 }} className={'mt-4'}>
                        <CCol xs="auto">
                          <CButton
                            onClick={() => {
                              setChangePassword(true)
                              setPasswordChanged(false)
                            }}
                            color="primary"
                            className="px-4 mr-3"
                          >
                            {t('Change Password')}
                          </CButton>
                        </CCol>
                      </CRow>
                    )}
                  </CForm>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Settings
