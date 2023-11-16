import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CAlert,
  CLabel,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import DataAPI from '../../../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'

const Settings = () => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordChanged, setPasswordChanged] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState('');
  const [differentPassword, setDifferentPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [generators, setGenerators] = useState([]);
  const [generatorsLoaded, setGeneratorsLoaded] = useState(false);
  
  
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    loadUser();
  }, []);


  const loadUser = () => {

    setLoading(true);
    
    DataAPI({
      'endpoint': 'security/authenticate/current',
      'method': 'GET'
    }).then(
      response => {

        setLoading(false);

        if (response.error) {
          if (response.error.message) {
            return(alert(response.error.message))
          } else {
            return(alert(response.error)) 
          }
        }
        else if (!generatorsLoaded && response) {
          if (response.location.generators != null)
            setGenerators(response.location.generators);
          setGeneratorsLoaded(true)
        }

        setName(response.name)
        setEmail(response.email)
        
      }
    );

  }

  const enableSave = () => {
  }

  const saveNewPassword = () => {
    if (newPassword !== newPasswordConfirm) {
      setDifferentPassword(true);
    } else {
      setChanging(true);
      DataAPI({
        'endpoint': 'security/authenticate/reset',
        'method': 'POST',
        'body': {
          "newPassword": newPassword,
          "newPasswordConfirm": newPasswordConfirm
      }
      }).then(
        response => {
          if (response.changed) {    
            setPasswordChanged(true)
            setChangePassword(false)
            setMessage('Your password was updated.')
          } else {
            setErrorMessage(response.error)
          }
        }
      );
    }

  }



  return (
    <div>
      <CRow>
        <CCol>
          <CCard sm="7" className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol sm="6">
                  <h3 id="settings" className="card-title mb-0">
                  {t('User Settings')}
                  </h3>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
              <CRow className="">
                <CCol md="6" >
                  <CForm>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-user" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput onChange={enableSave} value={name} type="text" placeholder={t('Name')} disabled />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupPrepend>
                        <CInputGroupText>
                          <CIcon name="cil-envelope-closed" />
                        </CInputGroupText>
                      </CInputGroupPrepend>
                      <CInput onChange={enableSave} value={email} type="text" placeholder={t('E-mail')} disabled />
                    </CInputGroup>

                    { passwordChanged &&
                      <CAlert color="success" >{message}</CAlert>
                    }
                    { errorMessage !== '' &&
                      <CAlert color="danger" >{errorMessage}</CAlert>
                    }

                    { changePassword ?
                      <div>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput onChange={(ev) => {setDifferentPassword(false);setNewPassword(ev.target.value)}} type="password" placeholder={t('New Password')} maxLength={100} />
                        </CInputGroup>
                        <CInputGroup className="mb-3">
                          <CInputGroupPrepend>
                            <CInputGroupText>
                              <CIcon name="cil-lock-locked" />
                            </CInputGroupText>
                          </CInputGroupPrepend>
                          <CInput onChange={(ev) => {setDifferentPassword(false);setNewPasswordConfirm(ev.target.value)}} type="password" placeholder={t('Confirm New Password')} maxLength={100}  />
                          { differentPassword &&
                            <CLabel className={'text-danger mt-1 w-100'}>{t('Please make sure your passwords match.')}</CLabel>
                          }
                        </CInputGroup>
                        <CRow>
                          <CCol xs="12">
                            <CButton onClick={saveNewPassword} color="primary" className="px-4 mr-3" disabled={newPassword==='' || changing}>{t('Save new password')}</CButton>
                            <CButton onClick={() => setChangePassword(false)} color="secondary" className="px-4" disabled={changing}>{t('Cancel')}</CButton>
                          </CCol>
                        </CRow>
                      </div>
                      :
                      <CRow className={'mt-4'}>
                        <CCol xs="12">
                          <CButton onClick={() => {setChangePassword(true); setPasswordChanged(false);} } color="primary" className="px-4 mr-3">{t('Change Password')}</CButton>
                        </CCol>
                      </CRow>
                    }
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
