import React, { useState, useEffect, useRef } from 'react'
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
  CFormSelect,
  CAlert,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import DataAPI from '../../../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'
import { setCookie, getCookie } from '../../../helpers/sessionCookie.js'

const Settings = () => {
  const initialized = useRef(false)
  const { t } = useTranslation()
  const [language, setLanguage] = useState('')
  const [settingsMessage, setSettingsMessage] = useState('')
  const [settingsChanged, setSettingsChanged] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)
  const [settingsErrorMessage, setSettingsErrorMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [changePassword, setChangePassword] = useState(false)
  const [changing, setChanging] = useState(false)
  const [message, setMessage] = useState('')
  const [differentPassword, setDifferentPassword] = useState(false)
  const [profileErrorMessage, setProfileErrorMessage] = useState('')
  const [generatorsLoaded, setGeneratorsLoaded] = useState(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
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
          setLanguage(getCookie('language'))
        })
      }
      loadUser()
    }
  }, [generatorsLoaded])

  // const enableSave = () => {}

  const saveSettings = () => {
    setChanging(true)
    const body = {}
    body.settings = [
      {
        name: 'language',
        value: language,
      }
    ]
    DataAPI({
      endpoint: 'security/authenticate/current',
      method: 'POST',
      body: body,
    }).then((response) => {
      setChanging(false)
      if (response.error) {
        setSettingsErrorMessage(response.error.message || t('Error saving settings'))
      } else {
        setSettingsSaved(true)
        setSettingsChanged(false)
        setSettingsMessage(t('Your settings were updated.'))
        setSettingsErrorMessage('')
        setCookie('language',language)
        window.location.reload()
      }
    })
  }

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
          setProfileErrorMessage(response.error)
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
              <CRow className="mb-5">
                <CCol>
                  <h4 className="pb-2 mb-4 border-bottom">{t('Profile')}</h4>
                  <CForm>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        // onChange={enableSave}
                        value={name}
                        type="text"
                        placeholder={t('Name')}
                        disabled
                        data-testid="name-input"
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={freeSet.cilEnvelopeClosed} />
                      </CInputGroupText>
                      <CFormInput
                        // onChange={enableSave}
                        value={email}
                        type="text"
                        placeholder={t('E-mail')}
                        disabled
                        data-testid="email-input"
                      />
                    </CInputGroup>

                    {passwordChanged && <CAlert color="success">{message}</CAlert>}
                    {profileErrorMessage !== '' && <CAlert color="danger">{profileErrorMessage}</CAlert>}

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
                            role="input"
                            aria-label="password"
                            placeholder={t('New Password')}
                            maxLength={100}
                            data-testid="password"
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
                            role="input"
                            aria-label="confirm-password"
                            placeholder={t('Confirm New Password')}
                            maxLength={100}
                            data-testid="confirm-password"
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
                              data-testid="save-password-button"
                            >
                              {t('Save new password')}
                            </CButton>
                          </CCol>
                          <CCol xs="auto">
                            <CButton
                              onClick={() => setChangePassword(false)}
                              color="secondary"
                              className="px-4 text-white"
                              disabled={changing}
                              data-testid="cancel-change-password-button"
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
                            data-testid="change-password-button"
                          >
                            {t('Change Password')}
                          </CButton>
                        </CCol>
                      </CRow>
                    )}
                  </CForm>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <h4 className="pb-2 mb-4 border-bottom">{t('Settings')}</h4>
                  <CForm>

                    {settingsSaved && <CAlert color="success">{settingsMessage}</CAlert>}
                    {settingsErrorMessage !== '' && <CAlert color="danger">{settingsErrorMessage}</CAlert>}

                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        Language
                      </CInputGroupText>
                      <CFormSelect
                        className={'input-sm'}
                        value={language}
                        disabled={changing}
                        onChange={(ev) => {
                          setLanguage(ev.target.value)
                          setSettingsChanged(true)
                        }}
                        name="language"
                        id="language"
                        data-testid="language-input"
                      >
                        <option value="EN">{t('English')}</option>
                        <option value="ES">{t('Spanish')}</option>
                        <option value="FR">{t('French')}</option>
                        <option value="PT">{t('Portuguese')}</option>
                      </CFormSelect>
                    </CInputGroup>
                    <CRow xs={{ gutterX: 2 }} className={'mt-4'}>
                      <CCol xs="auto">
                        <CButton
                          onClick={() => {
                            saveSettings()
                          }}
                          color="primary"
                          className="px-4 mr-3"
                          disabled={!settingsChanged || changing}
                          data-testid="save-preferences-button"
                        >
                          {t('Save Preferences')}
                        </CButton>
                      </CCol>
                    </CRow>

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
