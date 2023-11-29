import React, { useState, useEffect } from 'react'

import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CFormGroup,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
  CInputGroupAppend
} from '@coreui/react'

import CIcon from '@coreui/icons-react'
import { useTranslation } from 'react-i18next';
import DataAPI from '../../../helpers/DataAPI.js'
import { setCookie } from 'src/helpers/sessionCookie.js'


const Settings = () => {
  const {t, i18n} = useTranslation()
  const [loading, setLoading] = useState(false);
  const [dRecsSoldPorcentage , setDRecsSoldPorcentage ] = useState([]);
  const [dRecsPrice , setDRecsPrice ] = useState(false);
  const [clientPreferencesChanged, setClientPreferencesChanged] = useState(false);
  const [clientPreferencesSaved, setClientPreferencesSaved] = useState(false);
  const [clientResponse, setClientResponse] = useState(null);
  

  useEffect(() => {
    loadUser();
  }, []);


  const loadUser = () => {

    setLoading(true);

    DataAPI({
      'endpoint': 'admin/clients/current',
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

        setClientResponse(response)
        response.settings.forEach(setting => {
          if (setting.name === "dRecsSoldPorcentage") {
            setDRecsSoldPorcentage(setting.value)
            setCookie('dRecsSoldPorcentage',setting.value)
          } else if (setting.name === "dRecsPrice") {
            setDRecsPrice(setting.value)
            setCookie('dRecsPrice',setting.value)
          } 
        });

      }
    );

  }


  const saveClientPreferences = () => {
    if (clientPreferencesChanged) savePreferences()
  }

  const savePreferences = () => {
    
    setClientPreferencesChanged(false)

    const body = {}
    body.settings = [
      {
        "name":"dRecsSoldPorcentage",
        "value":dRecsSoldPorcentage
      },
      {
        "name":"dRecsPrice",
        "value":dRecsPrice
      }
    ]

    DataAPI({
      'endpoint': 'admin/clients/current',
      'method': 'POST',
      'body': body
    }).then(
      response => {

        if (response.error) {
           if (response.error.message) {
            return(alert(response.error.message))
           } else {
            return(alert(response.error)) 
           }
        }     
        
        setClientPreferencesSaved(true)
        setCookie('dRecsSoldPorcentage',dRecsSoldPorcentage)
        setCookie('dRecsPrice',dRecsPrice)
          
      }
    );

  }

  const handleDRecsSoldPorcentageChange = (value) => {
    setClientPreferencesChanged(true);
    if (value>=0 && value<=100)
      setDRecsSoldPorcentage(value)
  };

  const handleDRecsPriceChange = (value) => {
    setClientPreferencesChanged(true);
    if (value>=0)
      setDRecsPrice(value)
  };


  return (
    <div>
      <CRow>
        <CCol>
          <CCard sm="7" className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <h3 id="settings" className="card-title mb-0">
                    {t('Client Settings')}
                  </h3>
                </CCol>
              </CRow>
            </CCardHeader>
      
            <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>

              {/* <CRow className={'pb-2 mb-3 border-bottom'}>
                <CCol sm="6">
                  <h5 id="settings" className="card-title mb-0 row">
                    Fiscal Year settings
                  </h5>
                </CCol>
              </CRow> */}

              <CRow className="mb-0">
                <CCol>
                  <CForm>
                    <CFormGroup style={{maxWidth:'270px'}}>
                      <CInputGroup className={'mb-3'}>
                        <CInputGroupPrepend>
                          <CInputGroupText style={{maxWidth:'156px'}}>
                          {t('dRecs Sold Porcentage')}
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type='number' min='0' max='100' custom value={dRecsSoldPorcentage} onChange={(ev) => { handleDRecsSoldPorcentageChange(ev.target.value)}} name="dRecsSoldPorcentage" id="dRecsSoldPorcentage" className={"input-sm"} >
                        </CInput>
                        <CInputGroupAppend>
                          <CInputGroupText className={'bg-white text-dark'} style={{width:'50px'}}>
                            %
                          </CInputGroupText>
                        </CInputGroupAppend>
                      </CInputGroup>
                      <CInputGroup>
                        <CInputGroupPrepend>
                          <CInputGroupText style={{maxWidth:'156px'}}>
                          {t('dRecs Price')}
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type='number' min='0' custom value={dRecsPrice} onChange={(ev) => { handleDRecsPriceChange(ev.target.value)}} name="dRecsPrice" id="dRecsPrice" className={"input-sm"} >
                        </CInput>
                        <CInputGroupAppend>
                          <CInputGroupText className={'bg-white text-dark'} style={{width:'50px'}}>
                            USD
                          </CInputGroupText>
                        </CInputGroupAppend>
                      </CInputGroup>
                    </CFormGroup>
                  </CForm>
                </CCol>
              </CRow>


              <CRow className="mt-1">
                <CCol>
                  <CForm>
                      <CButton onClick={() => {saveClientPreferences();} } color="primary" className="px-4 mr-3" disabled={!clientPreferencesChanged}>{t('Save Preferences')}</CButton>
                      { clientPreferencesSaved && !clientPreferencesChanged &&
                        <div className="text-success d-inline-block" style={{fontWeight:"500"}}>Saved!</div> 
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
