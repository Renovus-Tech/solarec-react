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
  CFormSelect,
  CAlert,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons'
import DataAPI from '../../../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'
import { setCookie } from '../../../helpers/sessionCookie.js'

const Settings = () => {
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
        setLanguage(response.language)
      })
    }
    loadUser()
  }, [generatorsLoaded])

  const enableSave = () => {}

  const saveSettings = () => {
    setChanging(true)
    DataAPI({
      endpoint: 'security/authenticate/current',
      method: 'POST',
      body: {
        language: language,
      },
    }).then((response) => {
      setChanging(false)
      if (response.changed) {
        setSettingsSaved(true)
        setSettingsChanged(false)
        setSettingsMessage(t('Your settings were updated.'))
        setCookie('language',language)
      } else {
        setSettingsErrorMessage(response.error || t('Error saving settings'))
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
                              className="px-4 text-white"
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
                      >
                        <option value="en">{t('English')}</option>
                        <option value="es">{t('Spanish')}</option>
                        <option value="fr">{t('French')}</option>
                        <option value="pt">{t('Portuguese')}</option>
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
                        >
                          {t('Save')}
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
